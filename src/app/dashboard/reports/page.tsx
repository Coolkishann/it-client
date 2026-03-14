"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import MainLayout from "@/src/components/layout/MainLayout";
import { Button } from "@/src/components/ui/button";
import { AdvancedDataTable } from "@/src/components/common/AdvancedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    BarChart,
    Download,
    Users,
    Cpu,
    Phone,
    TrendingUp,
    Activity,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Building,
    Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
    DashboardAnalytics,
    EngineerReport,
    BranchReport,
    ServiceCallTrend,
    DeviceUtilization,
} from "@/src/types/report";

type TabKey = "overview" | "engineers" | "branches" | "devices" | "trends";

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [trendPeriod, setTrendPeriod] = useState<"day" | "week" | "month">("month");
    const [exporting, setExporting] = useState<string | null>(null);

    // ── Data Queries ──────────────────────────────────────────────────
    const { data: analytics, isLoading: loadingAnalytics } = useQuery<DashboardAnalytics>({
        queryKey: ["dashboardAnalytics"],
        queryFn: async () => (await api.get("/reports/dashboard-analytics")).data,
    });

    const { data: engineers, isLoading: loadingEngineers } = useQuery<EngineerReport[]>({
        queryKey: ["engineerReport"],
        queryFn: async () => (await api.get("/reports/engineer-performance")).data,
        enabled: activeTab === "overview" || activeTab === "engineers",
    });

    const { data: branches, isLoading: loadingBranches } = useQuery<BranchReport[]>({
        queryKey: ["branchReport"],
        queryFn: async () => (await api.get("/reports/branch-report")).data,
        enabled: activeTab === "overview" || activeTab === "branches",
    });

    const { data: trends, isLoading: loadingTrends } = useQuery<ServiceCallTrend[]>({
        queryKey: ["serviceCallTrends", trendPeriod],
        queryFn: async () =>
            (await api.get(`/reports/service-call-trends?period=${trendPeriod}`)).data,
        enabled: activeTab === "overview" || activeTab === "trends",
    });

    const { data: deviceUtil, isLoading: loadingDevices } = useQuery<DeviceUtilization[]>({
        queryKey: ["deviceUtilization"],
        queryFn: async () => (await api.get("/reports/device-utilization")).data,
        enabled: activeTab === "devices",
    });

    // ── Export Handlers ───────────────────────────────────────────────
    const handleExport = async (type: string) => {
        setExporting(type);
        try {
            const urlMap: Record<string, string> = {
                engineer: "/reports/engineer-excel",
                branch: "/reports/branch-excel",
                serviceCalls: "/reports/service-calls-excel",
            };
            const res = await api.get(urlMap[type], { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `${type}-report-${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success(`${type} report downloaded`);
        } catch {
            toast.error("Export failed. Please try again.");
        } finally {
            setExporting(null);
        }
    };

    // ── Column Definitions ────────────────────────────────────────────
    const engineerColumns: ColumnDef<EngineerReport, any>[] = [
        {
            accessorKey: "engineerName",
            header: "Engineer",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.engineerName}</p>
                    <p className="text-xs text-muted-foreground">{row.original.engineerEmail}</p>
                </div>
            ),
        },
        { accessorKey: "totalCalls", header: "Total Calls" },
        {
            accessorKey: "resolved",
            header: "Resolved",
            cell: ({ getValue }) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 font-medium">
                    {getValue() as number}
                </span>
            ),
        },
        {
            accessorKey: "inProgress",
            header: "In Progress",
            cell: ({ getValue }) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                    {getValue() as number}
                </span>
            ),
        },
        {
            accessorKey: "pending",
            header: "Pending",
            cell: ({ getValue }) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                    {getValue() as number}
                </span>
            ),
        },
        { accessorKey: "totalHoursWorked", header: "Hours Worked" },
        { accessorKey: "resolutionRate", header: "Resolution Rate" },
        { accessorKey: "avgResolutionDays", header: "Avg. Days" },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ getValue }) =>
                getValue() ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Inactive
                    </span>
                ),
        },
    ];

    const branchColumns: ColumnDef<BranchReport, any>[] = [
        {
            accessorKey: "branchName",
            header: "Branch",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.branchName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.original.branchAddress}</p>
                </div>
            ),
        },
        { accessorKey: "customerName", header: "Customer" },
        { accessorKey: "totalDevices", header: "Total Devices" },
        {
            accessorKey: "activeDevices",
            header: "Active",
            cell: ({ getValue }) => (
                <span className="text-emerald-600 font-medium">{getValue() as number}</span>
            ),
        },
        {
            accessorKey: "faultyDevices",
            header: "Faulty",
            cell: ({ getValue }) => {
                const val = getValue() as number;
                return (
                    <span className={val > 0 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                        {val}
                    </span>
                );
            },
        },
        {
            accessorKey: "openServiceCalls",
            header: "Open Calls",
            cell: ({ getValue }) => {
                const val = getValue() as number;
                return (
                    <span className={val > 0 ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-medium" : "text-muted-foreground"}>
                        {val}
                    </span>
                );
            },
        },
        { accessorKey: "contactPerson", header: "Contact" },
        { accessorKey: "phone", header: "Phone" },
    ];

    const deviceColumns: ColumnDef<DeviceUtilization, any>[] = [
        {
            accessorKey: "serialNumber",
            header: "Serial #",
            cell: ({ getValue }) => (
                <span className="font-mono text-xs">{getValue() as string}</span>
            ),
        },
        {
            id: "device",
            header: "Device",
            cell: ({ row }) => (
                <span className="text-sm">{row.original.company} {row.original.model}</span>
            ),
        },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "branchName", header: "Branch" },
        { accessorKey: "customerName", header: "Customer" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const s = getValue() as string;
                const colors: Record<string, string> = {
                    ACTIVE: "bg-emerald-100 text-emerald-700",
                    FAULTY: "bg-red-100 text-red-700",
                    MAINTENANCE: "bg-amber-100 text-amber-700",
                    RETIRED: "bg-gray-100 text-gray-600",
                };
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[s] || "bg-gray-100"}`}>
                        {s}
                    </span>
                );
            },
        },
        { accessorKey: "totalServiceCalls", header: "Total Calls" },
        { accessorKey: "openServiceCalls", header: "Open Calls" },
        { accessorKey: "uptimePercentage", header: "Uptime" },
        { accessorKey: "warrantyStatus", header: "Warranty" },
    ];

    // ── Stat Card ─────────────────────────────────────────────────────
    const StatCard = ({
        icon: Icon,
        label,
        value,
        sub,
        color,
    }: {
        icon: any;
        label: string;
        value: string | number;
        sub?: string;
        color: string;
    }) => (
        <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:shadow-lg transition-shadow duration-300">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
            </div>
        </div>
    );

    // ── Tabs ──────────────────────────────────────────────────────────
    const tabs: { key: TabKey; label: string; icon: any }[] = [
        { key: "overview", label: "Overview", icon: BarChart },
        { key: "engineers", label: "Engineer Performance", icon: Users },
        { key: "branches", label: "Branch Report", icon: Building },
        { key: "devices", label: "Device Utilization", icon: Cpu },
        { key: "trends", label: "Trends", icon: TrendingUp },
    ];

    return (
        <MainLayout>
            <section className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Analytics & Reports</h2>
                        <p className="text-muted-foreground">
                            Comprehensive insights for your IT service operations
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleExport("engineer")}
                            disabled={exporting === "engineer"}
                        >
                            {exporting === "engineer" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Engineers
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleExport("branch")}
                            disabled={exporting === "branch"}
                        >
                            {exporting === "branch" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Branches
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleExport("serviceCalls")}
                            disabled={exporting === "serviceCalls"}
                        >
                            {exporting === "serviceCalls" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Service Calls
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${activeTab === key
                                    ? "bg-card text-foreground border border-border border-b-card -mb-px shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* ============= OVERVIEW TAB ============= */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* KPI Cards */}
                        {loadingAnalytics ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : analytics ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    icon={Cpu}
                                    label="Total Devices"
                                    value={analytics.devices.total}
                                    sub={`${analytics.devices.active} active · ${analytics.devices.faulty} faulty`}
                                    color="bg-blue-100 text-blue-600"
                                />
                                <StatCard
                                    icon={Phone}
                                    label="Service Calls"
                                    value={analytics.serviceCalls.total}
                                    sub={`${analytics.serviceCalls.pending} pending · ${analytics.serviceCalls.inProgress} active`}
                                    color="bg-amber-100 text-amber-600"
                                />
                                <StatCard
                                    icon={CheckCircle2}
                                    label="Resolved"
                                    value={analytics.serviceCalls.resolved}
                                    sub={
                                        analytics.serviceCalls.total
                                            ? `${((analytics.serviceCalls.resolved / analytics.serviceCalls.total) * 100).toFixed(1)}% resolution rate`
                                            : "No calls yet"
                                    }
                                    color="bg-emerald-100 text-emerald-600"
                                />
                                <StatCard
                                    icon={Users}
                                    label="Engineers"
                                    value={analytics.engineers.total}
                                    sub={`${analytics.engineers.active} active`}
                                    color="bg-purple-100 text-purple-600"
                                />
                            </div>
                        ) : null}

                        {/* Quick Trends */}
                        {trends && trends.length > 0 && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Recent Trends
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {trends.slice(-6).map((t) => (
                                        <div
                                            key={t.period}
                                            className="bg-muted/50 rounded-lg p-3 text-center"
                                        >
                                            <p className="text-xs text-muted-foreground mb-1">{t.period}</p>
                                            <p className="text-xl font-bold">{t.total}</p>
                                            <div className="flex justify-center gap-2 mt-1 text-xs">
                                                <span className="text-emerald-600">{t.resolved}✓</span>
                                                <span className="text-amber-600">{t.pending}⏳</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Engineers Preview */}
                        {engineers && engineers.length > 0 && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Top Engineers
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("engineers")}>
                                        View All →
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {engineers.slice(0, 3).map((eng) => (
                                        <div key={eng.engineerId} className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {eng.engineerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{eng.engineerName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {eng.totalCalls} calls · {eng.resolutionRate} resolved
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ============= ENGINEERS TAB ============= */}
                {activeTab === "engineers" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Engineer Performance Report</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleExport("engineer")}
                                disabled={exporting === "engineer"}
                            >
                                {exporting === "engineer" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                Export Excel
                            </Button>
                        </div>
                        {loadingEngineers ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : engineers ? (
                            <AdvancedDataTable columns={engineerColumns} data={engineers} />
                        ) : (
                            <p className="text-muted-foreground text-center py-12">No data available</p>
                        )}
                    </div>
                )}

                {/* ============= BRANCHES TAB ============= */}
                {activeTab === "branches" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Branch Report</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleExport("branch")}
                                disabled={exporting === "branch"}
                            >
                                {exporting === "branch" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                Export Excel
                            </Button>
                        </div>
                        {loadingBranches ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : branches ? (
                            <AdvancedDataTable columns={branchColumns} data={branches} />
                        ) : (
                            <p className="text-muted-foreground text-center py-12">No data available</p>
                        )}
                    </div>
                )}

                {/* ============= DEVICES TAB ============= */}
                {activeTab === "devices" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Device Utilization Report</h3>
                        {loadingDevices ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : deviceUtil ? (
                            <AdvancedDataTable columns={deviceColumns} data={deviceUtil} />
                        ) : (
                            <p className="text-muted-foreground text-center py-12">No data available</p>
                        )}
                    </div>
                )}

                {/* ============= TRENDS TAB ============= */}
                {activeTab === "trends" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Service Call Trends</h3>
                            <div className="flex gap-1 bg-muted rounded-lg p-1">
                                {(["day", "week", "month"] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setTrendPeriod(p)}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize
                      ${trendPeriod === p
                                                ? "bg-card text-foreground shadow-sm font-medium"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {loadingTrends ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : trends && trends.length > 0 ? (
                            <div className="space-y-4">
                                {/* Trend Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                    {trends.map((t) => (
                                        <div
                                            key={t.period}
                                            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                                        >
                                            <p className="text-xs text-muted-foreground mb-2 font-medium">{t.period}</p>
                                            <p className="text-2xl font-bold">{t.total}</p>
                                            <div className="flex justify-center gap-3 mt-2 text-xs">
                                                <span className="text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />{t.resolved}
                                                </span>
                                                <span className="text-blue-600 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />{t.inProgress}
                                                </span>
                                                <span className="text-amber-600 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />{t.pending}
                                                </span>
                                            </div>
                                            {(t.critical > 0 || t.high > 0) && (
                                                <div className="mt-2 pt-2 border-t border-border text-xs text-red-600">
                                                    {t.critical > 0 && <span>{t.critical} critical</span>}
                                                    {t.critical > 0 && t.high > 0 && <span> · </span>}
                                                    {t.high > 0 && <span>{t.high} high</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Table */}
                                <div className="bg-card border border-border rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="text-left p-3 font-medium text-muted-foreground">Period</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">Resolved</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">In Progress</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">Pending</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">Critical</th>
                                                <th className="text-right p-3 font-medium text-muted-foreground">High</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trends.map((t, i) => (
                                                <tr key={t.period} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                                                    <td className="p-3 font-medium">{t.period}</td>
                                                    <td className="p-3 text-right">{t.total}</td>
                                                    <td className="p-3 text-right text-emerald-600">{t.resolved}</td>
                                                    <td className="p-3 text-right text-blue-600">{t.inProgress}</td>
                                                    <td className="p-3 text-right text-amber-600">{t.pending}</td>
                                                    <td className="p-3 text-right text-red-600">{t.critical || "—"}</td>
                                                    <td className="p-3 text-right text-orange-600">{t.high || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-muted/30 rounded-xl p-12 text-center">
                                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No trend data available yet.</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Trends will appear as service calls are created.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
