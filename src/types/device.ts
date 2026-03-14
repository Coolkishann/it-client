// src/types/device.ts
export interface Device {
  id: number;
  category: string;
  company: string;
  model: string;
  serialNumber: string;
  ram?: string;
  storage?: string;
  os?: string;
  motherboardName?: string;
  motherboardSerial?: string;
  processor?: string;
  installationDate?: string;
  warrantyExpiry?: string;
  purchasePrice?: number;
  purchaseOrderNumber?: string;
  status: "ACTIVE" | "FAULTY" | "MAINTENANCE" | "RETIRED";
  notes?: string;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: number;
    name: string;
    customer?: {
      id: number;
      name: string;
    };
  };
}
