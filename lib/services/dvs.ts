import apiClient from "@/lib/apiClient";

export type DocumentType = "drivers_licence" | "passport" | "medicare_card" | "birth_certificate";

export type DocumentData = {
    idType: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentNumber: string;
    countryOfIssue?: string; // For passport
    stateOfIssue?: string; // For driver's licence
    documentImage?: File; // File upload
    [key: string]: any; // Allow additional fields
};

export type VerificationResult = {
    success: boolean;
    verified: boolean;
    confidence?: number;
    documentType?: string;
    expiryDate?: string;
    reason?: string;
    suggestions?: string[];
    error?: string;
};

export async function verifyDocument(documentData: DocumentData): Promise<VerificationResult> {
    try {
        // Create FormData for file upload
        const formData = new FormData();

        // Add all text fields
        Object.entries(documentData).forEach(([key, value]) => {
            if (key !== 'documentImage' && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Add file if present
        if (documentData.documentImage) {
            formData.append('documentImage', documentData.documentImage);
        }

        const { data } = await apiClient.post<VerificationResult>("/identity/verify", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error: any) {
        return {
            success: false,
            verified: false,
            error: error?.message || "Verification failed"
        };
    }
}

export async function getDocumentFields(documentType: DocumentType): Promise<{
    required: string[];
    optional: string[];
    fields: Record<string, {
        label: string;
        type: string;
        placeholder: string;
        validation?: {
            pattern?: string;
            minLength?: number;
            maxLength?: number;
        };
    }>;
}> {
    try {
        const { data } = await apiClient.get(`/identity/fields/${documentType}`);
        return data;
    } catch (error) {
        // Return default fields if API fails
        return getDefaultDocumentFields(documentType);
    }
}

function getDefaultDocumentFields(documentType: DocumentType) {
    const fields: Record<string, any> = {
        drivers_licence: {
            required: ["documentNumber", "state", "expiryDate"],
            optional: [],
            fields: {
                documentNumber: {
                    label: "Licence Number",
                    type: "text",
                    placeholder: "Enter your licence number",
                    validation: { minLength: 6, maxLength: 12 }
                },
                state: {
                    label: "State/Territory",
                    type: "select",
                    placeholder: "Select state"
                },
                expiryDate: {
                    label: "Expiry Date",
                    type: "date",
                    placeholder: "DD/MM/YYYY"
                }
            }
        },
        passport: {
            required: ["documentNumber", "country", "expiryDate"],
            optional: [],
            fields: {
                documentNumber: {
                    label: "Passport Number",
                    type: "text",
                    placeholder: "Enter passport number",
                    validation: { minLength: 6, maxLength: 12 }
                },
                country: {
                    label: "Country of Issue",
                    type: "select",
                    placeholder: "Select country"
                },
                expiryDate: {
                    label: "Expiry Date",
                    type: "date",
                    placeholder: "DD/MM/YYYY"
                }
            }
        },
        medicare_card: {
            required: ["documentNumber", "referenceNumber", "expiryDate"],
            optional: [],
            fields: {
                documentNumber: {
                    label: "Medicare Number",
                    type: "text",
                    placeholder: "Enter Medicare number",
                    validation: { minLength: 10, maxLength: 11 }
                },
                referenceNumber: {
                    label: "Reference Number",
                    type: "text",
                    placeholder: "Enter reference number",
                    validation: { minLength: 1, maxLength: 2 }
                },
                expiryDate: {
                    label: "Expiry Date",
                    type: "date",
                    placeholder: "DD/MM/YYYY"
                }
            }
        }
    };

    return fields[documentType] || fields.drivers_licence;
}

export const DOCUMENT_TYPES = [
    { value: "drivers_licence", label: "Driver's Licence" },
    { value: "passport", label: "Passport" },
    { value: "medicare_card", label: "Medicare Card" },
    { value: "birth_certificate", label: "Birth Certificate" }
] as const;

export const STATES = [
    { value: "NSW", label: "New South Wales" },
    { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" },
    { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" },
    { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" }
] as const;

export const COUNTRIES = [
    { value: "AU", label: "Australia" },
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "NZ", label: "New Zealand" },
    { value: "CA", label: "Canada" }
] as const;
