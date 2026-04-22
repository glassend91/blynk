"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import apiClient from "@/lib/apiClient";
import UnifiedCustomerSignupController from "@/components/admin/UnifiedCustomerSignupController";

type AuthUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  subrole?: string;
};

type SearchResult = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceAddress?: string;
  type?: string;
  status?: string;
  businessName?: string;
  ABN?: string;
};

export default function Topbar({
  leftOffset,
  height = 89,
}: {
  leftOffset: number;
  height?: number;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const u = getAuthUser<AuthUser>();
      setUser(u);
    };

    // Load user on mount
    loadUser();

    // Refresh permissions from server on mount
    const { refreshAuthUser } = require("@/lib/auth");
    refreshAuthUser().catch(() => {});

    // Listen for storage changes and custom refresh events
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent && e.key === "auth_user") {
        loadUser();
      } else if (e instanceof CustomEvent && e.type === "authUserRefreshed") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange as EventListener);
    window.addEventListener(
      "authUserRefreshed",
      handleStorageChange as EventListener,
    );

    // Also check periodically in case storage event doesn't fire (same tab)
    const interval = setInterval(() => {
      loadUser();
      refreshAuthUser().catch(() => {});
    }, 30000); // Refresh every 30 seconds

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange as EventListener,
      );
      window.removeEventListener(
        "authUserRefreshed",
        handleStorageChange as EventListener,
      );
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Perform search when user types
  useEffect(() => {
    const performSearch = async () => {
      const q = search.trim();
      if (!q || q.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await apiClient.get<{
          success: boolean;
          data: SearchResult[];
          count: number;
        }>(
          `/customer-verification/global-search?query=${encodeURIComponent(q)}`,
        );

        if (data?.success && data.data) {
          setSearchResults(data.data);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Failed to search:", err);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleNavigateToCustomer = (customer: SearchResult) => {
    const params = new URLSearchParams();
    // Pass the customer ID directly so we load the exact selected customer
    params.set("customerId", customer.id || customer.userId);
    // Also keep the search query for reference
    if (search.trim()) {
      params.set("q", search.trim());
    }
    router.push(`/admin/customer-dashboard?${params.toString()}`);
    setShowDropdown(false);
    setSearch("");
  };

  const handleGlobalSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = search.trim();
    if (!q) {
      setShowDropdown(false);
      return;
    }

    // If there are search results, show dropdown (already shown by useEffect)
    // If no results but user pressed Enter, still show dropdown (empty state)
    if (searchResults.length > 0 || loading) {
      setShowDropdown(true);
    } else {
      // If no results and user pressed Enter, perform search
      setShowDropdown(true);
    }
  };

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : user?.email || "Admin User";

  const displayRole = user?.subrole || user?.role || "";

  const initials =
    (displayName || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  return (
    <header
      className="fixed top-0 z-40 w-full border-b border-[#DFDBE3] bg-white"
      style={{ left: leftOffset, height }}
    >
      <div className="flex h-full w-full max-w-[1111px] items-center justify-between px-[20px]">
        {/* Search */}
        <div ref={searchRef} className="relative w-[555px]">
          <form
            onSubmit={handleGlobalSearch}
            className="flex items-center gap-[10px] rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4"
          >
            <button
              type="submit"
              aria-label="Search customers"
              className="flex-shrink-0"
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9.585 18c4.372 0 7.917-3.544 7.917-7.917S13.957 2.167 9.585 2.167 1.668 5.711 1.668 10.083 5.212 18 9.585 18Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                />
                <path
                  d="m18.335 18.833-1.667-1.667"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowDropdown(true);
                }
              }}
              placeholder="Search customers, tickets, orders..."
              className="w-full bg-transparent text-[16px] leading-[28px] text-[#0A0A0A] placeholder-[#0A0A0A] outline-none"
            />
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-[#6F6C90]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </form>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full rounded-[10px] border border-[#DFDBE3] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.06)] z-50 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-[14px] text-[#6F6C90]">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((customer) => (
                    <div
                      onClick={() => handleNavigateToCustomer(customer)}
                      key={customer.id}
                      className="mb-2 last:mb-0"
                    >
                      <div className="px-3 py-2 rounded-[8px] hover:bg-[#F8F8F8] cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-semibold text-[#0A0A0A] truncate">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-[12px] text-[#6F6C90] truncate">
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="text-[12px] text-[#6F6C90] truncate">
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleNavigateToTab(customer, 'notes')}
                            className="flex-1 px-3 py-1.5 rounded-[6px] bg-[#401B60] text-[12px] font-semibold text-white hover:opacity-95 transition-opacity"
                          >
                            Notes
                          </button>
                          <button
                            onClick={() => handleNavigateToTab(customer, 'plans')}
                            className="flex-1 px-3 py-1.5 rounded-[6px] bg-[#401B60] text-[12px] font-semibold text-white hover:opacity-95 transition-opacity"
                          >
                            Plans
                          </button>
                          <button
                            onClick={() => handleNavigateToTab(customer, 'verification')}
                            className="flex-1 px-3 py-1.5 rounded-[6px] bg-[#401B60] text-[12px] font-semibold text-white hover:opacity-95 transition-opacity"
                          >
                            Verification
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : search.trim().length >= 2 ? (
                <div className="p-4 text-center text-[14px] text-[#6F6C90]">
                  No customers found matching "{search}"
                </div>
              ) : null}
            </div>
          )}
        </div>
        {/* Right controls: Add New Service, Add New Customer button and current user info */}
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => setShowAddCustomer(true)}
            className="rounded-[18px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 transition-opacity"
          >
            Add New Customer
          </button>
          {user ? (
            <div className="flex items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2">
              <div className="flex flex-col text-right">
                <span className="text-[14px] font-semibold text-[#0A0A0A]">
                  {displayName}
                </span>
                {displayRole && (
                  <span className="text-[12px] text-[#6F6C90]">
                    {displayRole}
                  </span>
                )}
              </div>
              <div className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#401B60] text-white text-[14px] font-semibold flex-shrink-0">
                {initials}
              </div>
            </div>
          ) : (
            <button className="w-[97px] rounded-[6px] bg-[#401B60] py-4 text-center text-[16px] font-semibold text-white">
              Login
            </button>
          )}
        </div>
      </div>

      {/* Unified Customer Signup Modal */}
      <UnifiedCustomerSignupController
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
      />

    </header>
  );
}

