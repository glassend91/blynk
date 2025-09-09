'use client';

import { useMemo, useState } from 'react';
import SearchBar from '@/components/admin/customer-notes/SearchBar';
import InteractionCard, { Interaction } from '@/components/admin/customer-notes/InteractionCard';
import AddNoteModal from '@/components/admin/customer-notes/AddNoteModal';

export default function CustomerNotesPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  // demo rows (swap for real data later)
  const interactions: Interaction[] = [
    {
      id: '1',
      title: 'Support call completed',
      subtitle: 'Resolved internet connection issue for John Smith',
      meta: '2 hours ago by Sarah Wilson',
    },
    {
      id: '2',
      title: 'Plan upgrade processed',
      subtitle: 'Resolved internet connection issue for John Smith',
      meta: '2 hours ago by Sarah Wilson',
    },
  ];

  const filtered = useMemo(() => {
    if (!query.trim()) return interactions;
    const q = query.toLowerCase();
    return interactions.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.meta.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-8">
      {/* header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0A0A0A]">Customer Notes &amp; History</h1>
          <p className="mt-2 text-[16px] leading-[21px] text-[#6F6C90]">
            View and manage customer interaction history
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-[6px] bg-[#401B60] px-[21px] py-3 text-[16px] font-semibold text-white"
        >
          Add New Service
        </button>
      </div>

      {/* Search card */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Search Customer</h3>
        <SearchBar value={query} onChange={setQuery} onSearch={() => void 0} />
      </div>

      {/* Recent interactions */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Recent Customer Interactions</h3>

        <div className="space-y-4">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]"
            >
              <InteractionCard data={row} />
            </div>
          ))}
        </div>
      </div>

      <AddNoteModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
