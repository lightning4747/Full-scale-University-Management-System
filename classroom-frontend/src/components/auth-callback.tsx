
import { useEffect } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const AuthCallback = () => {
    const { data: authData } = useIsAuthenticated();

    useEffect(() => {
        const handleAuthSync = async () => {
            const signupRole = localStorage.getItem("oauth_signup_role");
            const loginRole = localStorage.getItem("pending_role");

            if (authData?.authenticated) {
                const session = await authClient.getSession();
                const user = session.data?.user as any;

                // 1. Handle Role Verification (Redirect Guard)
                if (loginRole && user && user.role !== loginRole) {
                    console.log("Role mismatch detected. Logging out.");
                    await authClient.signOut();
                    localStorage.removeItem("user");
                    localStorage.removeItem("pending_role");
                    localStorage.removeItem("oauth_signup_role");
                    window.location.href = "/login?error=role_mismatch";
                    return;
                }

                // 2. Handle Role Sync for New Signups
                if (signupRole) {
                    console.log("Syncing role for OAuth user:", signupRole);
                    try {
                        const response = await fetch("http://localhost:8000/api/users/me/role", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            // Include credentials for session cookies
                            credentials: "include",
                            body: JSON.stringify({ role: signupRole }),
                        });

                        if (response.ok) {
                            // Update local user data if needed
                            const updatedSession = await authClient.getSession();
                            if (updatedSession.data?.user) {
                                localStorage.setItem("user", JSON.stringify(updatedSession.data.user));
                                // Reload to ensure all components see the new role
                                window.location.reload();
                            }
                        } else {
                            console.error("Failed to update role:", await response.text());
                        }
                    } catch (error) {
                        console.error("Failed to sync role:", error);
                    } finally {
                        // Always remove the items so we don't try again repeatedly
                        localStorage.removeItem("oauth_signup_role");
                        localStorage.removeItem("pending_role");
                    }
                } else {
                    // Just a regular login, clear pending role
                    localStorage.removeItem("pending_role");
                }
            }
        };

        if (authData?.authenticated) {
            handleAuthSync();
        }
    }, [authData?.authenticated]);

    return null;
};
