import { useEffect } from "react";
import { useLogout, useGo } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Mail, Calendar, Shield, Building2 } from "lucide-react";

type UserSession = {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role?: string;
    createdAt?: string | Date;
    department?: {
        name?: string;
    };
};

const Profile = () => {
    // 1. Use the Better Auth hook instead of manual useEffect + useState
    // This hook is reactive and won't trigger infinite loops
    const { data: session, isPending } = authClient.useSession();

    const { mutate: logout } = useLogout();
    const go = useGo();

    // 2. Handle redirection only when we are sure there is no session
    useEffect(() => {
        if (!isPending && !session) {
            go({ to: "/login" });
        }
        if (session?.user) {
            console.log("Current User Data:", session.user);
        }
    }, [session, isPending, go]);

    if (isPending) {
        return (
            <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If no session after loading, the useEffect above will redirect
    if (!session?.user) return null;

    const user = session.user as UserSession;

    const getInitials = (name = "") => {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
        return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    };

    const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Unknown";

    const getRoleColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "destructive";
            case "teacher":
            case "faculty":
                return "default";
            case "student":
                return "secondary";
            default:
                return "outline";
        }
    };

    return (
        <div className="container max-w-2xl py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            </div>

            <Card className="overflow-hidden border-border/50 shadow-sm">
                <CardHeader className="bg-muted/30 pb-8 pt-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage src={user.image || ""} alt={user.name} />
                            <AvatarFallback className="text-xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <Badge variant={getRoleColor(user.role) as "default" | "secondary" | "destructive" | "outline"} className="mt-2 text-sm capitalize px-3 py-1">
                                {user.role || "User"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-1 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>Email Address</span>
                            </div>
                            <p className="font-medium truncate" title={user.email}>{user.email}</p>
                        </div>

                        <div className="space-y-1 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Member Since</span>
                            </div>
                            <p className="font-medium">{formattedDate}</p>
                        </div>

                        <div className="space-y-1 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>Department</span>
                            </div>
                            <p className="font-medium">{user.department?.name || "No Department Assigned"}</p>
                        </div>

                        <div className="space-y-1 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors sm:col-span-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4" />
                                <span>Account ID</span>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground truncate">{user.id}</p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto gap-2"
                            onClick={() => logout()}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;