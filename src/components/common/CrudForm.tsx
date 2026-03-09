"use client";

import { ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { toast, Toaster } from "sonner";  // Add this import

interface CrudFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  children: ReactNode;
  submitLabel?: string;
}

export function CrudForm({
  onSubmit,
  isSubmitting,
  children,
  submitLabel = "Save",
}: CrudFormProps) {
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: any = {};
    formData.forEach((value, key) => (data[key] = value));
    try {
      await onSubmit(data);
    } catch (err: any) {
      toast.error("Error", {
        description: err?.response?.data?.message ?? "Something went wrong",
      });
    }
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      {children}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
