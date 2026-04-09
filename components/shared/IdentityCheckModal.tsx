"use client";

import { useState, useEffect } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import {
  verifyDocument,
  getDocumentFields,
  DOCUMENT_TYPES,
  STATES,
  COUNTRIES,
  type DocumentType,
  type DocumentData,
} from "@/lib/services/dvs";

export default function IdentityCheckModal({
  onNext,
  onBack,
  onClose,
  onIdentityVerified,
  canProceed = false,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onIdentityVerified: (result: any) => void;
  canProceed?: boolean;
}) {
  const [documentType, setDocumentType] =
    useState<DocumentType>("drivers_licence");
  const [documentFields, setDocumentFields] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load document fields when document type changes
  useEffect(() => {
    const loadFields = async () => {
      try {
        const fields = await getDocumentFields(documentType);
        setDocumentFields(fields);
        setFormData({});
        setError(null);
      } catch (err) {
        setError("Failed to load document fields");
      }
    };
    loadFields();
  }, [documentType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setError(null);

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
    setError(null);
  };

  const handleVerify = async () => {
    if (!consentGiven) {
      setError("You must provide consent to proceed");
      return;
    }

    if (!selectedFile) {
      setError("Please upload a document image");
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const documentData: DocumentData = {
        idType: documentType,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        dateOfBirth: formData.dateOfBirth || "",
        documentNumber: formData.documentNumber || "",
        stateOfIssue: formData.state,
        countryOfIssue: formData.country,
        documentImage: selectedFile,
      };

      const result = await verifyDocument(documentData);
      setVerificationResult(result);

      if (result.verified) {
        onIdentityVerified(result);
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const isFormValid = () => {
    if (!documentFields) return false;

    // Check document fields
    const documentFieldsValid = documentFields.required.every(
      (field: string) => {
        return formData[field] && formData[field].trim() !== "";
      },
    );

    // Check if file is uploaded
    const fileUploaded = !!selectedFile;

    return documentFieldsValid && fileUploaded;
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Identity Verification
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          We need to verify your identity to complete your signup
        </p>
      </div>

      <SectionPanel>
        <div className="mx-auto max-w-[600px] space-y-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#3B3551] mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Form Fields */}
          {documentFields && (
            <div className="space-y-4">
              {documentFields.required.map((field: string) => {
                const fieldConfig = documentFields.fields[field];
                if (!fieldConfig) return null;

                return (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-[#3B3551] mb-2">
                      {fieldConfig.label}
                    </label>

                    {fieldConfig.type === "select" ? (
                      <select
                        value={formData[field] || ""}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20"
                      >
                        <option value="">{fieldConfig.placeholder}</option>
                        {(field === "state" ? STATES : COUNTRIES).map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <input
                        type={fieldConfig.type}
                        value={formData[field] || ""}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        placeholder={fieldConfig.placeholder}
                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#3B3551] mb-2">
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
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        stroke="#401B60"
                        strokeWidth="2"
                      />
                      <polyline
                        points="14,2 14,8 20,8"
                        stroke="#401B60"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="13"
                        x2="8"
                        y2="13"
                        stroke="#401B60"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="17"
                        x2="8"
                        y2="17"
                        stroke="#401B60"
                        strokeWidth="2"
                      />
                      <polyline
                        points="10,9 9,9 8,9"
                        stroke="#401B60"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#401B60]">
                      Click to upload document image
                    </p>
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
                    <p className="text-sm font-medium text-[#3B3551]">
                      {selectedFile.name}
                    </p>
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
                      <line
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#401B60]"
            />
            <label htmlFor="consent" className="text-sm text-[#2E2745]">
              I consent to the collection and verification of my identity
              document for the purpose of completing my signup. I understand
              that this information will be used solely for identity
              verification and will be handled in accordance with our privacy
              policy.
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-[10px] bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Verification Result */}
          {verificationResult && (
            <div
              className={`rounded-[10px] border p-4 ${
                verificationResult.verified
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`text-sm ${
                  verificationResult.verified
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {verificationResult.verified
                  ? "✅ Identity verified successfully!"
                  : `❌ Verification failed: ${verificationResult.reason || "Unknown error"}`}
              </p>
              {verificationResult.suggestions && (
                <ul className="mt-2 text-xs text-gray-600">
                  {verificationResult.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={handleVerify}
        nextDisabled={!canProceed || verifying}
        label={verifying ? "Verifying..." : "Verify Identity"}
      />
    </ModalShell>
  );
}
