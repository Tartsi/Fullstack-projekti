import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp, initTestDatabase } from "./testApp.js";
import { testPrisma } from "./testSetup.js";

describe("Users API", () => {
  let app;

  beforeAll(async () => {
    // Initialize test-app and test-database
    app = createTestApp();
    await initTestDatabase();
  });

  describe("POST /users/register", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "testpassword123",
        fullName: "Test User",
      };

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
      const firstRegisterData = {
        email: "test@example.com",
        password: "Password123",
        fullName: "Test User",
      };

      // Expect 201 for first register
      await request(app)
        .post("/users/register")
        .send(firstRegisterData)
        .expect(201);

      const secondRegisterData = {
        email: "second@example.com",
        password: "Password123",
        fullName: "Second User",
      };

      // Expect 201 for second register
      const response = await request(app)
        .post("/users/register")
        .send(secondRegisterData)
        .expect(201);

      // Check response
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(secondRegisterData.email);
      expect(response.body.user.fullName).toBe(secondRegisterData.fullName);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.role).toBe("USER");

      // Check that 2 users really exist in the database
      const usersInDb = await testPrisma.user.count();
      expect(usersInDb).toEqual(2);
    });

    it("should reject duplicate email during registration", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "testpassword123",
        fullName: "Duplicate User",
      };

      // Register the user for the first time
      await request(app).post("/users/register").send(userData).expect(201);

      // Attempt to register the same user again
      // Expect 409 - Conflict
      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(409);

      // Check response
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("User with this email already exists");

      // Verify only one user exists in the database
      const usersInDb = await testPrisma.user.findMany({
        where: { email: userData.email },
      });
      expect(usersInDb).toHaveLength(1);
    });

    it("should reject invalid user email during registration", async () => {
      const userData = {
        email: "invalid-email",
        password: "testpassword123",
        fullName: "Test User Wrong Email",
      };

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe("Error occured when registering user");

      // Check that no user is present in test database
      const userInDb = await testPrisma.user.findUnique({
        where: { email: userData.email },
      });

      expect(userInDb).toBeNull(); // Ensure no user is created in the database
    });
  });

  describe("POST /users/login", () => {
    it("should allow login with a registered user with correct login-credentials", async () => {
      const userData = {
        email: "test@example.com",
        password: "testpassword123",
        fullName: "Test User for Login",
      };

      // Register user for login
      await request(app).post("/users/register").send(userData).expect(201);

      // Login data
      const loginData = {
        email: "test@example.com",
        password: "testpassword123",
      };

      // Login the user, expect 200
      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(200);

      // Response checks
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("Login successful");
    });

    it("should not allow login with a registered user with incorrect login-credentials", async () => {
      const userData = {
        email: "test@example.com",
        password: "testpassword123",
        fullName: "Test User for Login",
      };

      // Register user for login
      await request(app).post("/users/register").send(userData).expect(201);

      // Login the user with incorrect credentials
      const loginData = {
        email: "test@example.com",
        password: "testpassword1234",
      };

      // Expect 401
      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(401);

      // Response checks
      expect(response.body.ok).toBe(false);
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

      // Response checks
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Invalid username or password!");
    });

    it("should reject login with invalid email format", async () => {
      const loginData = {
        email: "invalid-email-format",
        password: "testpassword123",
      };

      const response = await request(app)
        .post("/users/login")
        .send(loginData)
        .expect(400);

      // Response checks
      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Error occured when trying to login!");
    });
  });

  describe("POST /users/logout", () => {
    it("should logout user successfully when logged in", async () => {
      const userData = {
        email: "logout@example.com",
        password: "testpassword123",
        fullName: "Logout User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      // Extract session cookie
      const cookies = loginResponse.headers["set-cookie"];

      // Logout including session cookie
      const response = await request(app)
        .post("/users/logout")
        .set("Cookie", cookies)
        .expect(200);

      // Response checks
      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("POST /users/reset-password", () => {
    it("should accept password reset request for existing user", async () => {
      const userData = {
        email: "reset@example.com",
        password: "testpassword123",
        fullName: "Reset User",
      };

      // Register user first
      await request(app).post("/users/register").send(userData).expect(201);

      const response = await request(app)
        .post("/users/reset-password")
        .send({ email: userData.email })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("Password reset instructions sent!");
    });

    it("should accept password reset request for non-existing user (security)", async () => {
      const response = await request(app)
        .post("/users/reset-password")
        .send({ email: "nonexistent@example.com" })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("Password reset instructions sent!");
    });

    it("should reject invalid email format for password reset", async () => {
      const response = await request(app)
        .post("/users/reset-password")
        .send({ email: "invalid-email" })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Invalid email format");
    });
  });

  describe("GET /users/info", () => {
    it("should return user info when authenticated", async () => {
      const userData = {
        email: "info@example.com",
        password: "testpassword123",
        fullName: "Info User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Get user info
      const response = await request(app)
        .get("/users/info")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.fullName).toBe(userData.fullName);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.role).toBe("USER");
      expect(response.body.user.createdAt).toBeDefined();
      // Ensure no password hash is returned
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it("should reject request when not authenticated", async () => {
      const response = await request(app).get("/users/info").expect(401);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Authentication required");
    });
  });

  describe("GET /users/bookings", () => {
    it("should return empty bookings array for authenticated user by default", async () => {
      const userData = {
        email: "bookings@example.com",
        password: "testpassword123",
        fullName: "Bookings User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Get user bookings
      const response = await request(app)
        .get("/users/bookings")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.bookings).toBeDefined();
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings).toHaveLength(0);
    });

    it("should reject request when not authenticated", async () => {
      const response = await request(app).get("/users/bookings").expect(401);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Authentication required");
    });
  });

  describe("DELETE /users/delete", () => {
    it("should delete user account successfully with correct password", async () => {
      const userData = {
        email: "delete@example.com",
        password: "testpassword123",
        fullName: "Delete User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Delete user account
      const response = await request(app)
        .delete("/users/delete")
        .set("Cookie", cookies)
        .send({ password: userData.password })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe("User account deleted successfully");

      // Verify user is deleted from database
      const userInDb = await testPrisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(userInDb).toBeNull();
    });

    it("should reject deletion with incorrect password", async () => {
      const userData = {
        email: "delete-wrong@example.com",
        password: "testpassword123",
        fullName: "Delete Wrong User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Try to delete with wrong password
      const response = await request(app)
        .delete("/users/delete")
        .set("Cookie", cookies)
        .send({ password: "wrongpassword" })
        .expect(401);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Invalid password");

      // Verify user still exists
      const userInDb = await testPrisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(userInDb).not.toBeNull();
    });

    it("should reject deletion when not authenticated", async () => {
      const response = await request(app)
        .delete("/users/delete")
        .send({ password: "somepassword" })
        .expect(401);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Authentication required");
    });

    it("should reject deletion without password", async () => {
      const userData = {
        email: "delete-nopass@example.com",
        password: "testpassword123",
        fullName: "Delete No Password User",
      };

      // Register and login user
      await request(app).post("/users/register").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Try to delete without password
      const response = await request(app)
        .delete("/users/delete")
        .set("Cookie", cookies)
        .send({})
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toBe("Password is required");
    });
  });
});
