import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

// This configures a request mocking server for testing
export const server = setupServer(...handlers);
