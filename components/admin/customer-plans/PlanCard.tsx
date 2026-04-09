export type CustomerPlan = {
  id: string;
  name: string;
  activeSince: string; // e.g., "Jan 15, 2024"
  price: string; // e.g., "$89.95/month"
};

export default function PlanCard({ plan }: { plan: CustomerPlan }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[18px] font-bold text-[#0A0A0A]">{plan.name}</h4>
      <p className="text-[16px] text-[#6F6C90]">
        Active since {plan.activeSince}
      </p>
      <p className="text-[16px] font-semibold text-[#401B60]">{plan.price}</p>
    </div>
  );
}
