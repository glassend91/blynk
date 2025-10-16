"use client";

import { useMemo, useState } from "react";
import { verifyDocument, type DocumentData, type DocumentType } from "@/lib/services/dvs";

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
  | { idType: "PASSPORT"; data: PassportFields }
  | { idType: "MEDICARE"; data: MedicareFields };

export default function DVSVerification({
  onVerify,
  onSkip,
  loading = false,
  defaultIdType = "DRIVERS_LICENCE",
  apiError,
}: {
  onVerify: (payload: DVSSubmitPayload) => void;
  onSkip?: () => void;
  loading?: boolean;
  defaultIdType?: IdType;
  apiError?: string | null;
}) {
  const [idType, setIdType] = useState<IdType>(defaultIdType);
  const [consent, setConsent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Common
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  // Licence
  const [licenceNumber, setLicenceNumber] = useState("");
  const [stateOfIssue, setStateOfIssue] = useState("");

  // Passport
  const [passportNumber, setPassportNumber] = useState("");
  const [countryOfIssue, setCountryOfIssue] = useState("");

  // Medicare
  const [medicareNumber, setMedicareNumber] = useState("");
  const [irn, setIrn] = useState("");
  const [expiry, setExpiry] = useState("");

  const canSubmit = useMemo(() => {
    if (!consent || !firstName || !lastName || !dob || !selectedFile) return false;
    if (idType === "DRIVERS_LICENCE") return !!licenceNumber && !!stateOfIssue;
    if (idType === "PASSPORT") return !!passportNumber && !!countryOfIssue;
    if (idType === "MEDICARE") return !!medicareNumber && !!irn && !!expiry;
    return false;
  }, [
    consent, firstName, lastName, dob, selectedFile,
    idType, licenceNumber, stateOfIssue,
    passportNumber, countryOfIssue,
    medicareNumber, irn, expiry
  ]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading || verifying) return;

    setVerifying(true);
    setVerificationError(null);

    try {
      // Convert date from YYYY-MM-DD to DD/MM/YYYY format
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Map to DVS API format based on your API structure
      const documentData: DocumentData = {
        idType: idType,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: formatDateForAPI(dob),
        documentNumber: idType === "DRIVERS_LICENCE" ? licenceNumber :
          idType === "PASSPORT" ? passportNumber : medicareNumber,
        countryOfIssue: idType === "PASSPORT" ? countryOfIssue : undefined,
        stateOfIssue: idType === "DRIVERS_LICENCE" ? stateOfIssue : undefined,
        documentImage: selectedFile
      };

      // Call DVS API
      const result = await verifyDocument(documentData);

      if (result.verified) {
        // Map back to original format for compatibility
        const base: CommonFields = { firstName, lastName, dob, consent };

        if (idType === "DRIVERS_LICENCE") {
          onVerify({ idType, data: { ...base, licenceNumber, stateOfIssue } });
        } else if (idType === "PASSPORT") {
          onVerify({ idType, data: { ...base, passportNumber, countryOfIssue } });
        } else {
          onVerify({ idType, data: { ...base, medicareNumber, irn, expiry } });
        }
      } else {
        setVerificationError(result.error || "Verification failed");
      }
    } catch (error: any) {
      setVerificationError(error?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setVerificationError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setVerificationError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setVerificationError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setVerificationError(null);
  };

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
              {["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(s => (
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

      {/* File Upload */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
          Document Image <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <div className="border-2 border-dashed border-[#DFDBE3] rounded-[10px] p-6 text-center hover:border-[#401B60] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="document-upload"
            />
            <label
              htmlFor="document-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-[#F4F3F7] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#401B60" strokeWidth="2" />
                  <polyline points="14,2 14,8 20,8" stroke="#401B60" strokeWidth="2" />
                  <line x1="16" y1="13" x2="8" y2="13" stroke="#401B60" strokeWidth="2" />
                  <line x1="16" y1="17" x2="8" y2="17" stroke="#401B60" strokeWidth="2" />
                  <polyline points="10,9 9,9 8,9" stroke="#401B60" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#401B60]">Click to upload document image</p>
                <p className="text-xs text-[#8A84A3]">JPG, PNG - max 5MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="border border-[#DFDBE3] rounded-[10px] p-4">
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-16 h-16 border border-[#DFDBE3] rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Document preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-[#3B3551]">{selectedFile.name}</p>
                <p className="text-xs text-[#8A84A3]">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

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

      {(apiError || verificationError) && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 p-4">
          <p className="text-[14px] font-medium text-[#C63D3D]">
            {apiError || verificationError}
          </p>
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit || loading || verifying}
          className="rounded-[10px] bg-[#401B60] px-5 py-2.5 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {loading || verifying ? "Verifying…" : "Verify ID"}
        </button>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={loading || verifying}
            className="rounded-[10px] border border-[#DFDBE3] bg-white px-5 py-2.5 text-[15px] font-semibold text-[#401B60] hover:bg-[#F4F3F7] disabled:opacity-50"
          >
            Skip ID Check
          </button>
        )}
      </div>
    </form>
  );
}
