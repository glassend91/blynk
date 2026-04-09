"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

export default function PanelIntegrations() {
  const [ovApi, setOvApi] = useState("https://api.oneview.com.au/v1");
  const [ovKey, setOvKey] = useState("");
  const [ovEnabled, setOvEnabled] = useState(false);
  const [ovHasKey, setOvHasKey] = useState(false);

  const [zohoClient, setZohoClient] = useState("");
  const [zohoKey, setZohoKey] = useState("");
  const [zohoSync, setZohoSync] = useState(false);
  const [zohoHasKey, setZohoHasKey] = useState(false);

  const [ctEmail, setCtEmail] = useState("");
  const [ctPassword, setCtPassword] = useState("");
  const [ctTenantId, setCtTenantId] = useState("");
  const [ctToken, setCtToken] = useState("");
  const [ctTokenUpdatedAt, setCtTokenUpdatedAt] = useState<string | null>(null);
  const [ctEnabled, setCtEnabled] = useState(false);
  const [ctHasPassword, setCtHasPassword] = useState(false);
  const [ctLoggingIn, setCtLoggingIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

        if (settings.integrations?.oneview) {
          setOvApi(
            settings.integrations.oneview.apiEndpoint ||
              "https://api.oneview.com.au/v1",
          );
          setOvKey("");
          setOvHasKey(!!settings.integrations.oneview.apiKey);
          setOvEnabled(settings.integrations.oneview.enabled || false);
        }

        if (settings.integrations?.zoho) {
          setZohoClient(settings.integrations.zoho.clientId || "");
          setZohoKey("");
          setZohoHasKey(!!settings.integrations.zoho.apiKey);
          setZohoSync(settings.integrations.zoho.syncEnabled || false);
        }

        if (settings.integrations?.connectTel) {
          setCtEmail(settings.integrations.connectTel.email || "");
          setCtPassword("");
          setCtHasPassword(!!settings.integrations.connectTel.password);
          setCtTenantId(settings.integrations.connectTel.tenantId || "");
          setCtToken(settings.integrations.connectTel.token || "");
          setCtTokenUpdatedAt(
            settings.integrations.connectTel.tokenUpdatedAt || null,
          );
          setCtEnabled(settings.integrations.connectTel.enabled || false);
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

      const payload: any = {
        oneview: {
          apiEndpoint: ovApi,
          enabled: ovEnabled,
        },
        zoho: {
          clientId: zohoClient,
          syncEnabled: zohoSync,
        },
      };

      if (ovKey) payload.oneview.apiKey = ovKey;
      if (zohoKey) payload.zoho.apiKey = zohoKey;

      const ctPayload: any = {
        email: ctEmail,
        tenantId: ctTenantId,
        enabled: ctEnabled,
      };
      if (ctPassword) ctPayload.password = ctPassword;

      const res1 = await apiClient.put(
        "/system-settings/integrations",
        payload,
      );
      const res2 = await apiClient.put(
        "/system-settings/integrations/connect-tel",
        ctPayload,
      );

      if (res1.data?.success && res2.data?.success) {
        setMessage({
          type: "success",
          text: "All integration settings saved successfully",
        });
        if (ovKey) {
          setOvHasKey(true);
          setOvKey("");
        }
        if (zohoKey) {
          setZohoHasKey(true);
          setZohoKey("");
        }
        if (ctPassword) {
          setCtHasPassword(true);
          setCtPassword("");
        }
      }
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestOneview = async () => {
    try {
      setTesting(true);
      setMessage(null);
      const payload: any = { apiEndpoint: ovApi };
      if (ovKey) payload.apiKey = ovKey;
      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/system-settings/integrations/oneview/test", payload);
      setMessage({
        type: data.success ? "success" : "error",
        text: data.message,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to test connection",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCtLogin = async () => {
    try {
      setCtLoggingIn(true);
      setMessage(null);
      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
        token: string;
        tokenUpdatedAt: string;
      }>("/system-settings/integrations/connect-tel/login", {
        email: ctEmail,
        password: ctPassword,
        tenantId: ctTenantId,
      });
      if (data?.success) {
        setCtToken(data.token);
        setCtTokenUpdatedAt(data.tokenUpdatedAt);
        setMessage({
          type: "success",
          text: data.message || "Authenticated with ConnectTel successfully",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to login to ConnectTel",
      });
    } finally {
      setCtLoggingIn(false);
    }
  };

  const handleSaveTenantId = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const { data } = await apiClient.put<{
        success: boolean;
        message: string;
      }>("/system-settings/integrations/connect-tel", {
        tenantId: ctTenantId,
      });
      if (data?.success) {
        setMessage({ type: "success", text: "Tenant ID saved successfully" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save Tenant ID",
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
          className={`flex items-center justify-between rounded-[10px] border px-4 py-3 text-[13px] ${
            message.type === "success"
              ? "border-[#C6F6D5] bg-[#F0FFF4] text-[#22543D]"
              : "border-[#FCD1D2] bg-[#FFF5F5] text-[#C53030]"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-4 flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Close message"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* ConnectTel */}
        <section className="col-span-full rounded-[12.75px] border border-[#DFDBE3] p-6 bg-purple-50/30">
          {/* <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A]">ConnectTel SMS Configuration</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCtLogin}
                disabled={ctLoggingIn || !ctEmail || !ctTenantId}
                className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
              >
                {ctLoggingIn ? 'Logging in...' : 'Update Token (Login)'}
              </button>
            </div>
          </div> */}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-[14px] font-bold text-[#401B60]">
                1. Authentication Credentials
              </h4>
              <div className="grid gap-4">
                <Field label="Email Address">
                  <input
                    value={ctEmail}
                    onChange={(e) => setCtEmail(e.target.value)}
                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-3 py-[11px] outline-none"
                  />
                </Field>
                <Field label="Password">
                  <input
                    type="password"
                    value={ctPassword}
                    onChange={(e) => setCtPassword(e.target.value)}
                    placeholder={ctHasPassword ? "••••••••" : "Enter password"}
                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-3 py-[11px] outline-none"
                  />
                </Field>
                <button
                  onClick={handleCtLogin}
                  disabled={ctLoggingIn || !ctEmail || !ctTenantId}
                  className="w-full rounded-[6px] bg-[#401B60] px-4 py-[11px] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {ctLoggingIn ? "Logging in..." : "Update Token (Login)"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[14px] font-bold text-[#401B60]">
                2. Tenant Configuration
              </h4>
              <div className="grid gap-4">
                <Field label="Tenant ID">
                  <input
                    value={ctTenantId}
                    onChange={(e) => setCtTenantId(e.target.value)}
                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-3 py-[11px] outline-none"
                  />
                </Field>
                <button
                  onClick={handleSaveTenantId}
                  disabled={saving || !ctTenantId}
                  className="w-full rounded-[6px] border border-[#401B60] bg-[#401B60] px-4 py-[11px] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Tenant ID"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-white rounded-lg border border-[#DFDBE3] font-mono text-[11px] break-all">
            <span className="font-bold mr-2">Active Token:</span>
            {ctToken || "Not authenticated"}
            {ctTokenUpdatedAt && (
              <span className="ml-2 text-[#6F6C90]">
                (Last Updated: {new Date(ctTokenUpdatedAt).toLocaleString()})
              </span>
            )}
          </div>

          {/* <div className="mt-5 flex items-center justify-between">
            <span className="text-[14px] text-[#0A0A0A]">Enable ConnectTel Integration</span>
            <Switch checked={ctEnabled} onChange={setCtEnabled} />
          </div> */}
        </section>

        {/* Oneview */}
        <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A]">
              Oneview API Configuration
            </h3>
            <button
              onClick={handleTestOneview}
              disabled={testing}
              className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>
          <Field label="API Endpoint">
            <input
              value={ovApi}
              onChange={(e) => setOvApi(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
            />
          </Field>
          <div className="mt-4">
            <Field label="API Key">
              <input
                type="password"
                value={ovKey || (ovHasKey ? "•••••••••••••" : "")}
                onChange={(e) => setOvKey(e.target.value)}
                placeholder={
                  ovHasKey ? "Enter new API key to update" : "Enter API key"
                }
                className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
              />
            </Field>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[14px] text-[#0A0A0A]">
              Enable Oneview Integration
            </span>
            <Switch checked={ovEnabled} onChange={setOvEnabled} />
          </div>
        </section>

        {/* Zoho */}
        <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A]">
              Zoho CRM Integration
            </h3>
            <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
              Authorize Zoho
            </button>
          </div>
          <Field label="Client ID">
            <input
              value={zohoClient}
              onChange={(e) => setZohoClient(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
            />
          </Field>
          <div className="mt-4">
            <Field label="API Key">
              <input
                type="password"
                value={zohoKey || (zohoHasKey ? "•••••••••••••" : "")}
                onChange={(e) => setZohoKey(e.target.value)}
                placeholder={
                  zohoHasKey ? "Enter new API key to update" : "Enter API key"
                }
                className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
              />
            </Field>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[14px] text-[#0A0A0A]">
              Enable Support Ticket Sync
            </span>
            <Switch checked={zohoSync} onChange={setZohoSync} />
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Integration Settings"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <div className="mb-2 text-[14px] font-medium text-[#0A0A0A]">{label}</div>
      {children}
    </label>
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
