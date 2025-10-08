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
    type DocumentData
} from "@/lib/services/dvs";

export default function IdentityCheckModal({
    onNext,
    onBack,
    onClose,
    onIdentityVerified,
    canProceed = false
}: {
    onNext: () => void;
    onBack: () => void;
    onClose: () => void;
    onIdentityVerified: (result: any) => void;
    canProceed?: boolean;
}) {
    const [documentType, setDocumentType] = useState<DocumentType>("drivers_licence");
    const [documentFields, setDocumentFields] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [consentGiven, setConsentGiven] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newImages: string[] = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("File size must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                newImages.push(base64);
                setUploadedImages(prev => [...prev, ...newImages]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleVerify = async () => {
        if (!consentGiven) {
            setError("You must provide consent to proceed");
            return;
        }

        if (uploadedImages.length === 0) {
            setError("Please upload at least one document image");
            return;
        }

        setVerifying(true);
        setError(null);

        try {
            const documentData: DocumentData = {
                idType: documentType,
                firstName: formData.firstName || "",
                lastName: formData.lastName || "",
                documentType,
                documentNumber: formData.documentNumber || "",
                state: formData.state,
                country: formData.country,
                expiryDate: formData.expiryDate || "",
                fullName: formData.fullName || "",
                dateOfBirth: formData.dateOfBirth || "",
                images: uploadedImages
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

        return documentFields.required.every((field: string) => {
            return formData[field] && formData[field].trim() !== "";
        });
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
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20"
                                            >
                                                <option value="">{fieldConfig.placeholder}</option>
                                                {(field === "state" ? STATES : COUNTRIES).map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={fieldConfig.type}
                                                value={formData[field] || ""}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
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
                            Document Images
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20"
                        />
                        <p className="mt-1 text-xs text-[#8A84A3]">
                            Upload clear images of your document (JPG, PNG, PDF - max 5MB each)
                        </p>
                        {uploadedImages.length > 0 && (
                            <p className="mt-1 text-xs text-green-600">
                                {uploadedImages.length} image(s) uploaded
                            </p>
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
                            I consent to the collection and verification of my identity document for the purpose of completing my signup.
                            I understand that this information will be used solely for identity verification and will be handled in accordance with our privacy policy.
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
                        <div className={`rounded-[10px] border p-4 ${verificationResult.verified
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <p className={`text-sm ${verificationResult.verified ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {verificationResult.verified
                                    ? '✅ Identity verified successfully!'
                                    : `❌ Verification failed: ${verificationResult.reason || 'Unknown error'}`
                                }
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
