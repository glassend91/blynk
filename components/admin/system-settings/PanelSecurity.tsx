"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

export default function PanelSecurity() {
  const [require2fa, setRequire2fa] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState(false);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [timeout, setTimeout] = useState(60);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<{ success: boolean; data: any }>(
        "/system-settings",
      );

      if (data?.success && data.data) {
        const settings = data.data;

        if (settings.security) {
          setRequire2fa(settings.security.require2FA ?? false);
          setPasswordExpiry(settings.security.passwordExpiry ?? false);
          setPasswordExpiryDays(settings.security.passwordExpiryDays ?? 90);
          setTimeout(settings.security.sessionTimeout ?? 60);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch settings:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to load settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const { data } = await apiClient.put<{
        success: boolean;
        message: string;
      }>("/system-settings/security", {
        require2FA: require2fa,
        passwordExpiry: passwordExpiry,
        passwordExpiryDays: passwordExpiryDays,
        sessionTimeout: timeout,
      });

      if (data?.success) {
        setMessage({
          type: "success",
          text: data.message || "Security settings saved successfully",
        });
      }
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[16px] text-[#6F6C90]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-[10px] border px-4 py-3 text-[13px] ${
            message.type === "success"
              ? "border-[#C6F6D5] bg-[#F0FFF4] text-[#22543D]"
              : "border-[#FCD1D2] bg-[#FFF5F5] text-[#C53030]"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">
          Security Settings
        </h3>

        <div className="rounded-[10px] bg-[#F8F8F8] p-4">
          <h4 className="mb-3 text-[14px] font-medium text-[#0A0A0A]">
            Authentication
          </h4>
          <Row
            label="Require two-factor authentication"
            checked={require2fa}
            onChange={setRequire2fa}
          />
          <Row
            label={`Password expiry (${passwordExpiryDays} days)`}
            checked={passwordExpiry}
            onChange={setPasswordExpiry}
          />
          {passwordExpiry && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[14px] text-[#0A0A0A]">
                Expiry period (days)
              </span>
              <input
                type="number"
                min={1}
                max={365}
                value={passwordExpiryDays}
                onChange={(e) =>
                  setPasswordExpiryDays(parseInt(e.target.value || "90", 10))
                }
                className="w-[72px] rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-[9px] text-center outline-none"
              />
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[10px] bg-[#F8F8F8] p-4">
          <h4 className="mb-3 text-[14px] font-medium text-[#0A0A0A]">
            Session Management
          </h4>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#0A0A0A]">
              Session timeout (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={1440}
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value || "60", 10))}
              className="w-[72px] rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-[9px] text-center outline-none"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Security Settings"}
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-[10px] px-4 py-3">
      <span className="text-[14px] text-[#0A0A0A]">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "h-6 w-11 rounded-full px-1 transition-colors",
        checked ? "bg-[#2BBF5A]" : "bg-[#DFDBE3]",
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "block h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
