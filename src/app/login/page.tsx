// src/app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { toast } from "@/src/components/ui/use-toast";
import { LayoutDashboard, Lock, Mail } from "lucide-react";

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await api.post("/auth/login", data);
            const { access_token, user } = response.data;
            if (typeof window !== "undefined") {
                localStorage.setItem("token", access_token);
            }
            setUser(user);
            toast({
                title: "Login successful",
                description: `Welcome, ${user.name}`,
            });
            
            const role = user.role?.toLowerCase();
            if (role === "super_admin" || role === "superadmin" || role === "super admin") {
                router.push("/dashboard/super-admin");
            } else if (role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/engineer");
            }
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Login failed",
                description: err?.response?.data?.message || "Invalid credentials",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            {/* Ambient Background Shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-none shadow-2xl bg-card/80 backdrop-blur-xl z-10 p-2">
                <CardHeader className="space-y-4 items-center pt-8 pb-6">
                    <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/30">
                        <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                        <CardDescription className="text-sm font-medium">
                            Enter your credentials to access your workspace
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pb-8 px-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    disabled={isSubmitting}
                                    className={`pl-11 h-12 bg-background/50 ${errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-foreground" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-semibold text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    disabled={isSubmitting}
                                    className={`pl-11 h-12 bg-background/50 ${errors.password ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full h-12 text-base shadow-xl shadow-primary/20 mt-2" disabled={isSubmitting}>
                            {isSubmitting ? "Authenticating..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
