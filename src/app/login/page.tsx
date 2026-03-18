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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
      toast({
        title: "Login failed",
        description: err?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <Card className="relative w-full max-w-md border border-border/40 shadow-2xl bg-card/80 backdrop-blur-xl transition-all hover:shadow-3xl">

        <CardHeader className="space-y-4 text-center pt-8 pb-6">

          <div className="mx-auto bg-primary p-3 rounded-xl shadow-lg shadow-primary/30">
            <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Enter your credentials to access your workspace
            </CardDescription>
          </div>

        </CardHeader>

        <CardContent className="px-8 pb-8">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  id="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>

                {/* <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button> */}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>

              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Sign in"}
            </Button>

          </form>
        </CardContent>

      </Card>
    </div>
  );
}