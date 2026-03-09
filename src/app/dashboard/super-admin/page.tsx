// src/app/dashboard/super-admin/page.tsx
"use client";

import { SummaryCard } from "@/src/components/dashboard/SummaryCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { 
    Cpu, 
    Phone, 
    UserCheck, 
    CheckCircle2, 
    MoreHorizontal,
    ArrowUpRight,
    LucideIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts";
import MainLayout from "@/src/components/layout/MainLayout";
import { Button } from "@/src/components/ui/button";

export default function SuperAdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data;
    },
  });

  // Dummy chart data – replace with API data later
  const lineData = [
    { month: "Jan", calls: 40 },
    { month: "Feb", calls: 55 },
    { month: "Mar", calls: 62 },
    { month: "Apr", calls: 51 },
    { month: "May", calls: 78 },
    { month: "Jun", calls: 92 },
  ];
  
  const barData = [
    { engineer: "Alice", completed: 30, pending: 5 },
    { engineer: "Bob", completed: 22, pending: 8 },
    { engineer: "Carol", completed: 27, pending: 3 },
    { engineer: "Dave", completed: 18, pending: 6 },
  ];

  return (
    <MainLayout>
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-border bg-card shadow-sm">
                Export Data
            </Button>
            <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                View Reports
            </Button>
        </div>
      </section>

      {/* Summary Cards Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-1">
        <SummaryCard 
            title="Inventary Items" 
            value={stats?.totalDevices ?? "0"} 
            icon={<Cpu className="h-5 w-5" />} 
            trend={{ value: "12%", positive: true }}
        />
        <SummaryCard 
            title="Service Requests" 
            value={stats?.activeCalls ?? "0"} 
            icon={<Phone className="h-5 w-5" />}
            trend={{ value: "5%", positive: false }}
        />
        <SummaryCard 
            title="Field Engineers" 
            value={stats?.activeEngineers ?? "0"} 
            icon={<UserCheck className="h-5 w-5" />}
            trend={{ value: "2", positive: true }}
        />
        <SummaryCard 
            title="Tickets Resolved" 
            value={stats?.resolvedCalls ?? "0"} 
            icon={<CheckCircle2 className="h-5 w-5" />}
            trend={{ value: "24%", positive: true }}
        />
      </section>

      {/* Dashboard Analytics Section */}
      <div className="grid gap-8 lg:grid-cols-7">
        
        {/* Main Chart Slot */}
        <Card className="lg:col-span-4 border-none shadow-soft bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <div>
                <CardTitle className="text-xl font-bold">Service Call Trends</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Volume tracking for current semester</p>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-secondary rounded-xl">
                <MoreHorizontal className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="h-[350px] px-8 pb-8 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Side Performance Slot */}
        <Card className="lg:col-span-3 border-none shadow-soft bg-card">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold">Team Performance</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Efficiency based on resolved tasks</p>
          </CardHeader>
          <CardContent className="h-[350px] px-8 pb-8 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="engineer" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    width={60}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9', radius: 8 }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                    dataKey="completed" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 10, 10, 0]} 
                    barSize={20}
                />
                <Bar 
                    dataKey="pending" 
                    fill="#cbd5e1" 
                    radius={[0, 10, 10, 0]} 
                    barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Data Section */}
      <Card className="border-none shadow-soft bg-card">
        <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-xl font-bold">Recent Service Calls</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time update of system support tickets</p>
          </div>
          <Button variant="link" className="text-primary hover:text-primary/80 font-semibold p-0 flex items-center gap-1 group">
            View all activity
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </CardHeader>
        <CardContent className="p-8">
            <div className="text-center py-16 text-muted-foreground italic">
                Recent orders table will go here with row heights and cell paddings following the 8-point system.
            </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
