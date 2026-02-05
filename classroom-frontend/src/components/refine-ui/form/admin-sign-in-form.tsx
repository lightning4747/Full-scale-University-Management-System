"use client";

import { useState } from "react";

import { ShieldCheck, CircleHelp } from "lucide-react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin, useRefineOptions } from "@refinedev/core";
import { UserRole } from "@/types";

export const AdminSignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Link = useLink();

    const { title } = useRefineOptions();

    const { mutate: login } = useLogin();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login({
            email,
            password,
            role: UserRole.ADMIN,
        });
    };

    return (
        <div
            className={cn(
                "flex",
                "flex-col",
                "items-center",
                "justify-center",
                "px-6",
                "py-8",
                "min-h-svh",
                "bg-gradient-to-br",
                "from-purple-50",
                "to-indigo-100",
                "dark:from-purple-950/20",
                "dark:to-indigo-950/20"
            )}
        >
            <div className={cn("flex", "items-center", "justify-center", "gap-3")}>
                <ShieldCheck className={cn("w-12", "h-12", "text-purple-600", "dark:text-purple-400")} />
                {title.icon && (
                    <div
                        className={cn("text-foreground", "[&>svg]:w-12", "[&>svg]:h-12")}
                    >
                        {title.icon}
                    </div>
                )}
            </div>

            <Card className={cn("sm:w-[456px]", "p-12", "mt-6", "border-purple-200", "dark:border-purple-800")}>
                <CardHeader className={cn("px-0")}>
                    <CardTitle
                        className={cn(
                            "text-purple-600",
                            "dark:text-purple-400",
                            "text-3xl",
                            "font-semibold",
                            "flex",
                            "items-center",
                            "gap-2"
                        )}
                    >
                        <ShieldCheck className={cn("w-8", "h-8")} />
                        Admin Login
                    </CardTitle>
                    <CardDescription
                        className={cn("text-muted-foreground", "font-medium")}
                    >
                        Administrative access only. Please use your admin credentials.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className={cn("px-0")}>
                    <form onSubmit={handleSignIn}>
                        <div className={cn("flex", "flex-col", "gap-2")}>
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div
                            className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
                        >
                            <Label htmlFor="password">Password</Label>
                            <InputPassword
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div
                            className={cn(
                                "flex items-center justify-end",
                                "mt-4"
                            )}
                        >
                            <Link
                                to="/forgot-password"
                                className={cn(
                                    "text-sm",
                                    "flex",
                                    "items-center",
                                    "gap-2",
                                    "text-primary hover:underline",
                                    "text-purple-600",
                                    "dark:text-purple-400"
                                )}
                            >
                                <span>Forgot password</span>
                                <CircleHelp className={cn("w-4", "h-4")} />
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className={cn(
                                "w-full",
                                "mt-6",
                                "bg-purple-600",
                                "hover:bg-purple-700",
                                "text-white"
                            )}
                        >
                            Sign in as Admin
                        </Button>
                    </form>
                </CardContent>

                <Separator />

                <CardFooter>
                    <div className={cn("w-full", "text-center text-sm")}>
                        <span className={cn("text-sm", "text-muted-foreground")}>
                            Not an admin?{" "}
                        </span>
                        <Link
                            to="/login"
                            className={cn(
                                "text-blue-600",
                                "dark:text-blue-400",
                                "font-semibold",
                                "underline"
                            )}
                        >
                            Go to regular login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

AdminSignInForm.displayName = "AdminSignInForm";
