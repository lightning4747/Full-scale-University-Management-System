import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload, UserRole } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async (params: SignUpPayload & { providerName?: string }) => {
    // Handle social sign-up (uses the same flow as sign-in for OAuth)
    if (params.providerName) {
      const role = params.role || UserRole.STUDENT;
      // Store the role for after OAuth callback
      localStorage.setItem("pending_role", role);

      // Use better-auth's social sign-in method
      try {
        if (params.providerName === "google") {
          await authClient.signIn.social({
            provider: "google" as const,
            callbackURL: window.location.origin + "/",
          });
        } else if (params.providerName === "github") {
          await authClient.signIn.social({
            provider: "github" as const,
            callbackURL: window.location.origin + "/",
          });
        }
      } catch (error) {
        console.error("Social sign-in error:", error);
        return {
          success: false,
          error: {
            name: "Social login failed",
            message: "Unable to sign in with social provider. Please try again.",
          },
        };
      }

      return {
        success: true,
      };
    }

    // Handle email sign-up
    try {
      const { data, error } = await authClient.signUp.email({
        name: params.name,
        email: params.email,
        password: params.password,
        image: params.image,
        role: params.role || UserRole.STUDENT,
        imageCldPubId: params.imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },
  login: async (params: { email?: string; password?: string; providerName?: string; role?: string }) => {
    // Handle social sign-in
    if (params.providerName) {
      const role = params.role || UserRole.STUDENT;
      // Store the role for after OAuth callback
      localStorage.setItem("pending_role", role);

      // Use better-auth's social sign-in method
      try {
        if (params.providerName === "google") {
          await authClient.signIn.social({
            provider: "google" as const,
            callbackURL: window.location.origin + "/",
          });
        } else if (params.providerName === "github") {
          await authClient.signIn.social({
            provider: "github" as const,
            callbackURL: window.location.origin + "/",
          });
        }
      } catch (error) {
        console.error("Social sign-in error:", error);
        return {
          success: false,
          error: {
            name: "Social login failed",
            message: "Unable to sign in with social provider. Please try again.",
          },
        };
      }

      return {
        success: true,
      };
    }

    // Handle email sign-in
    try {
      const { data, error } = await authClient.signIn.email({
        email: params.email!,
        password: params.password!,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: error?.message || "Invalid email or password.",
          },
        };
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Unable to sign in. Please check your connection and try again.",
        },
      };
    }
  },
  logout: async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("pending_role");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const user = localStorage.getItem("user");

    if (user) {
      return {
        authenticated: true,
      };
    }

    // Try to get session from server (important for OAuth callback)
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        localStorage.setItem("user", JSON.stringify(session.data.user));
        return {
          authenticated: true,
        };
      }
    } catch (error) {
      console.error("Session check error:", error);
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Please sign in to continue.",
      },
    };
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      role: parsedUser.role,
    };
  },
  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },
};
