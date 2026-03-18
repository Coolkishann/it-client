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

export default function CreateDevice() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch branches for dropdown
    const { data: branches } = useQuery({
        queryKey: ["branches"],
        queryFn: async () => {
            const res = await api.get("/branches");
            return res.data;
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            category: formData.get("category") as string,
            company: formData.get("company") as string,
            model: formData.get("model") as string,
            serialNumber: formData.get("serialNumber") as string,
            ram: (formData.get("ram") as string) || undefined,
            storage: (formData.get("storage") as string) || undefined,
            os: (formData.get("os") as string) || undefined,
            processor: (formData.get("processor") as string) || undefined,
            installationDate: (formData.get("installationDate") as string) || undefined,
            warrantyExpiry: (formData.get("warrantyExpiry") as string) || undefined,
            purchasePrice: formData.get("purchasePrice") ? Number(formData.get("purchasePrice")) : undefined,
            purchaseOrderNumber: (formData.get("purchaseOrderNumber") as string) || undefined,
            branchId: Number(formData.get("branchId")),
            notes: (formData.get("notes") as string) || undefined,
        };

        try {
            await api.post("/devices", data);
            toast.success("Device created successfully");
            router.push("/dashboard/devices");
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to create device");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <section className="max-w-2xl mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/devices">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Add New Device</h2>
                        <p className="text-muted-foreground text-sm">Register a new IT asset in the system</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="LAPTOP">Laptop</option>
                                    <option value="DESKTOP">Desktop</option>
                                    <option value="PRINTER">Printer</option>
                                    <option value="AIO">AIO</option>
                                    <option value="SERVER">Server</option>
                                    <option value="NETWORK">Network</option>
                                </select>
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Brand *</Label>
                                <Input id="company" name="company" placeholder="e.g. HP, Dell, Lenovo" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Model */}
                            <div className="space-y-2">
                                <Label htmlFor="model">Model *</Label>
                                <Input id="model" name="model" placeholder="e.g. ProBook 450 G8" required />
                            </div>

                            {/* Serial Number */}
                            <div className="space-y-2">
                                <Label htmlFor="serialNumber">Serial Number *</Label>
                                <Input id="serialNumber" name="serialNumber" placeholder="Unique serial number" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* RAM */}
                            <div className="space-y-2">
                                <Label htmlFor="ram">RAM</Label>
                                <Input id="ram" name="ram" placeholder="e.g. 16GB" />
                            </div>

                            {/* Storage */}
                            <div className="space-y-2">
                                <Label htmlFor="storage">Storage</Label>
                                <Input id="storage" name="storage" placeholder="e.g. 512GB SSD" />
                            </div>

                            {/* OS */}
                            <div className="space-y-2">
                                <Label htmlFor="os">Operating System</Label>
                                <Input id="os" name="os" placeholder="e.g. Windows 11 Pro" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Processor */}
                            <div className="space-y-2">
                                <Label htmlFor="processor">Processor</Label>
                                <select
                                    id="processor"
                                    name="processor"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select processor</option>
                                    <option value="INTEL_I3">Intel i3</option>
                                    <option value="INTEL_I5">Intel i5</option>
                                    <option value="INTEL_I7">Intel i7</option>
                                    <option value="INTEL_I9">Intel i9</option>
                                    <option value="AMD_RYZEN3">AMD Ryzen 3</option>
                                    <option value="AMD_RYZEN5">AMD Ryzen 5</option>
                                    <option value="AMD_RYZEN7">AMD Ryzen 7</option>
                                    <option value="AMD_RYZEN9">AMD Ryzen 9</option>
                                </select>
                            </div>

                            {/* Branch */}
                            <div className="space-y-2">
                                <Label htmlFor="branchId">Branch *</Label>
                                <select
                                    id="branchId"
                                    name="branchId"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Select branch</option>
                                    {branches?.map((b: any) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Installation Date */}
                            <div className="space-y-2">
                                <Label htmlFor="installationDate">Installation Date</Label>
                                <Input id="installationDate" name="installationDate" type="date" />
                            </div>

                            {/* Warranty Expiry */}
                            <div className="space-y-2">
                                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                                <Input id="warrantyExpiry" name="warrantyExpiry" type="date" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Purchase Price */}
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">Purchase Price</Label>
                                <Input id="purchasePrice" name="purchasePrice" type="number" step="0.01" placeholder="0.00" />
                            </div>

                            {/* PO Number */}
                            <div className="space-y-2">
                                <Label htmlFor="purchaseOrderNumber">PO Number</Label>
                                <Input id="purchaseOrderNumber" name="purchaseOrderNumber" placeholder="Purchase order #" />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" name="notes" placeholder="Any additional notes..." rows={3} />
                        </div>


                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Creating…" : "Add Device"}
                            </Button>
                            <Link href="/dashboard/devices">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
