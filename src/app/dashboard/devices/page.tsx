"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { Device } from "@/src/types/device";

export default function DevicesPage() {
  const { data, isLoading, error } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await api.get("/devices");
      return res.data;
    },
  });

  const columns: ColumnDef<Device, any>[] = [
    { accessorKey: "name", header: "Device Name", enableSorting: true },
    { accessorKey: "serialNumber", header: "Serial #", enableSorting: true },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as Device["status"];
        const color = status === "ACTIVE" ? "green" : "red";
        return <span className={`text-${color}-600`}>{status}</span>;
      },
    },
    {
      accessorKey: "installationDate",
      header: "Installed",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    { accessorKey: "customerId", header: "Customer ID" },
    { accessorKey: "branchId", header: "Branch ID" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/devices/${row.original.id}/edit`}>
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
          <h2 className="text-2xl font-semibold">Devices</h2>
          <Link href="/dashboard/devices/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Device
            </Button>
          </Link>
        </div>

        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load devices.</p>}
        {data && <AdvancedDataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
