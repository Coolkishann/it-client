// src/types/device.ts
export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  status: "ACTIVE" | "FAULTY";
  installationDate: string; // ISO string
  customerId: string;
  branchId: string;
}
