// src/components/dashboard/SummaryCard.tsx
"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export function SummaryCard({ title, value, icon, trend }: SummaryCardProps) {
    return (
        <Card className="border-none shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card group overflow-hidden relative">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-500" />
            
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {icon}
                    </div>
                    {trend && (
                        <div className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold",
                            trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                            {trend.positive ? "+" : "-"}{trend.value}
                        </div>
                    )}
                </div>
                
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}
