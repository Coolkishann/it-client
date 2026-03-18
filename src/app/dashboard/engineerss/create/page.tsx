"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import MainLayout from "@/src/components/layout/MainLayout";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateEngineer() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            phone: (formData.get("phone") as string) || undefined,
            role: "ENGINEER",
        };

        try {
            await api.post("/users", data);
            toast.success("Engineer created successfully");
            router.push("/dashboard/engineers");
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to create engineer");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <section className="max-w-xl mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/engineers">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Add Engineer</h2>
                        <p className="text-muted-foreground text-sm">Create a new engineer account</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <Input id="password" name="password" type="password" placeholder="Create a password" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                        </div>


                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Creating…" : "Create Engineer"}
                            </Button>
                            <Link href="/dashboard/engineers">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
