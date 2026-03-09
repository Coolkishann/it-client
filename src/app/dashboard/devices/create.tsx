"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, Select, SelectItem } from "@/components/ui";
import { CrudForm } from "@/src/components/common/CrudForm";
import MainLayout from "@/src/components/layout/MainLayout";

const schema = z.object({
  name: z.string().min(1),
  serialNumber: z.string().min(1),
  status: z.enum(["ACTIVE", "FAULTY"]),
  installationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  customerId: z.string().min(1),
  branchId: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function CreateDevice() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post("/devices", data);
    router.push("/dashboard/devices");
  };

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Create Device</h2>
        <CrudForm onSubmit={onSubmit} isSubmitting={isSubmitting}>
          <Input placeholder="Device Name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

          <Input placeholder="Serial Number" {...register("serialNumber")} />
          {errors.serialNumber && (
            <p className="text-sm text-red-600">{errors.serialNumber.message}</p>
          )}

          <Select {...register("status")}>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="FAULTY">Faulty</SelectItem>
          </Select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}

          <Input type="date" {...register("installationDate")} />
          {errors.installationDate && (
            <p className="text-sm text-red-600">{errors.installationDate.message}</p>
          )}

          <Input placeholder="Customer ID" {...register("customerId")} />
          {errors.customerId && (
            <p className="text-sm text-red-600">{errors.customerId.message}</p>
          )}

          <Input placeholder="Branch ID" {...register("branchId")} />
          {errors.branchId && (
            <p className="text-sm text-red-600">{errors.branchId.message}</p>
          )}
        </CrudForm>
      </section>
    </MainLayout>
  );
}
