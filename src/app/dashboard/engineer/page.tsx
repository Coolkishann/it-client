// src/app/dashboard/engineer/page.tsx
"use client";

import { SummaryCard } from "@/src/components/dashboard/SummaryCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api"
import MainLayout from "@/src/components/layout/MainLayout";
import { Button } from "@/src/components/ui/button";
import { Phone, CheckCircle2, ClipboardList, ArrowUpRight } from "lucide-react";

export default function EngineerDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data;
    },
  });

  return (
    <MainLayout>
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-1">Review your pending tickets and complete your tasks.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-border bg-card shadow-sm">
                View Schedule
            </Button>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pt-1">
        <SummaryCard 
            title="My Pending Calls" 
            value={stats?.activeCalls ?? "0"} 
            icon={<Phone className="h-5 w-5" />}
        />
        <SummaryCard 
            title="My Resolved Calls" 
            value={stats?.resolvedCalls ?? "0"} 
            icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </section>

      {/* Main Content Area */}
      <Card className="border-none shadow-soft bg-card mt-4">
        <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Task Queue
            </CardTitle>
          </div>
          <Button variant="link" className="text-primary hover:text-primary/80 font-semibold p-0 flex items-center gap-1 group">
            Open all tasks
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </CardHeader>
        <CardContent className="p-8">
            <div className="text-center py-16 text-muted-foreground">
                Your assigned task list will appear here. No pending tasks at the moment.
            </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
