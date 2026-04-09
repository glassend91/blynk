"use client";

import { useMemo, useState } from "react";
import { verifyDocument, type DocumentData } from "@/lib/services/dvs";

type IdType =
  | "DRIVERS_LICENCE"
  | "MEDICARE_CARD"
  | "PASSPORT"
  | "VISA"
  | "IMMICARD"
  | "BIRTH_CERTIFICATE";

type CommonFields = {
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  consent: boolean;
};

type DriversFields = CommonFields & {
  licenceNumber: string;
  stateOfIssue: string;
  cardNumber?: string; // Required for some states
};

type MedicareFields = CommonFields & {
  medicareNumber: string;
  irn: string; // Individual Reference Number
  expiry: string; // YYYY-MM
};

type PassportFields = CommonFields & {
  passportNumber: string;
  countryOfIssue: string;
};

type VisaFields = CommonFields & {
  passportNumber: string;
  countryOfIssue: string;
  visaGrantNumber: string;
};

type ImmiCardFields = CommonFields & {
  immiCardNumber: string;
};

type BirthCertificateFields = CommonFields & {
  registrationNumber: string;
  stateOfIssue: string;
};

export type DVSSubmitPayload =
  | { idType: "DRIVERS_LICENCE"; data: DriversFields }
  | { idType: "MEDICARE_CARD"; data: MedicareFields }
  | { idType: "PASSPORT"; data: PassportFields }
  | { idType: "VISA"; data: VisaFields }
  | { idType: "IMMICARD"; data: ImmiCardFields }
  | { idType: "BIRTH_CERTIFICATE"; data: BirthCertificateFields };

// States that require card number for Driver's Licence
const STATES_REQUIRING_CARD_NUMBER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS"];

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
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Validation error states
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  // Driver's Licence errors
  const [licenceNumberError, setLicenceNumberError] = useState<string | null>(
    null,
  );
  const [stateOfIssueError, setStateOfIssueError] = useState<string | null>(
    null,
  );
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);

  // Medicare errors
  const [medicareNumberError, setMedicareNumberError] = useState<string | null>(
    null,
  );
  const [irnError, setIrnError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);

  // Passport errors
  const [passportNumberError, setPassportNumberError] = useState<string | null>(
    null,
  );
  const [countryOfIssueError, setCountryOfIssueError] = useState<string | null>(
    null,
  );

  // Visa errors
  const [visaGrantNumberError, setVisaGrantNumberError] = useState<
    string | null
  >(null);

  // ImmiCard errors
  const [immiCardNumberError, setImmiCardNumberError] = useState<string | null>(
    null,
  );

  // Birth Certificate errors
  const [registrationNumberError, setRegistrationNumberError] = useState<
    string | null
  >(null);
  const [birthStateOfIssueError, setBirthStateOfIssueError] = useState<
    string | null
  >(null);

  // Common fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  // Driver's Licence fields
  const [licenceNumber, setLicenceNumber] = useState("");
  const [stateOfIssue, setStateOfIssue] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  // Medicare fields
  const [medicareNumber, setMedicareNumber] = useState("");
  const [irn, setIrn] = useState("");
  const [expiry, setExpiry] = useState("");

  // Passport fields
  const [passportNumber, setPassportNumber] = useState("");
  const [countryOfIssue, setCountryOfIssue] = useState("");

  // Visa fields
  const [visaGrantNumber, setVisaGrantNumber] = useState("");

  // ImmiCard fields
  const [immiCardNumber, setImmiCardNumber] = useState("");

  // Birth Certificate fields
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [birthStateOfIssue, setBirthStateOfIssue] = useState("");

  // Check if card number is required for driver's licence based on state
  const requiresCardNumber = useMemo(() => {
    return (
      idType === "DRIVERS_LICENCE" &&
      STATES_REQUIRING_CARD_NUMBER.includes(stateOfIssue)
    );
  }, [idType, stateOfIssue]);

  // Validation helper functions
  const isValidName = (value: string) =>
    /^[a-zA-Z\s'-]{2,}$/.test(value.trim());

  const getAge = (isoDate: string) => {
    if (!isoDate) return 0;
    const dob = new Date(isoDate);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  };

  const isAdult = (isoDate: string) => getAge(isoDate) >= 18;

  // Validate function - runs on submit
  const validate = (): boolean => {
    const fnErr = !firstName
      ? "First name is required"
      : !isValidName(firstName)
        ? "Enter a valid first name"
        : null;
    const lnErr = !lastName
      ? "Last name is required"
      : !isValidName(lastName)
        ? "Enter a valid last name"
        : null;
    const dbErr = !dob
      ? "Date of birth is required"
      : !isAdult(dob)
        ? "You must be at least 18 years old"
        : null;
    const fileErr = !selectedFile ? "Document image is required" : null;
    const consentErr = !consent ? "You must consent to proceed" : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setDobError(dbErr);
    setFileError(fileErr);
    setConsentError(consentErr);

    // ID type specific validation
    let idTypeValid = true;

    if (idType === "DRIVERS_LICENCE") {
      const licErr = !licenceNumber ? "Licence number is required" : null;
      const stateErr = !stateOfIssue ? "State of issue is required" : null;
      const cardErr =
        requiresCardNumber && !cardNumber
          ? "Card number is required for this state"
          : null;

      setLicenceNumberError(licErr);
      setStateOfIssueError(stateErr);
      setCardNumberError(cardErr);

      idTypeValid = !licErr && !stateErr && !cardErr;
    } else if (idType === "MEDICARE_CARD") {
      const medErr = !medicareNumber
        ? "Medicare card number is required"
        : null;
      const irnErr = !irn ? "IRN is required" : null;
      const expErr = !expiry ? "Expiry date is required" : null;

      setMedicareNumberError(medErr);
      setIrnError(irnErr);
      setExpiryError(expErr);

      idTypeValid = !medErr && !irnErr && !expErr;
    } else if (idType === "PASSPORT") {
      const passErr = !passportNumber ? "Passport number is required" : null;
      const countryErr = !countryOfIssue
        ? "Country of issue is required"
        : null;

      setPassportNumberError(passErr);
      setCountryOfIssueError(countryErr);

      idTypeValid = !passErr && !countryErr;
    } else if (idType === "VISA") {
      const passErr = !passportNumber ? "Passport number is required" : null;
      const countryErr = !countryOfIssue
        ? "Country of issue is required"
        : null;
      const visaErr = !visaGrantNumber ? "Visa grant number is required" : null;

      setPassportNumberError(passErr);
      setCountryOfIssueError(countryErr);
      setVisaGrantNumberError(visaErr);

      idTypeValid = !passErr && !countryErr && !visaErr;
    } else if (idType === "IMMICARD") {
      const immiErr = !immiCardNumber ? "ImmiCard number is required" : null;

      setImmiCardNumberError(immiErr);

      idTypeValid = !immiErr;
    } else if (idType === "BIRTH_CERTIFICATE") {
      const regErr = !registrationNumber
        ? "Registration number is required"
        : null;
      const birthStateErr = !birthStateOfIssue
        ? "State of issue is required"
        : null;

      setRegistrationNumberError(regErr);
      setBirthStateOfIssueError(birthStateErr);

      idTypeValid = !regErr && !birthStateErr;
    }

    // Clear errors for other ID types
    if (idType !== "DRIVERS_LICENCE") {
      setLicenceNumberError(null);
      setStateOfIssueError(null);
      setCardNumberError(null);
    }
    if (idType !== "MEDICARE_CARD") {
      setMedicareNumberError(null);
      setIrnError(null);
      setExpiryError(null);
    }
    if (idType !== "PASSPORT" && idType !== "VISA") {
      setPassportNumberError(null);
      setCountryOfIssueError(null);
    }
    if (idType !== "VISA") {
      setVisaGrantNumberError(null);
    }
    if (idType !== "IMMICARD") {
      setImmiCardNumberError(null);
    }
    if (idType !== "BIRTH_CERTIFICATE") {
      setRegistrationNumberError(null);
      setBirthStateOfIssueError(null);
    }

    return !fnErr && !lnErr && !dbErr && !fileErr && !consentErr && idTypeValid;
  };

  const canSubmit = useMemo(() => {
    if (!consent || !firstName || !lastName || !dob || !selectedFile)
      return false;

    if (idType === "DRIVERS_LICENCE") {
      const baseValid = !!licenceNumber && !!stateOfIssue;
      return requiresCardNumber ? baseValid && !!cardNumber : baseValid;
    }
    if (idType === "MEDICARE_CARD")
      return !!medicareNumber && !!irn && !!expiry;
    if (idType === "PASSPORT") return !!passportNumber && !!countryOfIssue;
    if (idType === "VISA")
      return !!passportNumber && !!countryOfIssue && !!visaGrantNumber;
    if (idType === "IMMICARD") return !!immiCardNumber;
    if (idType === "BIRTH_CERTIFICATE")
      return !!registrationNumber && !!birthStateOfIssue;

    return false;
  }, [
    consent,
    firstName,
    lastName,
    dob,
    selectedFile,
    idType,
    licenceNumber,
    stateOfIssue,
    cardNumber,
    requiresCardNumber,
    medicareNumber,
    irn,
    expiry,
    passportNumber,
    countryOfIssue,
    visaGrantNumber,
    immiCardNumber,
    registrationNumber,
    birthStateOfIssue,
  ]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || verifying) return;

    setSubmitted(true);
    if (!validate()) return;

    setVerifying(true);
    setVerificationError(null);

    try {
      // Convert date from YYYY-MM-DD to DD/MM/YYYY format
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Map ID type to API format
      const mapIdTypeToAPI = (type: IdType): string => {
        const mapping: Record<IdType, string> = {
          DRIVERS_LICENCE: "Driver Licence",
          MEDICARE_CARD: "Medicare Card",
          PASSPORT: "Passport",
          VISA: "Visa",
          IMMICARD: "ImmiCard",
          BIRTH_CERTIFICATE: "Birth Certificate",
        };
        return mapping[type] || type;
      };

      // Map to DVS API format based on your API structure
      const documentData: DocumentData = {
        idType: mapIdTypeToAPI(idType),
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: formatDateForAPI(dob),
        documentNumber:
          idType === "DRIVERS_LICENCE"
            ? licenceNumber
            : idType === "PASSPORT" || idType === "VISA"
              ? passportNumber
              : idType === "MEDICARE_CARD"
                ? medicareNumber
                : idType === "IMMICARD"
                  ? immiCardNumber
                  : registrationNumber,
        countryOfIssue:
          idType === "PASSPORT" || idType === "VISA"
            ? countryOfIssue
            : undefined,
        stateOfIssue:
          idType === "DRIVERS_LICENCE" || idType === "BIRTH_CERTIFICATE"
            ? idType === "DRIVERS_LICENCE"
              ? stateOfIssue
              : birthStateOfIssue
            : undefined,
        cardNumber:
          idType === "DRIVERS_LICENCE" && cardNumber ? cardNumber : undefined,
        visaGrantNumber: idType === "VISA" ? visaGrantNumber : undefined,
        documentImage: selectedFile,
      };

      // Call DVS API
      const result = await verifyDocument(documentData);

      if (result.verified) {
        // Map back to original format for compatibility
        const base: CommonFields = { firstName, lastName, dob, consent };

        if (idType === "DRIVERS_LICENCE") {
          onVerify({
            idType,
            data: {
              ...base,
              licenceNumber,
              stateOfIssue,
              cardNumber: cardNumber || undefined,
            },
          });
        } else if (idType === "MEDICARE_CARD") {
          onVerify({ idType, data: { ...base, medicareNumber, irn, expiry } });
        } else if (idType === "PASSPORT") {
          onVerify({
            idType,
            data: { ...base, passportNumber, countryOfIssue },
          });
        } else if (idType === "VISA") {
          onVerify({
            idType,
            data: { ...base, passportNumber, countryOfIssue, visaGrantNumber },
          });
        } else if (idType === "IMMICARD") {
          onVerify({ idType, data: { ...base, immiCardNumber } });
        } else if (idType === "BIRTH_CERTIFICATE") {
          onVerify({
            idType,
            data: {
              ...base,
              registrationNumber,
              stateOfIssue: birthStateOfIssue,
            },
          });
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

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setFileError("File size must be less than 5MB");
      setVerificationError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file");
      setVerificationError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setFileError(null);
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
    setFileError(null);
    setVerificationError(null);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* ID Type */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
          ID Type
        </label>
        <select
          value={idType}
          onChange={(e) => {
            setIdType(e.target.value as IdType);
            // Reset state-specific fields when changing ID type
            setCardNumber("");
            setStateOfIssue("");
            setBirthStateOfIssue("");
            // Clear all ID type specific errors
            setLicenceNumberError(null);
            setStateOfIssueError(null);
            setCardNumberError(null);
            setMedicareNumberError(null);
            setIrnError(null);
            setExpiryError(null);
            setPassportNumberError(null);
            setCountryOfIssueError(null);
            setVisaGrantNumberError(null);
            setImmiCardNumberError(null);
            setRegistrationNumberError(null);
            setBirthStateOfIssueError(null);
          }}
          className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
        >
          <option value="DRIVERS_LICENCE">Driver Licence</option>
          <option value="MEDICARE_CARD">Medicare Card</option>
          <option value="PASSPORT">Passport</option>
          <option value="VISA">Visa</option>
          <option value="IMMICARD">ImmiCard</option>
          <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
        </select>
      </div>

      {/* Common fields */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
            First name
          </label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (submitted) setFirstNameError(null);
            }}
            className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${firstNameError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
          />
          {firstNameError && (
            <p className="mt-1 text-xs text-red-600">{firstNameError}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
            Last name
          </label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (submitted) setLastNameError(null);
            }}
            className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${lastNameError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
          />
          {lastNameError && (
            <p className="mt-1 text-xs text-red-600">{lastNameError}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
            Date of birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              if (submitted) setDobError(null);
            }}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${dobError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
          />
          {dobError && <p className="mt-1 text-xs text-red-600">{dobError}</p>}
        </div>
      </div>

      {/* Driver's Licence fields */}
      {idType === "DRIVERS_LICENCE" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Licence number
            </label>
            <input
              value={licenceNumber}
              onChange={(e) => {
                setLicenceNumber(e.target.value);
                if (submitted) setLicenceNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${licenceNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="Enter licence number"
            />
            {licenceNumberError && (
              <p className="mt-1 text-xs text-red-600">{licenceNumberError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              State of issue
            </label>
            <select
              value={stateOfIssue}
              onChange={(e) => {
                setStateOfIssue(e.target.value);
                setCardNumber("");
                if (submitted) setStateOfIssueError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${stateOfIssueError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
            >
              <option value="">Select state…</option>
              {["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
            {stateOfIssueError && (
              <p className="mt-1 text-xs text-red-600">{stateOfIssueError}</p>
            )}
          </div>
          {requiresCardNumber && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
                Card number <span className="text-red-500">*</span>
              </label>
              <input
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  if (submitted) setCardNumberError(null);
                }}
                className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${cardNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Enter card number"
              />
              {cardNumberError ? (
                <p className="mt-1 text-xs text-red-600">{cardNumberError}</p>
              ) : (
                <p className="mt-1 text-[11px] text-[#6F6C90]">
                  Card number is required for {stateOfIssue} driver&apos;s
                  licences
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Medicare Card fields */}
      {idType === "MEDICARE_CARD" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Medicare card number
            </label>
            <input
              value={medicareNumber}
              onChange={(e) => {
                setMedicareNumber(e.target.value);
                if (submitted) setMedicareNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${medicareNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="e.g., 1234 56789 1"
            />
            {medicareNumberError && (
              <p className="mt-1 text-xs text-red-600">{medicareNumberError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              IRN
            </label>
            <input
              value={irn}
              onChange={(e) => {
                setIrn(e.target.value);
                if (submitted) setIrnError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${irnError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="1–5"
              maxLength={1}
            />
            {irnError && (
              <p className="mt-1 text-xs text-red-600">{irnError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Expiry (MM/YYYY)
            </label>
            <input
              type="month"
              value={expiry}
              onChange={(e) => {
                setExpiry(e.target.value);
                if (submitted) setExpiryError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${expiryError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
            />
            {expiryError && (
              <p className="mt-1 text-xs text-red-600">{expiryError}</p>
            )}
          </div>
        </div>
      )}

      {/* Passport fields */}
      {idType === "PASSPORT" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Passport number
            </label>
            <input
              value={passportNumber}
              onChange={(e) => {
                setPassportNumber(e.target.value);
                if (submitted) setPassportNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${passportNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="Enter passport number"
            />
            {passportNumberError && (
              <p className="mt-1 text-xs text-red-600">{passportNumberError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Country of issue
            </label>
            <input
              value={countryOfIssue}
              onChange={(e) => {
                setCountryOfIssue(e.target.value);
                if (submitted) setCountryOfIssueError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${countryOfIssueError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="e.g., Australia"
            />
            {countryOfIssueError && (
              <p className="mt-1 text-xs text-red-600">{countryOfIssueError}</p>
            )}
          </div>
        </div>
      )}

      {/* Visa fields */}
      {idType === "VISA" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Passport number
            </label>
            <input
              value={passportNumber}
              onChange={(e) => {
                setPassportNumber(e.target.value);
                if (submitted) setPassportNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${passportNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="Enter passport number"
            />
            {passportNumberError && (
              <p className="mt-1 text-xs text-red-600">{passportNumberError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Country of issue
            </label>
            <input
              value={countryOfIssue}
              onChange={(e) => {
                setCountryOfIssue(e.target.value);
                if (submitted) setCountryOfIssueError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${countryOfIssueError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="e.g., Australia"
            />
            {countryOfIssueError && (
              <p className="mt-1 text-xs text-red-600">{countryOfIssueError}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Visa grant number
            </label>
            <input
              value={visaGrantNumber}
              onChange={(e) => {
                setVisaGrantNumber(e.target.value);
                if (submitted) setVisaGrantNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${visaGrantNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="Enter visa grant number"
            />
            {visaGrantNumberError && (
              <p className="mt-1 text-xs text-red-600">
                {visaGrantNumberError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ImmiCard fields */}
      {idType === "IMMICARD" && (
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
            ImmiCard number
          </label>
          <input
            value={immiCardNumber}
            onChange={(e) => {
              setImmiCardNumber(e.target.value);
              if (submitted) setImmiCardNumberError(null);
            }}
            className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${immiCardNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
            placeholder="Enter ImmiCard number"
          />
          {immiCardNumberError && (
            <p className="mt-1 text-xs text-red-600">{immiCardNumberError}</p>
          )}
        </div>
      )}

      {/* Birth Certificate fields */}
      {idType === "BIRTH_CERTIFICATE" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              Registration number
            </label>
            <input
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value);
                if (submitted) setRegistrationNumberError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${registrationNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              placeholder="Enter registration number"
            />
            {registrationNumberError && (
              <p className="mt-1 text-xs text-red-600">
                {registrationNumberError}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
              State of issue
            </label>
            <select
              value={birthStateOfIssue}
              onChange={(e) => {
                setBirthStateOfIssue(e.target.value);
                if (submitted) setBirthStateOfIssueError(null);
              }}
              className={`w-full rounded-[10px] border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${birthStateOfIssueError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
            >
              <option value="">Select state…</option>
              {["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
            {birthStateOfIssueError && (
              <p className="mt-1 text-xs text-red-600">
                {birthStateOfIssueError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">
          Document Image <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-[10px] p-6 text-center transition-colors ${fileError ? "border-red-300 bg-red-50" : "border-[#DFDBE3] hover:border-[#401B60]"}`}
          >
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
        {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
      </div>

      {/* Consent - EXACT TEXT AS REQUIRED */}
      <div>
        <label className="mt-1 flex items-start gap-3 text-[14px] text-[#3B3551]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (submitted) setConsentError(null);
            }}
            className={`mt-0.5 h-4 w-4 accent-[#401B60] flex-shrink-0 ${consentError ? "ring-2 ring-red-500" : ""}`}
            required
          />
          <span className="leading-relaxed">
            I am authorised to provide these details, I consent to them being
            checked against official records by a secure verification service,
            and I confirm that I am 18 years of age or older.
          </span>
        </label>
        {consentError && (
          <p className="mt-1 text-xs text-red-600">{consentError}</p>
        )}
      </div>

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
