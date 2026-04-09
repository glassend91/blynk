import apiClient from "../apiClient";

export interface BillingSummary {
  currentBalance: number;
  nextBillingDate: string;
  monthlyAmount: number;
  recentInvoices: Invoice[];
  billingAccount: {
    status: string;
    autoPayEnabled: boolean;
    creditLimit: number;
  };
}

export interface Invoice {
  id: string;
  _id?: string;
  invoiceNumber: string;
  customerId: string;
  type?: "invoice" | "payment";
  billingPeriod?: {
    startDate: string;
    endDate: string;
  };
  dueDate: string;
  status: string; // Made status more flexible for Stripe statuses like 'succeeded' or 'open'
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    serviceId?: string;
    subscriptionId?: string;
  }>;
  paymentMethod?: {
    _id: string;
    type: string;
    last4?: string;
  };
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentMonthCharges {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    serviceId?: string;
    subscriptionId?: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
}

export interface BillingAccount {
  _id: string;
  customerId: string;
  currentBalance: number;
  creditLimit: number;
  billingCycle: "monthly" | "quarterly" | "annually";
  nextBillingDate: string;
  autoPayEnabled: boolean;
  defaultPaymentMethod?: string;
  billingAddress: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    billingNotifications: boolean;
    paymentReminders: boolean;
  };
  paymentTerms: number;
  currency: string;
  taxRate: number;
  status: "active" | "suspended" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get billing summary for dashboard
export const getBillingSummary = async (): Promise<BillingSummary> => {
  try {
    const response = await apiClient.get("/billing/summary");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching billing summary:", error);
    throw error;
  }
};

// Get all invoices with pagination and filtering
export const getInvoices = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  month?: number;
}): Promise<InvoicesResponse> => {
  try {
    const response = await apiClient.get("/billing/invoices", { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  try {
    const response = await apiClient.get(`/billing/invoices/${invoiceId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

// Download invoice PDF
export const downloadInvoice = async (
  invoiceId: string,
): Promise<{ downloadUrl: string }> => {
  try {
    const response = await apiClient.get(
      `/billing/invoices/${invoiceId}/download`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    throw error;
  }
};

// Get current month charges breakdown
export const getCurrentMonthCharges =
  async (): Promise<CurrentMonthCharges> => {
    try {
      const response = await apiClient.get("/billing/current-month-charges");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching current month charges:", error);
      throw error;
    }
  };

// Get billing account details
export const getBillingAccount = async (): Promise<BillingAccount> => {
  try {
    const response = await apiClient.get("/billing/account");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching billing account:", error);
    throw error;
  }
};

// Update billing account settings
export const updateBillingSettings = async (data: {
  autoPayEnabled?: boolean;
  billingCycle?: "monthly" | "quarterly" | "annually";
  notificationSettings?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    billingNotifications?: boolean;
    paymentReminders?: boolean;
  };
  billingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}): Promise<BillingAccount> => {
  try {
    const response = await apiClient.put("/billing/account", data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating billing settings:", error);
    throw error;
  }
};

// Create billing account (for new users)
export const createBillingAccount = async (data: {
  billingCycle?: "monthly" | "quarterly" | "annually";
  creditLimit?: number;
  billingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}): Promise<BillingAccount> => {
  try {
    const response = await apiClient.post("/billing/account", data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating billing account:", error);
    throw error;
  }
};

export const generateInvoice = async (data: {
  billingPeriodStart: string;
  billingPeriodEnd: string;
}): Promise<Invoice> => {
  try {
    const response = await apiClient.post("/billing/invoices/generate", data);
    return response.data.data;
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw error;
  }
};

// Activate account after successful signup payment
export const activateAccount = async (
  paymentIntentId: string,
): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    const response = await apiClient.post("/auth/activate-account", {
      paymentIntentId,
    });
    return response.data;
  } catch (error) {
    console.error("Error activating account:", error);
    throw error;
  }
};
