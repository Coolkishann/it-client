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
  email: z.string().email(),
  phone: z.string().min(1),
  region: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type FormData = z.infer<typeof schema>;

export default function CreateEngineer() {
  const router = useRouter();
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post("/engineers", data);
    router.push("/dashboard/engineers");
  };

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Create Engineer</h2>
        <CrudForm onSubmit={onSubmit} isSubmitting={isSubmitting}>
          <Input placeholder="Name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

          <Input placeholder="Phone" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}

          <Input placeholder="Region" {...register("region")} />
          {errors.region && <p className="text-sm text-red-600">{errors.region.message}</p>}

          <Select {...register("status")}>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </Select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
        </CrudForm>
      </section>
    </MainLayout>
  );
}
