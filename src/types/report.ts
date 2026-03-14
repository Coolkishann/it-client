// src/types/report.ts
export interface EngineerReport {
    engineerId: number;
    engineerName: string;
    engineerEmail: string;
    totalCalls: number;
    resolved: number;
    pending: number;
    inProgress: number;
    totalHoursWorked: number;
    resolutionRate: string;
    avgResolutionDays: number;
    isActive: boolean;
}

export interface BranchReport {
    branchId: number;
    branchName: string;
    branchAddress: string;
    customerName: string;
    customerContact: string;
    totalDevices: number;
    activeDevices: number;
    faultyDevices: number;
    openServiceCalls: number;
    contactPerson: string;
    phone: string;
}

export interface DashboardAnalytics {
    devices: {
        total: number;
        active: number;
        faulty: number;
        maintenance: number;
    };
    serviceCalls: {
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
    };
    engineers: {
        total: number;
        active: number;
        inactive: number;
    };
    customers: {
        total: number;
    };
}

export interface ServiceCallTrend {
    period: string;
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    critical: number;
    high: number;
}

export interface DeviceUtilization {
    deviceId: number;
    serialNumber: string;
    category: string;
    company: string;
    model: string;
    branchName: string;
    customerName: string;
    status: string;
    totalServiceCalls: number;
    openServiceCalls: number;
    daysSinceInstallation: number;
    estimatedDowntimeDays: number;
    uptimePercentage: string;
    warrantyStatus: string;
}

export interface MonthlySummary {
    year: number;
    month: number;
    summary: {
        newServiceCalls: number;
        resolvedServiceCalls: number;
        newCustomers: number;
        newDevices: number;
        totalWorkUpdates: number;
        resolutionRate: string;
    };
}
