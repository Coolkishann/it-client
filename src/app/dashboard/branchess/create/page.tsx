"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import MainLayout from "@/src/components/layout/MainLayout";
import { toast } from "sonner";
import { ArrowLeft, Building, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const schema = z.object({
    name: z.string().min(1, "Name required"),
    address: z.string().min(1, "Address required"),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    contactPerson: z.string().optional(),
    customerId: z.string().min(1, "Customer required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateBranch() {
    const router = useRouter();

    // Fetch customers for dropdown
    const { data: customerResponse, isLoading: loadingCustomers } = useQuery({
        queryKey: ["customers"],
        queryFn: async () => {
            const res = await api.get("/customers?limit=100");
            return res.data;
        },
    });

    const customers = customerResponse?.data || [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            await api.post("/branches", {
                ...data,
                customerId: parseInt(data.customerId),
            });
            toast.success("Branch created successfully!");
            router.push("/dashboard/branches");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create branch");
        }
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/branches">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Building className="h-8 w-8 text-primary" />
                            New Branch
                        </h1>
                        <p className="text-muted-foreground mt-1">Register a new branch for a customer</p>
                    </div>
                </div>

                <Card className="border-none shadow-soft bg-card">
                    <CardHeader className="border-b">
                        <CardTitle>Branch Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="customerId">Customer *</Label>
                                <select
                                    id="customerId"
                                    {...register("customerId")}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.customerId ? "border-destructive" : ""}`}
                                    disabled={loadingCustomers}
                                >
                                    <option value="">Select a customer</option>
                                    {customers.map((c: any) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.customerId && (
                                    <p className="text-xs font-medium text-destructive">{errors.customerId.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Branch Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Main HQ, Support Hub, etc."
                                    {...register("name")}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && (
                                    <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address *</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Industrial Dr"
                                    {...register("address")}
                                    className={errors.address ? "border-destructive" : ""}
                                />
                                {errors.address && (
                                    <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Mumbai" {...register("city")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" placeholder="Maharashtra" {...register("state")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="+91 22..." {...register("phone")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Contact Person</Label>
                                    <Input id="contactPerson" placeholder="Branch Manager Name" {...register("contactPerson")} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t">
                                <Button type="submit" disabled={isSubmitting || loadingCustomers} className="gap-2">
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Creating..." : "Create Branch"}
                                </Button>
                                <Link href="/dashboard/branches">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
