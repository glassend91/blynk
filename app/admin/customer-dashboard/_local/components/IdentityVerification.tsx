"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type Props = {
    customerId?: string;
    customerEmail?: string;
    customerPhone?: string;
    onVerificationComplete?: (success: boolean, channel: string) => void;
    onCustomerDataLoaded?: (email: string, phone: string) => void;
};

export default function IdentityVerification({
    customerId,
    customerEmail,
    customerPhone,
    onVerificationComplete,
    onCustomerDataLoaded,
}: Props) {
    const [email, setEmail] = useState(customerEmail || "");
    const [phone, setPhone] = useState(customerPhone || "");

    // Fetch customer data if only ID is provided
    useEffect(() => {
        if (customerId && !customerEmail && !customerPhone) {
            const fetchCustomerData = async () => {
                try {
                    const { data } = await apiClient.get<{ success: boolean; user?: any; customer?: any }>(
                        `/auth/users/${customerId}`
                    );
                    const customerData = data?.user || data?.customer;
                    if (customerData) {
                        const customerEmail = customerData.email || "";
                        const customerPhone = customerData.phone || "";
                        setEmail(customerEmail);
                        setPhone(customerPhone);
                        onCustomerDataLoaded?.(customerEmail, customerPhone);
                    }
                } catch (err) {
                    console.error("Failed to fetch customer data:", err);
                }
            };
            fetchCustomerData();
        } else if (customerEmail || customerPhone) {
            setEmail(customerEmail || "");
            setPhone(customerPhone || "");
        }
    }, [customerId, customerEmail, customerPhone, onCustomerDataLoaded]);

    const [channel, setChannel] = useState<"mobile" | "email">("mobile");
    const [otpCode, setOtpCode] = useState("");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0); // Timer in seconds (2 minutes = 120 seconds)

    // Countdown timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [resendTimer]);

    if (!customerId || (!email && !phone)) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Identity Verification</h2>
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6F6C90]">
                        Select a customer to verify their identity
                    </p>
                </div>
            </div>
        );
    }

    const handleSendCode = async () => {
        if (!customerId) return;

        // Show alert if mobile channel is selected
        if (channel === "mobile") {
            setError("This is coming soon. Try with email.");
            return;
        }

        // For email channel, use the correct API endpoint and payload
        if (!email) {
            setError("Email address is required");
            return;
        }

        try {
            setSending(true);
            setError(null);
            setOtpSent(false);
            setVerified(false);

            const endpoint = "/customer-verification/send-otp";
            const payload = {
                emailOrPhone: email,
                channel: "email",
                purpose: "customer_verification"
            };

            const { data } = await apiClient.post<{ success: boolean; message?: string }>(endpoint, payload);

            if (data?.success) {
                setOtpSent(true);
                setError(null);
                setResendTimer(120); // Start 2-minute countdown timer
            } else {
                setError(data?.message || "Failed to send OTP");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to send OTP");
        } finally {
            setSending(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!customerId || !otpCode.trim()) return;

        // For email channel, we need to send emailOrPhone
        if (channel === "email" && !email) {
            setError("Email address is required for verification");
            return;
        }

        try {
            setVerifying(true);
            setError(null);

            const { data } = await apiClient.post<{ success: boolean; message?: string }>(
                "/customer-verification/verify-otp",
                {
                    emailOrPhone: channel === "email" ? email : phone,
                    otpCode: otpCode.trim(),
                }
            );

            if (data?.success) {
                setVerified(true);
                setError(null);
                onVerificationComplete?.(true, channel);

                // Auto-log to notes
                try {
                    await apiClient.post("/customer-verification/notes", {
                        customerId,
                        noteType: "Verification",
                        priority: "Normal",
                        content: `Identity verification ${channel === "mobile" ? "via SMS" : "via Email"} successful.`,
                        tags: ["verification", "otp"],
                    });
                } catch (noteErr) {
                    console.error("Failed to log verification to notes:", noteErr);
                }
            } else {
                setError(data?.message || "Invalid verification code");
                onVerificationComplete?.(false, channel);

                // Auto-log failure to notes
                try {
                    await apiClient.post("/customer-verification/notes", {
                        customerId,
                        noteType: "Verification",
                        priority: "High",
                        content: `Identity verification ${channel === "mobile" ? "via SMS" : "via Email"} failed.`,
                        tags: ["verification", "otp", "failed"],
                    });
                } catch (noteErr) {
                    console.error("Failed to log verification failure to notes:", noteErr);
                }
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to verify code");
            onVerificationComplete?.(false, channel);
        } finally {
            setVerifying(false);
        }
    };

    const maskedPhone = phone
        ? phone.length > 6
            ? `${phone.slice(0, 3)}${"*".repeat(Math.max(0, phone.length - 6))}${phone.slice(-3)}`
            : phone.length > 3
                ? `${phone.slice(0, 2)}${"*".repeat(phone.length - 2)}`
                : "***"
        : "N/A";

    const maskedEmail = email
        ? email.includes("@")
            ? `${email.slice(0, 1)}${"*".repeat(Math.max(0, email.indexOf("@") - 2))}${email.slice(email.indexOf("@"))}`
            : `${email.slice(0, 1)}${"*".repeat(Math.max(0, email.length - 1))}`
        : "N/A";

    return (
        <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
            <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Identity Verification</h2>

            {error && (
                <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            {verified && (
                <div className="mb-4 rounded-[10px] border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="2" />
                        <path d="M9 12l2 2 4-4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[14px] font-semibold text-green-700">Verified</span>
                </div>
            )}

            <div className="space-y-4">
                {/* Channel Selector */}
                <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
                        OTP Destination *
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#DFDBE3] cursor-pointer hover:bg-[#F8F8F8]">
                            <input
                                type="radio"
                                name="otpChannel"
                                value="mobile"
                                checked={channel === "mobile"}
                                onChange={() => {
                                    setChannel("mobile");
                                    setOtpSent(false);
                                    setVerified(false);
                                    setOtpCode("");
                                    setResendTimer(0);
                                }}
                                className="h-4 w-4 accent-[#401B60]"
                            />
                            <div className="flex-1">
                                <div className="text-[14px] font-medium text-[#0A0A0A]">
                                    Registered Mobile Number
                                </div>
                                <div className="text-[12px] text-[#6F6C90]">{maskedPhone}</div>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#DFDBE3] cursor-pointer hover:bg-[#F8F8F8]">
                            <input
                                type="radio"
                                name="otpChannel"
                                value="email"
                                checked={channel === "email"}
                                onChange={() => {
                                    setChannel("email");
                                    setOtpSent(false);
                                    setVerified(false);
                                    setOtpCode("");
                                    setResendTimer(0);
                                }}
                                className="h-4 w-4 accent-[#401B60]"
                            />
                            <div className="flex-1">
                                <div className="text-[14px] font-medium text-[#0A0A0A]">
                                    Registered Email Address
                                </div>
                                <div className="text-[12px] text-[#6F6C90]">{maskedEmail}</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Send Code Button */}
                <button
                    onClick={handleSendCode}
                    disabled={sending || verified || resendTimer > 0}
                    className="w-full rounded-[10px] bg-[#401B60] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {sending
                        ? "Sending..."
                        : resendTimer > 0
                            ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')}`
                            : "Send Code"
                    }
                </button>

                {otpSent && !verified && (
                    <>
                        {/* Verify Code Input */}
                        <div>
                            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="Enter 6-digit code"
                                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60]"
                                maxLength={6}
                            />
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyCode}
                            disabled={verifying || !otpCode.trim() || otpCode.length !== 6}
                            className="w-full rounded-[10px] bg-[#401B60] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {verifying ? "Verifying..." : "Verify Code"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

