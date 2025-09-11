"use client";

import { useMemo, useState } from "react";

type IdType = "DRIVERS_LICENCE" | "PASSPORT" | "MEDICARE";

type CommonFields = {
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  consent: boolean;
};

type DriversFields = CommonFields & {
  licenceNumber: string;
  stateOfIssue: string;
};

type PassportFields = CommonFields & {
  passportNumber: string;
  countryOfIssue: string;
};

type MedicareFields = CommonFields & {
  medicareNumber: string;
  irn: string;    // Individual Reference Number
  expiry: string; // YYYY-MM
};

export type DVSSubmitPayload =
  | { idType: "DRIVERS_LICENCE"; data: DriversFields }
  | { idType: "PASSPORT";        data: PassportFields }
  | { idType: "MEDICARE";        data: MedicareFields };

export default function DVSVerification({
  onVerify,
  loading = false,
  defaultIdType = "DRIVERS_LICENCE",
  apiError,
}: {
  onVerify: (payload: DVSSubmitPayload) => void;
  loading?: boolean;
  defaultIdType?: IdType;
  apiError?: string | null;
}) {
  const [idType, setIdType] = useState<IdType>(defaultIdType);
  const [consent, setConsent] = useState(false);

  // Common
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [dob, setDob]             = useState("");

  // Licence
  const [licenceNumber, setLicenceNumber] = useState("");
  const [stateOfIssue, setStateOfIssue]   = useState("");

  // Passport
  const [passportNumber, setPassportNumber] = useState("");
  const [countryOfIssue, setCountryOfIssue] = useState("");

  // Medicare
  const [medicareNumber, setMedicareNumber] = useState("");
  const [irn, setIrn]                       = useState("");
  const [expiry, setExpiry]                 = useState("");

  const canSubmit = useMemo(() => {
    if (!consent || !firstName || !lastName || !dob) return false;
    if (idType === "DRIVERS_LICENCE")   return !!licenceNumber && !!stateOfIssue;
    if (idType === "PASSPORT")          return !!passportNumber && !!countryOfIssue;
    if (idType === "MEDICARE")          return !!medicareNumber && !!irn && !!expiry;
    return false;
  }, [
    consent, firstName, lastName, dob,
    idType, licenceNumber, stateOfIssue,
    passportNumber, countryOfIssue,
    medicareNumber, irn, expiry
  ]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    const base: CommonFields = { firstName, lastName, dob, consent };

    if (idType === "DRIVERS_LICENCE") {
      onVerify({ idType, data: { ...base, licenceNumber, stateOfIssue } });
    } else if (idType === "PASSPORT") {
      onVerify({ idType, data: { ...base, passportNumber, countryOfIssue } });
    } else {
      onVerify({ idType, data: { ...base, medicareNumber, irn, expiry } });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* ID Type */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">ID Type</label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value as IdType)}
          className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
        >
          <option value="DRIVERS_LICENCE">Driver&apos;s Licence</option>
          <option value="PASSPORT">Passport</option>
          <option value="MEDICARE">Medical Card</option>
        </select>
      </div>

      {/* Common fields */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
          />
        </div>
      </div>

      {/* Dynamic fields */}
      {idType === "DRIVERS_LICENCE" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Licence number</label>
            <input
              value={licenceNumber}
              onChange={(e) => setLicenceNumber(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">State of issue</label>
            <select
              value={stateOfIssue}
              onChange={(e) => setStateOfIssue(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
            >
              <option value="">Select state…</option>
              {["ACT","NSW","NT","QLD","SA","TAS","VIC","WA"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {idType === "PASSPORT" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Passport number</label>
            <input
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Country of issue</label>
            <input
              value={countryOfIssue}
              onChange={(e) => setCountryOfIssue(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
              placeholder="e.g., Australia"
            />
          </div>
        </div>
      )}

      {idType === "MEDICARE" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Medicare card number</label>
            <input
              value={medicareNumber}
              onChange={(e) => setMedicareNumber(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
              placeholder="e.g., 1234 56789 1"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">IRN</label>
            <input
              value={irn}
              onChange={(e) => setIrn(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
              placeholder="1–5"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">Expiry (MM/YYYY)</label>
            <input
              type="month"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
            />
          </div>
        </div>
      )}

      {/* Consent */}
      <label className="mt-1 flex items-start gap-3 text-[14px] font-semibold text-[#401B60]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#401B60]"
        />
        I am authorised to provide these details and I consent to them being checked against official
        records by a secure verification service.
      </label>

      {apiError ? (
        <p className="text-[14px] font-medium text-[#C63D3D]">{apiError}</p>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-[10px] bg-[#401B60] px-5 py-2.5 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify ID"}
        </button>
      </div>
    </form>
  );
}
