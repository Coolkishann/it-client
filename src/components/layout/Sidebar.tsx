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
    
    // Determine the dynamic dashboard path based on role
    const getDashboardPath = () => {
        const role = user?.role?.toUpperCase();
        if (role === "SUPER_ADMIN") return "/dashboard/super-admin";
        if (role === "ADMIN") return "/dashboard/admin";
        return "/dashboard/engineer";
    };

    const filteredNavItems = navItems.filter(item => {
        if (!item.roles) return true;
        return user?.role && item.roles.includes(user.role.toUpperCase());
    });

    return (
        <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md h-screen flex flex-col p-6 sticky top-0 overflow-y-auto">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                    <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                    IT Service
                </span>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-2">
                {filteredNavItems.map((item) => {
                    // Normalize href for "Overview" to match role-specific dashboards
                    const itemHref = item.href === "/dashboard/overview" ? getDashboardPath() : item.href;
                    const isActive = pathname === itemHref;
                    
                    return (
                        <Link
                            key={item.href}
                            href={itemHref}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                                isActive 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform group-hover:scale-110",
                                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                            )} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                            )}
                        </Link>
                    );
                })}
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
