"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { Branch } from "@/src/types/branch";

export default function BranchesPage() {
  const { data, isLoading, error } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await api.get("/branches");
      return res.data;
    },
  });

  const columns: ColumnDef<Branch, any>[] = [
    { accessorKey: "name", header: "Branch Name", enableSorting: true },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "city", header: "City" },
    {
      accessorKey: "customerId",
      header: "Customer ID",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/branches/${row.original.id}/edit`}>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <MainLayout>
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Branches</h2>
          <Link href="/dashboard/branches/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Branch
            </Button>
          </Link>
        </div>

        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load branches.</p>}
        {data && <AdvancedDataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
