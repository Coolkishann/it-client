// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import {
    Home,
    Users,
    Building,
    Cpu,
    Phone,
    Settings,
    BarChart,
    UserCheck,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { useState, useEffect } from "react";

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    roles?: string[]; // Optional roles allowed to see this item
}

const navItems: NavItem[] = [
    { href: "/dashboard/overview", label: "Overview", icon: Home, roles: ["SUPER_ADMIN", "ADMIN", "ENGINEER"] },
    { href: "/dashboard/customers", label: "Customers", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/branches", label: "Branches", icon: Building, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/devices", label: "Inventory", icon: Cpu, roles: ["SUPER_ADMIN", "ADMIN", "ENGINEER"] },
    { href: "/dashboard/service-calls", label: "Support Calls", icon: Phone, roles: ["SUPER_ADMIN", "ADMIN", "ENGINEER"] },
    { href: "/dashboard/engineers", label: "Team", icon: UserCheck, roles: ["SUPER_ADMIN", "ADMIN"] },
    { href: "/dashboard/reports", label: "Analytics", icon: BarChart, roles: ["SUPER_ADMIN", "ADMIN"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Normalize user role for consistent checking
    const userRole = user?.role?.toUpperCase().replace(/\s+/g, '_') || "";

    if (!mounted) return <aside className="w-64 min-w-[256px] border-r border-border bg-card/85 h-screen flex-shrink-0 animate-pulse" />;

    // Determine the dynamic dashboard path based on role
    const getDashboardPath = () => {
        if (userRole === "SUPER_ADMIN") return "/dashboard/super-admin";
        if (userRole === "ADMIN") return "/dashboard/admin";
        return "/dashboard/engineer";
    };

    const filteredNavItems = navItems.filter(item => {
        if (!item.roles) return true;
        // Check if normalized user role matches any allowed roles
        return item.roles.some(role => {
            const normalizedAllowedRole = role.toUpperCase().replace(/\s+/g, '_');
            return userRole === normalizedAllowedRole;
        });
    });

    return (
        <aside className="w-64 min-w-[256px] border-r border-border bg-card/85 backdrop-blur-xl h-screen flex flex-col p-6 sticky top-0 overflow-y-auto flex-shrink-0 z-40 transition-all duration-300">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-10 px-2 group">
                <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                    <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    IT Service
                </span>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-1.5">
                {filteredNavItems.length > 0 ? (
                    filteredNavItems.map((item) => {
                        // Normalize href for "Overview" to match role-specific dashboards
                        const itemHref = item.href === "/dashboard/overview" ? getDashboardPath() : item.href;
                        const isActive = pathname === itemHref || pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={itemHref}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                                )} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                                )}
                            </Link>
                        );
                    })
                ) : (
                    <div className="px-4 py-8 text-center bg-secondary/30 rounded-2xl border border-dashed border-border">
                        <p className="text-xs text-muted-foreground italic">No navigation items available for your role ({user?.role || 'Guest'})</p>
                    </div>
                )}
            </nav>

            {/* Footer Navigation */}
            <div className="mt-auto border-t border-border pt-6">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-muted-foreground hover:bg-secondary hover:text-foreground",
                        pathname === "/settings" && "bg-secondary text-foreground"
                    )}
                >
                    <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
}
