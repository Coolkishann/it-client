"use client";

import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { CrudForm } from "@/src/components/common/CrudForm";
import MainLayout from "@/src/components/layout/MainLayout";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  address: z.string().min(1, "Address required"),
  city: z.string().min(1, "City required"),
  customerId: z.string().min(1, "Customer ID required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateBranch() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post("/branches", data);
    router.push("/dashboard/branches");
  };

  return (
    <MainLayout>
      <section className="max-w-xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Create Branch</h2>
        <CrudForm onSubmit={onSubmit} isSubmitting={isSubmitting}>
          <Input placeholder="Branch Name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

          <Input placeholder="Address" {...register("address")} />
          {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}

          <Input placeholder="City" {...register("city")} />
          {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}

          <Input placeholder="Customer ID" {...register("customerId")} />
          {errors.customerId && (
            <p className="text-sm text-red-600">{errors.customerId.message}</p>
          )}
        </CrudForm>
      </section>
    </MainLayout>
  );
}
