"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { DataTable } from "@/src/components/common/DataTable";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { ColumnDef } from "@tanstack/react-table";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const columns: ColumnDef<Customer, any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Link href={`/dashboard/customers/${row.original.id}/edit`}>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </Link>
    ),
  },
];

export default function CustomersPage() {
  const { data, isLoading, error } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await api.get("/customers");
      return res.data;
    },
  });

  return (
    <MainLayout>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Customers</h2>
          <Link href="/dashboard/customers/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </Link>
        </div>

        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load customers.</p>}
        {data && <DataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
