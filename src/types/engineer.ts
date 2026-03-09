// src/types/engineer.ts
export interface Engineer {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  status: "ACTIVE" | "INACTIVE";
}
