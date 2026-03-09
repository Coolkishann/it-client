// src/types/serviceCall.ts
export interface ServiceCall {
  id: string;
  deviceId: string;
  customerId: string;
  engineerId: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  createdAt: string;
}
