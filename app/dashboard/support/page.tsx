// app/dashboard/support/page.tsx
export default function SupportTickets() {
  return (
    <section>
      <h1 className="text-[24px] font-extrabold text-[#170F49]">
        Support Tickets
      </h1>
      <div className="mt-6 rounded-[16px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <button className="mb-4 rounded-[10px] bg-[#401B60] px-4 py-2 text-white">
          New Ticket
        </button>
        <ul className="divide-y">
          <li className="py-3">#4521 Connectivity issue — Open</li>
        </ul>
      </div>
    </section>
  );
}
