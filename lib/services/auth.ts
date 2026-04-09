import apiClient from "@/lib/apiClient";
import { setAuthToken, setAuthUser } from "../auth";

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  type?: "MBL" | "NBN" | "SME" | "MBB";
  mblSelectedNumber?: string;
  mblKeepExistingNumber?: boolean;
  mblCurrentMobileNumber?: string;
  mblCurrentProvider?: string;
  selectedPlan?: { name: string; price: number };
  customerType?: "residential" | "business";
  serviceAddress?: string;
  billingAddress?: string;
  dateOfBirth?: string;
  identity?: any;
  simType?: "eSim" | "physical";
  simNumber?: string;
  esimNotificationEmail?: string;
  locId?: string;
  ntdId?: string;
  port?: string;
  serviceRef?: string;
  wantsStaticIp?: boolean;
  businessDetails?: {
    businessName: string;
    businessAddress: string;
    businessType: string;
    ABN: string;
    ACN: string;
    primaryContact?: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    authorizedContacts?: {
      firstName: string;
      lastName: string;
    }[];
  };
};

export type SignupResponse = {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
};

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const { data } = await apiClient.post<
    SignupResponse & { token?: string; user?: any }
  >("/auth/signup", payload);

  if (data.success && data.token) {
    setAuthToken(data.token);
    if (data.user) {
      setAuthUser(data.user);
    }
  }

  return data;
}

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type LoginResponse = {
  success: boolean;
  token?: string;
  userId?: string;
  message?: string;
  requires2fa?: boolean;
  user?: any;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export type CheckEmailResponse = {
  exists: boolean;
  message: string;
};

export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  const { data } = await apiClient.post<CheckEmailResponse>(
    "/auth/check-email",
    { email },
  );
  return data;
}

export type OTPResponse = {
  success: boolean;
  message: string;
  expiresIn?: string;
};

export async function sendOtp(email: string): Promise<OTPResponse> {
  const { data } = await apiClient.post<OTPResponse>("/auth/otp/send", {
    email,
  });
  return data;
}

export async function resendOtp(email: string): Promise<OTPResponse> {
  const { data } = await apiClient.post<OTPResponse>("/auth/otp/resend", {
    email,
  });
  return data;
}

export type VerifyOTPResponse = {
  success: boolean;
  verified: boolean;
  message: string;
  user?: any;
};

export async function verifyOtp(
  email: string,
  code: string,
): Promise<VerifyOTPResponse> {
  const { data } = await apiClient.post<VerifyOTPResponse>("/auth/otp/verify", {
    email,
    code,
  });
  return data;
}

export type CurrentUserResponse = {
  user: any;
  selectedPackages?: any[];
};

/**
 * Get current user with fresh permissions from server
 */
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const { data } = await apiClient.get<CurrentUserResponse>("/auth/me");
  return data;
}
