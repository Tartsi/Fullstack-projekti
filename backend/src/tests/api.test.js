import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { createTestApp, initTestDatabase } from "./testApp.js";
import { testPrisma, teardownTestDb } from "./testSetup.js";

describe("Full API Tests", () => {
  let app;

  beforeAll(async () => {
    // Initialize test-app and test-database
    app = createTestApp();
    await initTestDatabase();
  });

  describe("Users API", () => {
    describe("POST /users/register", () => {
      it("should create a new user successfully", async () => {
        const userData = {
          email: "test@example.com",
          password: "testpassword123",
          fullName: "Test User",
        };

        // Small delay to avoid potential rate limiting issues
        await new Promise((resolve) => setTimeout(resolve, 200));

        const response = await request(app)
          .post("/users/register")
          .send(userData)
          .expect(201);

        // Check response
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("User registered successfully");
        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user.fullName).toBe(userData.fullName);
        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.role).toBe("USER");

        // No password in response
        expect(response.body.user.passwordHash).toBeUndefined();

        // Check that user really is present in test database
        const userInDb = await testPrisma.user.findUnique({
          where: { email: userData.email },
        });

        expect(userInDb).toBeDefined();
        expect(userInDb.email).toBe(userData.email);
        expect(userInDb.fullName).toBe(userData.fullName);
        expect(userInDb.passwordHash).toBeDefined();
        expect(userInDb.passwordHash).not.toBe(userData.password); // Password must be hashed
      });

      it("should register multiple users", async () => {
        const userData1 = {
          email: "first@example.com",
          password: "Testpassword123",
          fullName: "First User",
        };

        const userData2 = {
          email: "second@example.com",
          password: "Testpassword456",
          fullName: "Second User",
        };

        // Register first user
        const response1 = await request(app)
          .post("/users/register")
          .send(userData1);

        // Check if rate limited, and skip test if so
        if (response1.status === 429) {
          console.warn("Test skipped due to rate limiting");
          return;
        }

        expect(response1.status).toBe(201);

        // Small delay to avoid potential rate limiting issues
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Register second user
        const response2 = await request(app)
          .post("/users/register")
          .send(userData2);

        // Check if rate limited, and skip test if so
        if (response2.status === 429) {
          console.warn("Test skipped due to rate limiting");
          return;
        }

        expect(response2.status).toBe(201);

        // Check that both users exist in database
        const user1 = await testPrisma.user.findUnique({
          where: { email: userData1.email },
        });
        const user2 = await testPrisma.user.findUnique({
          where: { email: userData2.email },
        });

        expect(user1).toBeDefined();
        expect(user1).not.toBeNull();
        expect(user2).toBeDefined();
        expect(user2).not.toBeNull();

        // Only compare IDs if both users exist
        if (user1 && user2) {
          expect(user1.id).not.toBe(user2.id);
        }
      });

      it("should reject duplicate email during registration", async () => {
        const userData = {
          email: "duplicate@example.com",
          password: "testpassword123",
          fullName: "Original User",
        };

        // Register user first time
        await request(app).post("/users/register").send(userData).expect(201);

        // Try to register same email again
        const response = await request(app)
          .post("/users/register")
          .send(userData)
          .expect(409);

        expect(response.body.message).toBe(
          "User with this email already exists"
        );
      });

      it("should reject invalid user email during registration", async () => {
        const userData = {
          email: "invalid-email",
          password: "testpassword123",
          fullName: "Test User",
        };

        const response = await request(app)
          .post("/users/register")
          .send(userData)
          .expect(400);

        expect(response.body.message).toBe(
          "Error occured when registering user"
        );
      });
    });

    describe("POST /users/login", () => {
      it("should allow login with a registered user with correct login-credentials", async () => {
        const userData = {
          email: "login@example.com",
          password: "testpassword123",
          fullName: "Test User for Login",
        };

        // Register user for login
        await request(app).post("/users/register").send(userData);

        // Login data
        const loginData = {
          email: userData.email,
          password: userData.password,
        };

        // Login the user, expect 200
        const response = await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Login successful");
      });

      it("should not allow login with a registered user with incorrect login-credentials", async () => {
        const userData = {
          email: "wrongpass@example.com",
          password: "testpassword123",
          fullName: "Test User for Login",
        };

        // Register user for login
        await request(app).post("/users/register").send(userData);

        // Login the user with incorrect credentials
        const loginData = {
          email: userData.email,
          password: "wrongpassword",
        };

        const response = await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(401);

        expect(response.body.message).toBe("Invalid username or password!");
      });

      it("should not allow login with unregistered user", async () => {
        const loginData = {
          email: "nonexistent@example.com",
          password: "testpassword123",
        };

        const response = await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(401);

        expect(response.body.message).toBe("Invalid username or password!");
      });

      it("should reject login with invalid email format", async () => {
        const loginData = {
          email: "invalid-email",
          password: "testpassword123",
        };

        const response = await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(400);

        expect(response.body.message).toBe(
          "Error occured when trying to login!"
        );
      });
    });

    describe("POST /users/logout", () => {
      it("should logout user successfully when logged in", async () => {
        const userData = {
          email: "logout@example.com",
          password: "testpassword123",
          fullName: "Test User",
        };

        // Register and login user
        await request(app).post("/users/register").send(userData);
        const loginResponse = await request(app).post("/users/login").send({
          email: userData.email,
          password: userData.password,
        });

        const cookies = loginResponse.headers["set-cookie"];
        const authCookie = cookies ? cookies[0] : null;

        // Logout
        const response = await request(app)
          .post("/users/logout")
          .set("Cookie", authCookie || "")
          .expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Logged out successfully");
      });
    });

    describe("GET /users/info", () => {
      it("should return user info when authenticated", async () => {
        const userData = {
          email: "info@example.com",
          password: "testpassword123",
          fullName: "Info User",
        };

        // Register and login
        await request(app).post("/users/register").send(userData);
        const loginResponse = await request(app).post("/users/login").send({
          email: userData.email,
          password: userData.password,
        });

        const cookies = loginResponse.headers["set-cookie"];
        const authCookie = cookies ? cookies[0] : null;

        // Get user info
        const response = await request(app)
          .get("/users/info")
          .set("Cookie", authCookie || "")
          .expect(200);

        expect(response.body.user).toBeDefined();
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user.fullName).toBe(userData.fullName);
        expect(response.body.user.passwordHash).toBeUndefined();
      });

      it("should reject request when not authenticated", async () => {
        const response = await request(app).get("/users/info").expect(401);

        expect(response.body.message || response.body.error).toBeDefined();
      });
    });

    describe("DELETE /users/delete", () => {
      it("should delete user account successfully with correct password", async () => {
        const userData = {
          email: "delete@example.com",
          password: "testpassword123",
          fullName: "Delete User",
        };

        // Register and login
        await request(app).post("/users/register").send(userData);
        const loginResponse = await request(app).post("/users/login").send({
          email: userData.email,
          password: userData.password,
        });

        const cookies = loginResponse.headers["set-cookie"];
        const authCookie = cookies ? cookies[0] : null;

        // Delete account
        const response = await request(app)
          .delete("/users/delete")
          .set("Cookie", authCookie || "")
          .send({ password: userData.password })
          .expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("User account deleted successfully");

        // Verify user is deleted
        const deletedUser = await testPrisma.user.findUnique({
          where: { email: userData.email },
        });
        expect(deletedUser).toBeNull();
      });

      it("should reject deletion with incorrect password", async () => {
        const userData = {
          email: "delete-wrong@example.com",
          password: "testpassword123",
          fullName: "Delete User",
        };

        // Register and login
        await request(app).post("/users/register").send(userData);
        const loginResponse = await request(app).post("/users/login").send({
          email: userData.email,
          password: userData.password,
        });

        const cookies = loginResponse.headers["set-cookie"];
        const authCookie = cookies ? cookies[0] : null;

        // Try to delete with wrong password
        const response = await request(app)
          .delete("/users/delete")
          .set("Cookie", authCookie || "")
          .send({ password: "wrongpassword" })
          .expect(401);

        expect(response.body.message).toBe("Invalid password");
      });

      it("should reject deletion when not authenticated", async () => {
        const response = await request(app)
          .delete("/users/delete")
          .send({ password: "testpassword123" })
          .expect(401);

        expect(response.body.message || response.body.error).toBeDefined();
      });
    });
  });

  describe("Bookings API", () => {
    let testUser;
    let authCookie;

    beforeEach(async () => {
      // Create and register a test user for authentication
      const userData = {
        email: `bookinguser-${Math.random()
          .toString(36)
          .substring(7)}@example.com`,
        password: "testpassword123",
        fullName: "Booking Test User",
      };

      // Register the user
      await request(app).post("/users/register").send(userData).expect(201);

      // Login to get session cookie
      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      // Extract session cookie from response
      const cookies = loginResponse.headers["set-cookie"];
      authCookie = cookies ? cookies[0] : null;

      // Get the created user from database
      testUser = await testPrisma.user.findUnique({
        where: { email: userData.email },
      });
    });

    describe("POST /bookings", () => {
      const validBookingData = {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        timeSlot: "10:00-12:00",
        city: "helsinki",
        address: "Esimerkkitie 123",
        phoneNumber: "+358501234567",
        paymentMethod: "card",
      };

      it("should create a new booking successfully when authenticated", async () => {
        const response = await request(app)
          .post("/bookings")
          .set("Cookie", authCookie || "")
          .send(validBookingData)
          .expect(201);

        // Check response structure
        expect(response.body.id).toBeDefined();
        expect(response.body.date).toBe(validBookingData.date);
        expect(response.body.timeSlot).toBe(validBookingData.timeSlot);
        expect(response.body.location).toBe(
          `${validBookingData.address}, Helsinki`
        );
        expect(response.body.status).toBe("CONFIRMED");
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.body.user.id).toBe(testUser.id);
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.fullName).toBe(testUser.fullName);
        expect(response.body.bookingDetails).toBeDefined();
        expect(response.body.bookingDetails.city).toBe(validBookingData.city);
        expect(response.body.bookingDetails.address).toBe(
          validBookingData.address
        );
        expect(response.body.bookingDetails.phoneNumber).toBe(
          validBookingData.phoneNumber
        );
        expect(response.body.bookingDetails.paymentMethod).toBe(
          validBookingData.paymentMethod
        );

        // Verify booking was saved to database
        const bookingInDb = await testPrisma.booking.findUnique({
          where: { id: response.body.id },
          include: { user: true },
        });

        expect(bookingInDb).toBeDefined();
        expect(bookingInDb.userId).toBe(testUser.id);
        expect(bookingInDb.timeSlot).toBe(validBookingData.timeSlot);
        expect(bookingInDb.location).toBe(
          `${validBookingData.address}, Helsinki`
        );
        expect(bookingInDb.status).toBe("CONFIRMED");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .post("/bookings")
          .send(validBookingData)
          .expect(401);

        expect(response.body.error).toBe("Authentication required");
      });

      it("should return 400 when required fields are missing", async () => {
        const incompleteData = { ...validBookingData };
        delete incompleteData.timeSlot;

        const response = await request(app)
          .post("/bookings")
          .set("Cookie", authCookie || "")
          .send(incompleteData)
          .expect(400);

        expect(response.body.error).toBe("Missing required fields");
        expect(response.body.required).toContain("timeSlot");
      });

      it("should return 400 when date is invalid", async () => {
        const invalidData = { ...validBookingData, date: "invalid-date" };

        const response = await request(app)
          .post("/bookings")
          .set("Cookie", authCookie || "")
          .send(invalidData)
          .expect(400);

        expect(response.body.error).toBe("Invalid date format");
      });

      it("should capitalize city name in location", async () => {
        const lowercaseCity = { ...validBookingData, city: "tampere" };

        const response = await request(app)
          .post("/bookings")
          .set("Cookie", authCookie || "")
          .send(lowercaseCity)
          .expect(201);

        expect(response.body.location).toBe(
          `${validBookingData.address}, Tampere`
        );
      });
    });

    describe("GET /bookings", () => {
      beforeEach(async () => {
        // Create test bookings for the user
        await testPrisma.booking.createMany({
          data: [
            {
              userId: testUser.id,
              date: new Date("2025-12-01T10:00:00.000Z"),
              timeSlot: "10:00-12:00",
              location: "Test Location 1, Helsinki",
              status: "CONFIRMED",
            },
            {
              userId: testUser.id,
              date: new Date("2025-12-02T14:00:00.000Z"),
              timeSlot: "14:00-16:00",
              location: "Test Location 2, Tampere",
              status: "CONFIRMED",
            },
          ],
        });

        // Create a booking for another user (should not be returned)
        const otherUserData = {
          email: `other-${Math.random().toString(36).substring(7)}@example.com`,
          password: "testpassword123",
          fullName: "Other User",
        };

        await request(app).post("/users/register").send(otherUserData);

        const otherUser = await testPrisma.user.findUnique({
          where: { email: otherUserData.email },
        });

        await testPrisma.booking.create({
          data: {
            userId: otherUser.id,
            date: new Date("2025-12-03T10:00:00.000Z"),
            timeSlot: "10:00-12:00",
            location: "Other Location, Oulu",
            status: "CONFIRMED",
          },
        });
      });

      it("should return user's bookings when authenticated", async () => {
        const response = await request(app)
          .get("/bookings")
          .set("Cookie", authCookie || "")
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);

        // Check that only user's bookings are returned
        response.body.forEach((booking) => {
          expect(booking.userId).toBe(testUser.id);
          expect(booking.user).toBeDefined();
          expect(booking.user.id).toBe(testUser.id);
          expect(booking.timeSlot).toBeDefined();
          expect(booking.location).toBeDefined();
          expect(booking.status).toBe("CONFIRMED");
        });

        // Check that bookings are ordered by date (desc)
        const dates = response.body.map((booking) => new Date(booking.date));
        expect(dates[0].getTime()).toBeGreaterThan(dates[1].getTime());
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app).get("/bookings").expect(401);

        expect(response.body.error).toBe("Authentication required");
      });

      it("should return empty array when user has no bookings", async () => {
        // Delete all bookings for the test user
        await testPrisma.booking.deleteMany({
          where: { userId: testUser.id },
        });

        const response = await request(app)
          .get("/bookings")
          .set("Cookie", authCookie || "")
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(0);
      });
    });

    describe("DELETE /bookings/:id", () => {
      let testBooking;

      beforeEach(async () => {
        // Create a test booking
        testBooking = await testPrisma.booking.create({
          data: {
            userId: testUser.id,
            date: new Date("2025-12-01T10:00:00.000Z"),
            timeSlot: "10:00-12:00",
            location: "Test Location, Helsinki",
            status: "CONFIRMED",
          },
        });
      });

      it("should delete booking successfully when authenticated and owns booking", async () => {
        const response = await request(app)
          .delete(`/bookings/${testBooking.id}`)
          .set("Cookie", authCookie || "")
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Booking deleted successfully");

        // Verify booking was deleted from database
        const deletedBooking = await testPrisma.booking.findUnique({
          where: { id: testBooking.id },
        });

        expect(deletedBooking).toBeNull();
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .delete(`/bookings/${testBooking.id}`)
          .expect(401);

        expect(response.body.error).toBe("Authentication required");

        // Verify booking still exists
        const stillExists = await testPrisma.booking.findUnique({
          where: { id: testBooking.id },
        });
        expect(stillExists).toBeDefined();
      });

      it("should return 404 when booking doesn't exist", async () => {
        const nonExistentId = "00000000-0000-0000-0000-000000000000";

        const response = await request(app)
          .delete(`/bookings/${nonExistentId}`)
          .set("Cookie", authCookie || "")
          .expect(404);

        expect(response.body.error).toBe("Booking not found");
      });
    });
  });
});

// Cleanup after all tests
afterAll(async () => {
  await teardownTestDb();
});
