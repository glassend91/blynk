"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from '@/components/admin/customer-notes/SearchBar';
import InteractionCard, { Interaction } from '@/components/admin/customer-notes/InteractionCard';
import AddNoteModal from '@/components/admin/customer-notes/AddNoteModal';
import apiClient from '@/lib/apiClient';

type Note = {
  id: string;
  customerId: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  noteType: string;
  priority: string;
  content: string;
  tags: string[];
  isCritical?: boolean;
  createdBy: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt: string;
};

type Props = {
  initialQuery?: string;
};

export default function CustomerNotesTab({ initialQuery }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCustomer, setSearchedCustomer] = useState<string | null>(null);
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);

  // Fetch all notes on mount
  useEffect(() => {
    fetchAllNotes();
  }, []);

  // If an initial query is provided (from global search), run a search once on mount
  useEffect(() => {
    if (!initialQuery || initializedFromQuery) return;
    const q = initialQuery.trim();
    if (!q) return;

    setInitializedFromQuery(true);
    setQuery(q);
    // Trigger search immediately with the provided query
    void handleSearch(q);
  }, [initialQuery, initializedFromQuery]);

  const fetchAllNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<{ success: boolean; data: Note[] }>(
        "/customer-verification/notes?limit=50"
      );

      if (data?.success && data.data) {
        setNotes(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch notes:', err);
      setError(err?.message || 'Failed to load customer notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    const value = (overrideQuery ?? query).trim();
    if (!value) {
      fetchAllNotes();
      setSearchedCustomer(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use global search to find customers
      const globalSearchResponse = await apiClient.get<{ success: boolean; data: any[]; count: number }>(
        `/customer-verification/global-search?query=${encodeURIComponent(value)}`
      );

      if (globalSearchResponse.data?.success && globalSearchResponse.data.data && globalSearchResponse.data.data.length > 0) {
        // Get customer IDs from global search results
        const customerIds = globalSearchResponse.data.data.map((c: any) => c.id || c.userId);

        // Fetch all notes and filter by customer IDs
        const allNotesResponse = await apiClient.get<{ success: boolean; data: Note[] }>(
          `/customer-verification/notes?limit=100`
        );

        if (allNotesResponse.data?.success && allNotesResponse.data.data) {
          // Filter notes to only include those from found customers
          const filteredNotes = allNotesResponse.data.data.filter((note: Note) =>
            customerIds.includes(note.customerId)
          );

          // Sort by most recent
          filteredNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setNotes(filteredNotes);
          setSearchedCustomer(value);
        } else {
          setNotes([]);
          setSearchedCustomer(value);
        }
      } else {
        setNotes([]);
        setSearchedCustomer(value);
      }
    } catch (err: any) {
      console.error("Failed to search:", err);
      setError(err?.message || "Failed to search customers");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = () => {
    if (searchedCustomer) {
      handleSearch();
    } else {
      fetchAllNotes();
    }
  };

  const formatInteraction = (note: Note): Interaction => {
    const customerName = note.customer
      ? `${note.customer.firstName} ${note.customer.lastName}`
      : 'Unknown Customer';

    const createdByName = note.createdBy.firstName && note.createdBy.lastName
      ? `${note.createdBy.firstName} ${note.createdBy.lastName}`
      : 'Admin';

    const timeAgo = formatTimeAgo(note.createdAt);

    return {
      id: note.id,
      title: `${note.noteType} - ${note.priority} Priority`,
      subtitle: note.content,
      meta: `${timeAgo} by ${createdByName}${note.customer ? ` for ${customerName}` : ''}`,
    };
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

    return date.toLocaleDateString();
  };

  const filtered = useMemo(() => {
    if (!query.trim() && !searchedCustomer) return notes;
    // If we have a search query, notes are already filtered by the API
    return notes;
  }, [notes, query, searchedCustomer]);

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Customer Notes &amp; History</h2>
          <p className="mt-1 text-[14px] text-[#6F6C90]">
            View and manage customer interaction history
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-[6px] bg-[#401B60] px-[21px] py-3 text-[14px] font-semibold text-white hover:opacity-95"
        >
          Add Note
        </button>
      </div>

      {/* Search card */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Search Customer</h3>
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
        {searchedCustomer && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[14px] text-[#6F6C90]">
              Showing notes for: <span className="font-semibold text-[#0A0A0A]">{searchedCustomer}</span>
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSearchedCustomer(null);
                fetchAllNotes();
              }}
              className="text-[14px] text-[#401B60] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
          {error}
        </div>
      )}

      {/* Recent interactions */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Recent Customer Interactions</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[16px] text-[#6F6C90]">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((note) => (
              <div
                key={note.id}
                className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]"
              >
                <InteractionCard data={formatInteraction(note)} />
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
                {searchedCustomer
                  ? `No notes found for "${searchedCustomer}". Try a different search.`
                  : 'No customer notes found.'}
              </div>
            )}
          </div>
        )}
      </div>

      <AddNoteModal open={open} onOpenChange={setOpen} onSuccess={handleNoteCreated} />
    </div>
  );
}

