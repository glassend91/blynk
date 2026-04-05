'use client';

import { useEffect, useState } from 'react';
import { OTPForm } from '../../customer-verification/_local/OTPForm';
import { ManualVerification } from '../../customer-verification/_local/ManualVerification';
import { StatCard } from '../../customer-verification/_local/StatCard';
import { AddNoteDialog } from '../../customer-verification/_local/AddNoteDialog';
import apiClient from '@/lib/apiClient';

export default function CustomerVerificationTab() {
  const [openNote, setOpenNote] = useState(false);
  const [stats, setStats] = useState({
    pendingVerification: 0,
    verifiedToday: 0,
    failedVerifications: 0,
    otpsSentToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<{ success: boolean; data: any }>(
        '/customer-verification/statistics'
      );

      if (data?.success && data.data) {
        setStats({
          pendingVerification: data.data.pendingVerification || 0,
          verifiedToday: data.data.verifiedToday || 0,
          failedVerifications: data.data.failedVerifications || 0,
          otpsSentToday: data.data.otpsSentToday || 0,
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchStatistics(); // Refresh stats after successful operations
  };

  const statCards = [
    { label: 'Pending Verification', value: stats.pendingVerification, icon: 'clock' as const },
    { label: 'Verified Today', value: stats.verifiedToday, icon: 'check' as const },
    { label: 'Failed Verifications', value: stats.failedVerifications, icon: 'warning' as const },
    { label: 'OTPs Sent Today', value: stats.otpsSentToday, icon: 'send' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ManualVerification onSuccess={handleSuccess} />
        <OTPForm onSuccess={handleSuccess} />
      </div>

      {/* Floating action: Add Note */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpenNote(true)}
          className="rounded-md bg-[#401B60] px-5 py-3 text-[15px] font-semibold text-white shadow-sm hover:opacity-95"
        >
          Add New Service
        </button>
      </div>

      <AddNoteDialog open={openNote} onOpenChange={setOpenNote} onSuccess={handleSuccess} />
    </div>
  );
}

