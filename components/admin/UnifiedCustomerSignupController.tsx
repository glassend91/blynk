"use client";

import { useCallback, useState, useEffect } from "react";
import { signup } from "@/lib/services/auth";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import ExitConfirmationDialog from "@/components/shared/ExitConfirmationDialog";
import BarActions from "@/components/shared/BarActions";
import FormField from "@/components/shared/FormField";
import Stepper from "@/components/shared/Stepper";
import { checkEmail } from "@/lib/services/auth";
import SignupModal1 from "@/components/nbn/modals/SignupModal1";
import SignupModal2 from "@/components/nbn/modals/SignupModal2";
import SignupModal5 from "@/components/nbn/modals/SignupModal5";
import SignupModal6 from "@/components/nbn/modals/SignupModal6";

type CustomerType = "residential" | "business";
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type AuthorizedContact = {
  firstName: string;
  lastName: string;
};

export default function UnifiedCustomerSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Common fields
  const [serviceAddress, setServiceAddress] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [identity, setIdentity] = useState<any>(null);

  // Residential fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingSameAsService, setBillingSameAsService] = useState(true);

  // Business fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [abn, setAbn] = useState("");
  const [acn, setAcn] = useState("");
  const [primaryFirstName, setPrimaryFirstName] = useState("");
  const [primaryLastName, setPrimaryLastName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [businessPassword, setBusinessPassword] = useState("");
  const [authorizedContacts, setAuthorizedContacts] = useState<AuthorizedContact[]>([
    { firstName: "", lastName: "" },
  ]);

  const closeAll = useCallback(() => {
    setStep(1);
    setCustomerType(null);
    setApiLoading(false);
    setApiError(null);
    setShowSuccess(false);
    setShowExitConfirmation(false);
    setServiceAddress("");
    setSelectedPlan(null);
    setIdentity(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setDateOfBirth("");
    setBillingAddress("");
    setBillingSameAsService(true);
    setBusinessName("");
    setBusinessType("");
    setAbn("");
    setAcn("");
    setPrimaryFirstName("");
    setPrimaryLastName("");
    setPrimaryEmail("");
    setPrimaryPhone("");
    setBusinessPassword("");
    setAuthorizedContacts([{ firstName: "", lastName: "" }]);
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError(null);

      if (customerType === "residential") {
        await signup({
          type: "NBN",
          firstName,
          lastName,
          email,
          password,
          phone,
          serviceAddress,
          dateOfBirth,
          billingAddress: billingSameAsService ? serviceAddress : billingAddress,
          selectedPlan: selectedPlan || undefined,
          identity,
          customerType: "residential",
        });
      } else {
        // Business customer
        await signup({
          type: "SME",
          firstName: primaryFirstName,
          lastName: primaryLastName,
          email: primaryEmail,
          password: businessPassword,
          phone: primaryPhone,
          serviceAddress,
          businessDetails: {
            businessName,
            businessAddress: serviceAddress,
            businessType,
            ABN: abn,
            ACN: acn,
            primaryContact: {
              firstName: primaryFirstName,
              lastName: primaryLastName,
              phone: primaryPhone,
              email: primaryEmail,
            },
            authorizedContacts: authorizedContacts
              .filter((c) => c.firstName.trim() && c.lastName.trim())
              .map((c) => ({
                firstName: c.firstName,
                lastName: c.lastName,
              })),
          },
          selectedPlan: selectedPlan || undefined,
          customerType: "business",
        });
      }

      setShowSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || "Signup failed");
    } finally {
      setApiLoading(false);
    }
  }, [
    customerType,
    firstName,
    lastName,
    email,
    password,
    phone,
    serviceAddress,
    dateOfBirth,
    billingAddress,
    billingSameAsService,
    selectedPlan,
    identity,
    businessName,
    businessType,
    abn,
    acn,
    primaryFirstName,
    primaryLastName,
    primaryEmail,
    primaryPhone,
    businessPassword,
    authorizedContacts,
  ]);

  const goNext = useCallback(() => {
    if (step === 6) {
      handleComplete();
      return;
    }
    // For business customers, skip ID check step (step 5)
    if (customerType === "business" && step === 4) {
      setStep(6); // Skip to payment
      return;
    }
    setStep((s) => Math.min(7, (s + 1)) as Step);
  }, [step, handleComplete, customerType]);

  const goBack = useCallback(() => {
    // For business customers, skip ID check step when going back
    if (customerType === "business" && step === 6) {
      setStep(4); // Go back to customer details
      return;
    }
    setStep((s) => Math.max(1, (s - 1)) as Step);
  }, [step, customerType]);

  const addAuthorizedContact = () => {
    if (authorizedContacts.length < 3) {
      setAuthorizedContacts([...authorizedContacts, { firstName: "", lastName: "" }]);
    }
  };

  const removeAuthorizedContact = (index: number) => {
    if (authorizedContacts.length > 1) {
      setAuthorizedContacts(authorizedContacts.filter((_, i) => i !== index));
    }
  };

  const updateAuthorizedContact = (index: number, field: "firstName" | "lastName", value: string) => {
    const updated = [...authorizedContacts];
    updated[index] = { ...updated[index], [field]: value };
    setAuthorizedContacts(updated);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
        {/* Step 1: Customer Type Selection */}
        {step === 1 && (
          <ModalShell onClose={handleCloseClick} size="default">
            <Stepper active={1} />
            <SectionPanel>
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink,#2F2151)] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4 19.8c0-3.3 4-5.8 8-5.8s8 2.5 8 5.8"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <h2 className="modal-h1 mt-4">Select Customer Type</h2>
                <p className="modal-sub mt-1">Choose whether this is a residential or business customer</p>
              </div>

              <div className="mx-auto mt-8 max-w-[600px] space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("residential");
                    setStep(2);
                  }}
                  className="w-full rounded-[12px] border-2 border-[#E7E4EC] bg-white p-6 text-left transition-all hover:border-[#401B60] hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F8F8F8]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                          stroke="#401B60"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#0A0A0A]">Residential Customer</h3>
                      <p className="mt-1 text-[14px] text-[#6F6C90]">For personal/home use</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomerType("business");
                    setStep(2);
                  }}
                  className="w-full rounded-[12px] border-2 border-[#E7E4EC] bg-white p-6 text-left transition-all hover:border-[#401B60] hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F8F8F8]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v12M9 9l6 4M9 9l-6 4"
                          stroke="#401B60"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#0A0A0A]">Business Customer</h3>
                      <p className="mt-1 text-[14px] text-[#6F6C90]">For business/commercial use</p>
                    </div>
                  </div>
                </button>
              </div>
            </SectionPanel>
            <BarActions onBack={closeAll} onNext={() => { }} nextDisabled={true} />
          </ModalShell>
        )}

        {/* Step 2: Address Check (same for both) */}
        {step === 2 && customerType && (
          <SignupModal1
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            address={serviceAddress}
            onChangeAddress={setServiceAddress}
          />
        )}

        {/* Step 3: Plan Selection (same for both) */}
        {step === 3 && customerType && (
          <SignupModal2
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
          />
        )}

        {/* Step 4: Customer Details (different for residential vs business) */}
        {step === 4 && customerType === "residential" && (
          <CustomerDetailsResidential
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            password={password}
            dateOfBirth={dateOfBirth}
            serviceAddress={serviceAddress}
            billingAddress={billingAddress}
            billingSameAsService={billingSameAsService}
            onChangeFirstName={setFirstName}
            onChangeLastName={setLastName}
            onChangeEmail={setEmail}
            onChangePhone={setPhone}
            onChangePassword={setPassword}
            onChangeDateOfBirth={setDateOfBirth}
            onChangeServiceAddress={setServiceAddress}
            onChangeBillingAddress={setBillingAddress}
            onChangeBillingSameAsService={setBillingSameAsService}
          />
        )}

        {step === 4 && customerType === "business" && (
          <CustomerDetailsBusiness
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            businessName={businessName}
            businessType={businessType}
            abn={abn}
            acn={acn}
            primaryFirstName={primaryFirstName}
            primaryLastName={primaryLastName}
            primaryEmail={primaryEmail}
            primaryPhone={primaryPhone}
            password={businessPassword}
            authorizedContacts={authorizedContacts}
            onChangeBusinessName={setBusinessName}
            onChangeBusinessType={setBusinessType}
            onChangeAbn={setAbn}
            onChangeAcn={setAcn}
            onChangePrimaryFirstName={setPrimaryFirstName}
            onChangePrimaryLastName={setPrimaryLastName}
            onChangePrimaryEmail={setPrimaryEmail}
            onChangePrimaryPhone={setPrimaryPhone}
            onChangePassword={setBusinessPassword}
            onAddAuthorizedContact={addAuthorizedContact}
            onRemoveAuthorizedContact={removeAuthorizedContact}
            onUpdateAuthorizedContact={updateAuthorizedContact}
          />
        )}

        {/* Step 5: ID Check (only for residential) */}
        {step === 5 && customerType === "residential" && (
          <SignupModal5 onNext={goNext} onBack={goBack} onClose={handleCloseClick} />
        )}

        {/* Step 6: Payment & Agreement */}
        {step === 6 && customerType && (
          <SignupModal6
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
          />
        )}

        {showSuccess && (
          <ModalShell onClose={closeAll} size="default">
            <SectionPanel>
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink,#2F2151)] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M20 7 10 17 4 11"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="modal-h1 mt-4">Thank You!</h2>
                <p className="modal-sub mt-1">Customer account created successfully.</p>
                <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
                  The customer will receive an email with their account details.
                </p>
                <button type="button" onClick={closeAll} className="btn-primary mt-6">
                  Close
                </button>
              </div>
            </SectionPanel>
          </ModalShell>
        )}

        {apiError && (
          <div className="fixed top-4 right-4 z-[100] rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-700 shadow-lg">
            {apiError}
          </div>
        )}
      </div>
      <ExitConfirmationDialog
        open={showExitConfirmation}
        onStay={() => setShowExitConfirmation(false)}
        onExit={closeAll}
      />
    </>
  );
}

// Residential Customer Details Component
function CustomerDetailsResidential({
  onNext,
  onBack,
  onClose,
  firstName,
  lastName,
  email,
  phone,
  password,
  dateOfBirth,
  serviceAddress,
  billingAddress,
  billingSameAsService,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePhone,
  onChangePassword,
  onChangeDateOfBirth,
  onChangeServiceAddress,
  onChangeBillingAddress,
  onChangeBillingSameAsService,
}: any) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serviceAddressError, setServiceAddressError] = useState<string | null>(null);
  const [billingAddressError, setBillingAddressError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (value: string) => /^[a-zA-Z\s'-]{2,}$/.test(value.trim());
  const isValidPhone = (value: string) => {
    const digits = value.replace(/[^\d+]/g, "");
    return digits.length >= 8;
  };

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
    const phErr = !phone
      ? "Phone number is required"
      : !isValidPhone(phone)
        ? "Enter a valid phone number"
        : null;
    const dbErr = !dateOfBirth
      ? "Date of birth is required"
      : !isAdult(dateOfBirth)
        ? "You must be at least 18 years old"
        : null;
    const pwErr = !password
      ? "Password is required"
      : password.length < 6
        ? "Password must be at least 6 characters"
        : null;
    const saErr = !serviceAddress ? "Service address is required" : null;
    const baErr =
      !billingSameAsService && !billingAddress ? "Billing address is required" : null;
    const emErr = !email
      ? "Email is required"
      : !isValidEmail(email)
        ? "Please enter a valid email address"
        : emailExists
          ? emailError || "Email already registered"
          : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setPhoneError(phErr);
    setDobError(dbErr);
    setPasswordError(pwErr);
    setServiceAddressError(saErr);
    setBillingAddressError(baErr);
    setEmailError(emErr);

    return !fnErr && !lnErr && !phErr && !dbErr && !pwErr && !saErr && !baErr && !emErr;
  };

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      setEmailExists(false);
      setEmailError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setEmailChecking(true);
        setEmailError(null);
        const res = await checkEmail(email);
        setEmailExists(res.exists);
        if (res.exists) setEmailError(res.message);
      } catch (err: any) {
        setEmailError(err?.message || "Could not verify email");
      } finally {
        setEmailChecking(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [email]);

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={4} />
      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5" />
              <path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="modal-h1 mt-4">Customer Details</h2>
          <p className="modal-sub mt-1">Please provide contact information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[860px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="First Name">
              <input
                className={`input w-full ${firstNameError ? "border-red-300 bg-red-50" : ""}`}
                value={firstName}
                onChange={(e) => {
                  onChangeFirstName(e.target.value);
                  if (submitted) setFirstNameError(null);
                }}
              />
              {firstNameError && <p className="mt-1 text-xs text-red-600">{firstNameError}</p>}
            </FormField>
            <FormField label="Last Name">
              <input
                className={`input w-full ${lastNameError ? "border-red-300 bg-red-50" : ""}`}
                value={lastName}
                onChange={(e) => {
                  onChangeLastName(e.target.value);
                  if (submitted) setLastNameError(null);
                }}
              />
              {lastNameError && <p className="mt-1 text-xs text-red-600">{lastNameError}</p>}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Email Address">
              <input
                type="email"
                autoComplete="email"
                className={`input w-full ${emailError || emailExists || (email && !isValidEmail(email))
                    ? "border-red-300 bg-red-50"
                    : email && isValidEmail(email) && !emailChecking
                      ? "border-green-300 bg-green-50"
                      : ""
                  }`}
                value={email}
                onChange={(e) => {
                  onChangeEmail(e.target.value);
                  if (submitted) setEmailError(null);
                }}
              />
              {emailChecking && <p className="mt-1 text-xs text-gray-500">Checking availability...</p>}
              {emailError && !emailChecking && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
              {!emailError && email && isValidEmail(email) && !emailExists && !emailChecking && (
                <p className="mt-1 text-xs text-green-600">Email is available</p>
              )}
            </FormField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Contact Phone Number">
              <input
                type="tel"
                className={`input w-full ${phoneError ? "border-red-300 bg-red-50" : ""}`}
                value={phone}
                onChange={(e) => {
                  onChangePhone(e.target.value);
                  if (submitted) setPhoneError(null);
                }}
              />
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </FormField>
            <FormField label="Date of Birth">
              <input
                type="date"
                className={`input w-full ${dobError ? "border-red-300 bg-red-50" : ""}`}
                value={dateOfBirth}
                onChange={(e) => {
                  onChangeDateOfBirth(e.target.value);
                  if (submitted) setDobError(null);
                }}
                max={new Date().toISOString().split("T")[0]}
              />
              {dobError && <p className="mt-1 text-xs text-red-600">{dobError}</p>}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Service Address">
              <input
                autoComplete="street-address"
                className={`input w-full ${serviceAddressError ? "border-red-300 bg-red-50" : ""}`}
                value={serviceAddress}
                onChange={(e) => {
                  onChangeServiceAddress(e.target.value);
                  if (submitted) setServiceAddressError(null);
                }}
              />
              {serviceAddressError && (
                <p className="mt-1 text-xs text-red-600">{serviceAddressError}</p>
              )}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Password">
              <input
                type="password"
                className={`input w-full ${passwordError ? "border-red-300 bg-red-50" : ""}`}
                value={password}
                onChange={(e) => {
                  onChangePassword(e.target.value);
                  if (submitted) setPasswordError(null);
                }}
              />
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </FormField>
          </div>

          <div className="mt-6 border-t border-[#E9E3F2] pt-6">
            <label className="flex items-center gap-3 text-[15px] font-semibold text-[#2E2745]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--cl-brand)]"
                checked={billingSameAsService}
                onChange={(e) => {
                  onChangeBillingSameAsService(e.target.checked);
                  if (submitted) setBillingAddressError(null);
                }}
              />
              Billing address is the same as my service address.
            </label>

            {!billingSameAsService && (
              <div className="mt-4">
                <FormField label="Billing Address">
                  <input
                    autoComplete="street-address"
                    className={`input w-full ${billingAddressError ? "border-red-300 bg-red-50" : ""}`}
                    placeholder="Enter your billing address"
                    value={billingAddress}
                    onChange={(e) => {
                      onChangeBillingAddress(e.target.value);
                      if (submitted) setBillingAddressError(null);
                    }}
                  />
                  {billingAddressError && (
                    <p className="mt-1 text-xs text-red-600">{billingAddressError}</p>
                  )}
                </FormField>
              </div>
            )}
          </div>
        </div>
      </SectionPanel>
      <BarActions
        onBack={onBack}
        onNext={() => {
          setSubmitted(true);
          if (validate()) onNext();
        }}
        nextDisabled={false}
      />
    </ModalShell>
  );
}

// Business Customer Details Component
function CustomerDetailsBusiness({
  onNext,
  onBack,
  onClose,
  businessName,
  businessType,
  abn,
  acn,
  primaryFirstName,
  primaryLastName,
  primaryEmail,
  primaryPhone,
  password,
  authorizedContacts,
  onChangeBusinessName,
  onChangeBusinessType,
  onChangeAbn,
  onChangeAcn,
  onChangePrimaryFirstName,
  onChangePrimaryLastName,
  onChangePrimaryEmail,
  onChangePrimaryPhone,
  onChangePassword,
  onAddAuthorizedContact,
  onRemoveAuthorizedContact,
  onUpdateAuthorizedContact,
}: any) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [businessNameError, setBusinessNameError] = useState<string | null>(null);
  const [abnError, setAbnError] = useState<string | null>(null);
  const [primaryFirstNameError, setPrimaryFirstNameError] = useState<string | null>(null);
  const [primaryLastNameError, setPrimaryLastNameError] = useState<string | null>(null);
  const [primaryPhoneError, setPrimaryPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (value: string) => /^[a-zA-Z\s'-]{2,}$/.test(value.trim());
  const isValidPhone = (value: string) => {
    const digits = value.replace(/[^\d+]/g, "");
    return digits.length >= 8;
  };

  const isValidABN = (value: string) => {
    const digits = value.replace(/\s/g, "");
    return digits.length === 11 || digits.length === 9; // ABN is 11 digits, ACN is 9 digits
  };

  const validate = (): boolean => {
    const bnErr = !businessName ? "Business name is required" : null;
    const abnErr = !abn && !acn
      ? "ABN or ACN is required"
      : abn && !isValidABN(abn) && acn && !isValidABN(acn)
        ? "Please enter a valid ABN (11 digits) or ACN (9 digits)"
        : null;
    const pfnErr = !primaryFirstName
      ? "First name is required"
      : !isValidName(primaryFirstName)
        ? "Enter a valid first name"
        : null;
    const plnErr = !primaryLastName
      ? "Last name is required"
      : !isValidName(primaryLastName)
        ? "Enter a valid last name"
        : null;
    const pphErr = !primaryPhone
      ? "Phone number is required"
      : !isValidPhone(primaryPhone)
        ? "Enter a valid phone number"
        : null;
    const pwErr = !password
      ? "Password is required"
      : password.length < 6
        ? "Password must be at least 6 characters"
        : null;
    const emErr = !primaryEmail
      ? "Email is required"
      : !isValidEmail(primaryEmail)
        ? "Please enter a valid email address"
        : emailExists
          ? emailError || "Email already registered"
          : null;

    setBusinessNameError(bnErr);
    setAbnError(abnErr);
    setPrimaryFirstNameError(pfnErr);
    setPrimaryLastNameError(plnErr);
    setPrimaryPhoneError(pphErr);
    setPasswordError(pwErr);
    setEmailError(emErr);

    return !bnErr && !abnErr && !pfnErr && !plnErr && !pphErr && !pwErr && !emErr;
  };

  useEffect(() => {
    if (!primaryEmail || !isValidEmail(primaryEmail)) {
      setEmailExists(false);
      setEmailError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setEmailChecking(true);
        setEmailError(null);
        const res = await checkEmail(primaryEmail);
        setEmailExists(res.exists);
        if (res.exists) setEmailError(res.message);
      } catch (err: any) {
        setEmailError(err?.message || "Could not verify email");
      } finally {
        setEmailChecking(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [primaryEmail]);

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={4} />
      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M4 19.8c0-3.3 4-5.8 8-5.8s8 2.5 8 5.8" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="modal-h1 mt-4">Business Details</h2>
          <p className="modal-sub mt-1">Please provide business information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[860px] p-6">
          <div className="mb-6">
            <FormField label="Business Name *">
              <input
                className={`input w-full ${businessNameError ? "border-red-300 bg-red-50" : ""}`}
                value={businessName}
                onChange={(e) => {
                  onChangeBusinessName(e.target.value);
                  if (submitted) setBusinessNameError(null);
                }}
                placeholder="Enter business name"
              />
              {businessNameError && (
                <p className="mt-1 text-xs text-red-600">{businessNameError}</p>
              )}
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Business Type">
              <input
                className="input w-full"
                value={businessType}
                onChange={(e) => onChangeBusinessType(e.target.value)}
                placeholder="e.g., Pty Ltd, Sole Trader"
              />
            </FormField>
            <div>
              <FormField label="ABN (11 digits) *">
                <input
                  className={`input w-full ${abnError ? "border-red-300 bg-red-50" : ""}`}
                  value={abn}
                  onChange={(e) => {
                    onChangeAbn(e.target.value);
                    if (submitted) setAbnError(null);
                  }}
                  placeholder="Enter ABN"
                />
                {abnError && <p className="mt-1 text-xs text-red-600">{abnError}</p>}
              </FormField>
            </div>
          </div>

          <div className="mt-4">
            <FormField label="ACN (9 digits) - Optional">
              <input
                className="input w-full"
                value={acn}
                onChange={(e) => onChangeAcn(e.target.value)}
                placeholder="Enter ACN if applicable"
              />
            </FormField>
          </div>

          <div className="mt-6 border-t border-[#E9E3F2] pt-6">
            <h3 className="text-[16px] font-semibold text-[#2E2745] mb-4">Primary Contact</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="First Name *">
                <input
                  className={`input w-full ${primaryFirstNameError ? "border-red-300 bg-red-50" : ""}`}
                  value={primaryFirstName}
                  onChange={(e) => {
                    onChangePrimaryFirstName(e.target.value);
                    if (submitted) setPrimaryFirstNameError(null);
                  }}
                />
                {primaryFirstNameError && (
                  <p className="mt-1 text-xs text-red-600">{primaryFirstNameError}</p>
                )}
              </FormField>
              <FormField label="Last Name *">
                <input
                  className={`input w-full ${primaryLastNameError ? "border-red-300 bg-red-50" : ""}`}
                  value={primaryLastName}
                  onChange={(e) => {
                    onChangePrimaryLastName(e.target.value);
                    if (submitted) setPrimaryLastNameError(null);
                  }}
                />
                {primaryLastNameError && (
                  <p className="mt-1 text-xs text-red-600">{primaryLastNameError}</p>
                )}
              </FormField>
            </div>
            <div className="mt-4">
              <FormField label="Business Email *">
                <input
                  type="email"
                  className={`input w-full ${emailError || emailExists || (primaryEmail && !isValidEmail(primaryEmail))
                      ? "border-red-300 bg-red-50"
                      : primaryEmail && isValidEmail(primaryEmail) && !emailChecking
                        ? "border-green-300 bg-green-50"
                        : ""
                    }`}
                  value={primaryEmail}
                  onChange={(e) => {
                    onChangePrimaryEmail(e.target.value);
                    if (submitted) setEmailError(null);
                  }}
                />
                {emailChecking && <p className="mt-1 text-xs text-gray-500">Checking availability...</p>}
                {emailError && !emailChecking && (
                  <p className="mt-1 text-xs text-red-600">{emailError}</p>
                )}
                {!emailError && primaryEmail && isValidEmail(primaryEmail) && !emailExists && !emailChecking && (
                  <p className="mt-1 text-xs text-green-600">Email is available</p>
                )}
              </FormField>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField label="Business Phone *">
                <input
                  type="tel"
                  className={`input w-full ${primaryPhoneError ? "border-red-300 bg-red-50" : ""}`}
                  value={primaryPhone}
                  onChange={(e) => {
                    onChangePrimaryPhone(e.target.value);
                    if (submitted) setPrimaryPhoneError(null);
                  }}
                />
                {primaryPhoneError && (
                  <p className="mt-1 text-xs text-red-600">{primaryPhoneError}</p>
                )}
              </FormField>
              <FormField label="Account Password *">
                <input
                  type="password"
                  className={`input w-full ${passwordError ? "border-red-300 bg-red-50" : ""}`}
                  value={password}
                  onChange={(e) => {
                    onChangePassword(e.target.value);
                    if (submitted) setPasswordError(null);
                  }}
                />
                {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
              </FormField>
            </div>
          </div>

          <div className="mt-6 border-t border-[#E9E3F2] pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-[#2E2745]">
                Authorized Contacts (up to 3)
              </h3>
              {authorizedContacts.length < 3 && (
                <button
                  type="button"
                  onClick={onAddAuthorizedContact}
                  className="text-[14px] text-[#401B60] hover:underline"
                >
                  + Add Contact
                </button>
              )}
            </div>

            {authorizedContacts.map((contact: AuthorizedContact, index: number) => (
              <div key={index} className="mb-4 rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[14px] font-semibold text-[#2E2745]">
                    Contact {index + 1}
                  </span>
                  {authorizedContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveAuthorizedContact(index)}
                      className="text-[12px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="First Name">
                    <input
                      className="input w-full"
                      value={contact.firstName}
                      onChange={(e) =>
                        onUpdateAuthorizedContact(index, "firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <input
                      className="input w-full"
                      value={contact.lastName}
                      onChange={(e) =>
                        onUpdateAuthorizedContact(index, "lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionPanel>
      <BarActions
        onBack={onBack}
        onNext={() => {
          setSubmitted(true);
          if (validate()) onNext();
        }}
        nextDisabled={false}
      />
    </ModalShell>
  );
}

