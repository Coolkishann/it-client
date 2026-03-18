"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import MainLayout from "@/src/components/layout/MainLayout";
import { ServiceCall } from "@/src/types/serviceCall";
import { useAuthStore } from "@/src/store/authStore";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export default function ServiceCallsPage() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useQuery<ServiceCall[]>({
    queryKey: ["serviceCalls"],
    queryFn: async () => {
      const res = await api.get("/service-calls");
      return res.data;
    },
  });

  const columns: ColumnDef<ServiceCall, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-foreground">#{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      id: "device",
      header: "Device",
      cell: ({ row }) => {
        const device = row.original.device;
        return device ? (
          <span className="text-sm">{device.company} {device.model}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.device?.branch?.customer;
        return customer ? (
          <span className="text-sm">{customer.name}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      id: "engineer",
      header: "Engineer",
      cell: ({ row }) => {
        const engineer = row.original.engineer;
        return engineer ? (
          <span className="text-sm">{engineer.name}</span>
        ) : (
          <span className="text-amber-600 text-sm font-medium">Unassigned</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
            {status.replace("_", " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue() as string;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority] || "bg-gray-100 text-gray-600"}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link href={`/dashboard/service-calls/${row.original.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {user?.role?.toUpperCase() !== "ENGINEER" && (
            <Link href={`/dashboard/service-calls/${row.original.id}/edit`}>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Service Calls</h2>
            <p className="text-muted-foreground">
              Manage and track all IT service requests
            </p>
          </div>
          {user?.role?.toUpperCase() !== "ENGINEER" && (
            <Link href="/dashboard/service-calls/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Call
              </Button>
            </Link>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Failed to load service calls. Please try refreshing.</p>
          </div>
        )}
        {data && <AdvancedDataTable columns={columns} data={data} />}
      </section>
    </MainLayout>
  );
}
