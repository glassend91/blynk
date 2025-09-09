export type Interaction = {
  id: string;
  title: string;
  subtitle: string;
  meta: string; // e.g., "2 hours ago by Sarah Wilson"
};

export default function InteractionCard({ data }: { data: Interaction }) {
  return (
    <div className="space-y-1">
      <h4 className="text-[18px] font-bold text-[#0A0A0A]">{data.title}</h4>
      <p className="text-[18px] text-[#6F6C90]">{data.subtitle}</p>
      <p className="text-[18px] text-[#6F6C90]">{data.meta}</p>
    </div>
  );
}
