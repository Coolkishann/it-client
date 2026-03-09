"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { Engineer } from "@/src/types/engineer";

export default function EngineersPage() {
  const { data, isLoading, error } = useQuery<Engineer[]>({
    queryKey: ["engineers"],
    queryFn: async () => {
      const res = await api.get("/engineers");
      return res.data;
    },
  });

  const columns: ColumnDef<Engineer, any>[] = [
    { accessorKey: "name", header: "Name", enableSorting: true },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "region", header: "Region" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as Engineer["status"];
        const color = status === "ACTIVE" ? "green" : "gray";
        return <span className={`text-${color}-600`}>{status}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/engineers/${row.original.id}/edit`}>
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
          <h2 className="text-2xl font-semibold">Engineers</h2>
          <Link href="/dashboard/engineers/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Engineer
            </Button>
          </Link>
        </div>

        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load engineers.</p>}
        {data && <AdvancedDataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
