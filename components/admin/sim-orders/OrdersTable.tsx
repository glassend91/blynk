"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import apiClient from "@/lib/apiClient";

type Row = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  plan: string;
  status: "Pending ICCID" | "Awaiting Provisioning" | "Provisioned";
  orderDate: string; // yyyy-mm-dd
};

export default function OrdersTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<{ success: boolean; data: Row[] }>(
        "/sim-orders",
      );

      if (data?.success && data.data) {
        setRows(data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err?.message || "Failed to load SIM orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder: Row) => {
    setRows((prev) =>
      prev.map((r) => (r.id === updatedOrder.id ? updatedOrder : r)),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[16px] text-[#6F6C90]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-[14px] text-[#0A0A0A]">
          <tr>
            {[
              "#",
              "Order Number",
              "Customer",
              "Email",
              "Plan",
              "Status",
              "Order Date",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="border border-[#DFDBE3] bg-white px-4 py-4 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-[14px] text-[#6F6C90]">
          {rows.map((r, index) => (
            <tr key={r.id} className="hover:bg-[#FBFAFD]">
              <td className="border border-[#DFDBE3] px-4 py-4">{index + 1}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <span className="text-[#401B60]">{r.orderNumber}</span>
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                {r.customer}
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">{r.email}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">{r.plan}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                {r.orderDate}
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <ActionButtons row={r} onUpdate={handleOrderUpdate} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="border border-[#DFDBE3] px-4 py-8 text-center text-[#6F6C90]"
              >
                No SIM orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
