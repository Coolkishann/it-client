// src/types/serviceCall.ts
export interface ServiceCall {
  id: number;
  title: string;
  description: string;
  errorCode?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  scheduledDate?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
  deviceId: number;
  engineerId?: number;
  createdAt: string;
  updatedAt: string;
  device?: {
    id: number;
    category: string;
    company: string;
    model: string;
    serialNumber: string;
    status: string;
    branch?: {
      id: number;
      name: string;
      customer?: {
        id: number;
        name: string;
      };
    };
  };
  engineer?: {
    id: number;
    name: string;
    email: string;
  };
  workUpdates?: WorkUpdate[];
}

export interface WorkUpdate {
  id: number;
  serviceCallId: number;
  engineerId: number;
  description: string;
  hoursWorked?: number;
  notes?: string;
  spareParts?: SparePart[];
  images?: WorkImage[];
  createdAt: string;
}

export interface SparePart {
  id: number;
  partName: string;
  capacity?: string;
  oldSerial?: string;
  newSerial?: string;
  quantity: number;
  cost?: number;
}

export interface WorkImage {
  id: number;
  imageUrl: string;
  type?: string;
  caption?: string;
}
