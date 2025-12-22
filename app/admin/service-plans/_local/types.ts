export type PlanType = "NBN" | "Business NBN" | "Mobile" | "Data Only" | "Voice Only";
export type PlanStatus = "Published" | "Draft";

export type PlanRow = {
  id: number;
  serviceId?: string;
  name: string;
  details: string;
  type: PlanType;
  speedOrData: string;   // "100/20 Mbps" or "4G/5G"
  price: string;         // "$69.95/Month"
  status: PlanStatus;
  customers: number;
};
