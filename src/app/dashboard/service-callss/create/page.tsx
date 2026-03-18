"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import MainLayout from "@/src/components/layout/MainLayout";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateServiceCall() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch devices for dropdown
    const { data: devices } = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await api.get("/devices");
            return res.data;
        },
    });

    // Fetch engineers for dropdown
    const { data: engineers } = useQuery({
        queryKey: ["engineers"],
        queryFn: async () => {
            const res = await api.get("/users?role=ENGINEER");
            return res.data;
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            errorCode: (formData.get("errorCode") as string) || undefined,
            priority: formData.get("priority") as string,
            deviceId: Number(formData.get("deviceId")),
            engineerId: formData.get("engineerId") ? Number(formData.get("engineerId")) : undefined,
            scheduledDate: (formData.get("scheduledDate") as string) || undefined,
        };

        try {
            await api.post("/service-calls", data);
            toast.success("Service call created successfully");
            router.push("/dashboard/service-calls");
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to create service call");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <section className="max-w-2xl mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/service-calls">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Service Call</h2>
                        <p className="text-muted-foreground text-sm">Log a new IT support request</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Issue Title *</Label>
                            <Input id="title" name="title" placeholder="e.g. Printer not responding" required />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the issue in detail..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Error Code */}
                        <div className="space-y-2">
                            <Label htmlFor="errorCode">Error Code (optional)</Label>
                            <Input id="errorCode" name="errorCode" placeholder="e.g. ERR-0x42" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Device */}
                            <div className="space-y-2">
                                <Label htmlFor="deviceId">Device *</Label>
                                <select
                                    id="deviceId"
                                    name="deviceId"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select a device</option>
                                    {devices?.map((d: any) => (
                                        <option key={d.id} value={d.id}>
                                            {d.company} {d.model} — {d.serialNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Engineer */}
                            <div className="space-y-2">
                                <Label htmlFor="engineerId">Assign Engineer</Label>
                                <select
                                    id="engineerId"
                                    name="engineerId"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Unassigned</option>
                                    {engineers?.map((e: any) => (
                                        <option key={e.id} value={e.id}>
                                            {e.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority *</Label>
                                <select
                                    id="priority"
                                    name="priority"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM" selected>Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>

                            {/* Scheduled Date */}
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                                <Input id="scheduledDate" name="scheduledDate" type="date" />
                            </div>
                        </div>


                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Creating…" : "Create Service Call"}
                            </Button>
                            <Link href="/dashboard/service-calls">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
