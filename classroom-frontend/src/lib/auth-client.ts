import { createAuthClient } from "better-auth/react";

// Better Auth client - connects to backend auth endpoints
// The backend auth routes are at http://localhost:8000/api/auth/*
export const authClient = createAuthClient({
  // Base URL should be the root of the backend server (without /api)
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "") || "http://localhost:8000",

  // This must match the basePath configured in the backend's betterAuth config
  basePath: "/api/auth",

  // Fetch with credentials to send cookies
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
      departmentId: {
        type: "number",
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
