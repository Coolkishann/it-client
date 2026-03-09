"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { ServiceCall } from "@/src/types/serviceCall";

export default function ServiceCallsPage() {
  const { data, isLoading, error } = useQuery<ServiceCall[]>({
    queryKey: ["serviceCalls"],
    queryFn: async () => {
      const res = await api.get("/service-calls");
      return res.data;
    },
  });

  const columns: ColumnDef<ServiceCall, any>[] = [
    { accessorKey: "deviceId", header: "Device ID" },
    { accessorKey: "customerId", header: "Customer ID" },
    { accessorKey: "engineerId", header: "Engineer ID" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as ServiceCall["status"];
        const colors = {
          OPEN: "red",
          IN_PROGRESS: "orange",
          CLOSED: "green",
        };
        return <span className={`text-${colors[status]}-600`}>{status}</span>;
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const pri = getValue() as ServiceCall["priority"];
        const colors = { LOW: "gray", MEDIUM: "yellow", HIGH: "red" };
        return <span className={`text-${colors[pri]}-600`}>{pri}</span>;
      },
    },
    { accessorKey: "createdAt", header: "Created", cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/service-calls/${row.original.id}/edit`}>
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
          <h2 className="text-2xl font-semibold">Service Calls</h2>
          <Link href="/dashboard/service-calls/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Call
            </Button>
          </Link>
        </div>

        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load service calls.</p>}
        {data && <AdvancedDataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
