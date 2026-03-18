// src/app/dashboard/admin/page.tsx
"use client";

import { SummaryCard } from "@/src/components/dashboard/SummaryCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api"
import MainLayout from "@/src/components/layout/MainLayout";
import { Button } from "@/src/components/ui/button";
import { ArrowUpRight, Cpu, Phone, CheckCircle2, UserCheck } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data;
    },
  });

  return (
    // <MainLayout>
    //   {/* Welcome Section */}
    //   <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
    //     <div>
    //       <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Operations</h1>
    //       <p className="text-muted-foreground mt-1">Manage service calls and oversee field engineers.</p>
    //     </div>
    //     <div className="flex items-center gap-3">
    //         <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
    //             New Service Call
    //         </Button>
    //     </div>
    //   </section>

    //   {/* Summary Cards Grid */}
    //   <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-1">
    //     <SummaryCard 
    //         title="Total Inventory" 
    //         value={stats?.totalDevices ?? "0"} 
    //         icon={<Cpu className="h-5 w-5" />} 
    //     />
    //     <SummaryCard 
    //         title="Active Service Calls" 
    //         value={stats?.activeCalls ?? "0"} 
    //         icon={<Phone className="h-5 w-5" />}
    //         trend={{ value: "2", positive: false }}
    //     />
    //     <SummaryCard 
    //         title="Resolved Calls" 
    //         value={stats?.resolvedCalls ?? "0"} 
    //         icon={<CheckCircle2 className="h-5 w-5" />}
    //         trend={{ value: "14", positive: true }}
    //     />
    //   </section>

    //   <div className="grid gap-8 lg:grid-cols-2 mt-4">
    //       <Card className="border-none shadow-soft bg-card h-[400px]">
    //         <CardHeader className="p-8 pb-4">
    //           <CardTitle className="text-xl font-bold">Recent Activities</CardTitle>
    //         </CardHeader>
    //         <CardContent className="px-8 pb-8 flex items-center justify-center text-muted-foreground h-full">
    //           Activity timeline will populate here.
    //         </CardContent>
    //       </Card>

    //       <Card className="border-none shadow-soft bg-card h-[400px]">
    //         <CardHeader className="p-8 flex flex-row items-center justify-between pb-4">
    //           <div>
    //             <CardTitle className="text-xl font-bold">Engineer Availability</CardTitle>
    //           </div>
    //           <Button variant="link" className="text-primary hover:text-primary/80 font-semibold p-0 flex items-center gap-1 group">
    //             Manage
    //             <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    //           </Button>
    //         </CardHeader>
    //         <CardContent className="px-8 pb-8 flex items-center justify-center text-muted-foreground h-full">
    //           Engineer status table will go here.
    //         </CardContent>
    //       </Card>
    //   </div>
    // </MainLayout>
    <MainLayout>
      <div className="flex h-screen justify-center items-center text-center">
        <h1 className="text-7xl font-bold">Admin Operations</h1>
      </div>
    </MainLayout>
  );
}
