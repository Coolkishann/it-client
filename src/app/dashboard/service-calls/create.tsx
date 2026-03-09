"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, Textarea, Select, SelectItem } from "@/components/ui/"
import { CrudForm } from "@/src/components/common/CrudForm";
import MainLayout from "@/src/components/layout/MainLayout";

const schema = z.object({
  deviceId: z.string().min(1),
  customerId: z.string().min(1),
  engineerId: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  description: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function CreateServiceCall() {
  const router = useRouter();
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post("/service-calls", data);
    router.push("/dashboard/service-calls");
  };

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Create Service Call</h2>
        <CrudForm onSubmit={onSubmit} isSubmitting={isSubmitting}>
          <Input placeholder="Device ID" {...register("deviceId")} />
          {errors.deviceId && <p className="text-sm text-red-600">{errors.deviceId.message}</p>}

          <Input placeholder="Customer ID" {...register("customerId")} />
          {errors.customerId && <p className="text-sm text-red-600">{errors.customerId.message}</p>}

          <Input placeholder="Engineer ID" {...register("engineerId")} />
          {errors.engineerId && <p className="text-sm text-red-600">{errors.engineerId.message}</p>}

          <Select {...register("status")}>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </Select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}

          <Select {...register("priority")}>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </Select>
          {errors.priority && <p className="text-sm text-red-600">{errors.priority.message}</p>}

          <Textarea placeholder="Description" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </CrudForm>
      </section>
    </MainLayout>
  );
}
