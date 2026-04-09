import apiClient from "../apiClient";

export interface Service {
  _id: string;
  serviceName: string;
  serviceType: "NBN" | "Business NBN" | "Mobile" | "Data Only" | "Voice Only";
  specifications: {
    downloadSpeed?: number;
    uploadSpeed?: number;
    dataAllowance?: string;
    staticIP?: boolean;
    voiceMinutes?: string;
    smsMessages?: string;
    internationalCalls?: boolean;
    coverage?: string;
    network?: string;
  };
  price: number;
  currency: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
  isActive: boolean;
  isAvailable: boolean;
  providerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  description?: string;
  features: Array<{
    name: string;
    description?: string;
    isIncluded: boolean;
  }>;
  addOns: Array<{
    _id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    isActive: boolean;
    type:
      | "static_ip"
      | "extra_data"
      | "international_calls"
      | "premium_support"
      | "other";
  }>;
  managementOptions: {
    canPortNumber: boolean;
    canOrderSIM: boolean;
    canUpgrade: boolean;
    canDowngrade: boolean;
    canCancel: boolean;
    cancellationPolicy?: string;
  };
  configuration: {
    requiresAddress: boolean;
    requiresIdentity: boolean;
    requiresCreditCheck: boolean;
    minimumContractPeriod: number;
    setupFee: number;
  };
  totalSubscriptions: number;
  activeSubscriptions: number;
  tags: string[];
  category: string;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from subscription status
  isSubscribed?: boolean;
  subscriptionStatus?: string;
  subscriptionId?: string;
}

export interface ServiceSubscription {
  _id: string;
  serviceId: Service;
  userId: string;
  subscriptionStatus:
    | "active"
    | "inactive"
    | "suspended"
    | "cancelled"
    | "pending"
    | "expired";
  assignedNumber?: string;
  assignedAddress?: {
    streetAddress?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  subscribedAt: string;
  activatedAt?: string;
  expiresAt?: string;
  cancelledAt?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "overdue";
  paymentMethodId?: string;
  nextBillingDate?: string;
  subscriptionPrice: number;
  currency: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
  selectedAddOns: Array<{
    addOnId: string;
    name: string;
    price: number;
    addedAt: string;
    isActive: boolean;
  }>;
  configuration: {
    autoPay: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    usageAlerts: boolean;
    usageThreshold: number;
  };
  usageData: {
    totalUsed: number;
    lastUsageUpdate: string;
    usageHistory: Array<{
      date: string;
      amount: number;
      type: "data" | "voice" | "sms";
      note?: string;
    }>;
  };
  managementHistory: Array<{
    action: string;
    performedBy?: string;
    performedAt: string;
    reason?: string;
    details?: any;
  }>;
  notes: Array<{
    note: string;
    addedBy?: string;
    addedAt: string;
    isInternal: boolean;
  }>;
  contractTerms: {
    minimumPeriod: number;
    cancellationFee: number;
    earlyTerminationFee: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeToServiceRequest {
  assignedAddress?: {
    streetAddress?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
  assignedNumber?: string;
  selectedAddOns?: string[];
  paymentMethodId?: string;
}

export interface UpdateSubscriptionStatusRequest {
  status: "active" | "inactive" | "suspended" | "cancelled";
  reason?: string;
}

export interface UpdateSubscriptionConfigRequest {
  configuration: {
    autoPay?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    usageAlerts?: boolean;
    usageThreshold?: number;
  };
}

export interface UpdateUsageRequest {
  amount: number;
  type: "data" | "voice" | "sms";
  note?: string;
}

// Get all available services
export const getServices = async (params?: {
  serviceType?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<{ services: Service[] }> => {
  try {
    const response = await apiClient.get("/services", { params });
    return { services: response.data };
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (
  serviceId: string,
): Promise<{ service: Service }> => {
  try {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

// Subscribe to a service
export const subscribeToService = async (
  serviceId: string,
  data: SubscribeToServiceRequest,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.post(
      `/services/${serviceId}/subscribe`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to service:", error);
    throw error;
  }
};

// Get user's subscriptions
export const getUserSubscriptions = async (
  status?: string,
): Promise<{ subscriptions: ServiceSubscription[] }> => {
  try {
    const response = await apiClient.get("/services/subscriptions/my", {
      params: status ? { status } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw error;
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (
  subscriptionId: string,
  data: UpdateSubscriptionStatusRequest,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.put(
      `/services/subscriptions/${subscriptionId}/status`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
};

// Add add-on to subscription
export const addAddOn = async (
  subscriptionId: string,
  addOnId: string,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.post(
      `/services/subscriptions/${subscriptionId}/add-ons`,
      { addOnId },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding add-on:", error);
    throw error;
  }
};

// Remove add-on from subscription
export const removeAddOn = async (
  subscriptionId: string,
  addOnId: string,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.delete(
      `/services/subscriptions/${subscriptionId}/add-ons/${addOnId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error removing add-on:", error);
    throw error;
  }
};

// Update subscription configuration
export const updateSubscriptionConfig = async (
  subscriptionId: string,
  data: UpdateSubscriptionConfigRequest,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.put(
      `/services/subscriptions/${subscriptionId}/config`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription configuration:", error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (
  subscriptionId: string,
  reason?: string,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.post(
      `/services/subscriptions/${subscriptionId}/cancel`,
      { reason },
    );
    return response.data;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
};

// Get subscription usage
export const getSubscriptionUsage = async (
  subscriptionId: string,
): Promise<{
  usage: {
    totalUsed: number;
    lastUsageUpdate: string;
    usageHistory: Array<{
      date: string;
      amount: number;
      type: "data" | "voice" | "sms";
      note?: string;
    }>;
    subscription: ServiceSubscription;
  };
}> => {
  try {
    const response = await apiClient.get(
      `/services/subscriptions/${subscriptionId}/usage`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription usage:", error);
    throw error;
  }
};

// Update subscription usage
export const updateSubscriptionUsage = async (
  subscriptionId: string,
  data: UpdateUsageRequest,
): Promise<{ message: string; subscription: ServiceSubscription }> => {
  try {
    const response = await apiClient.put(
      `/services/subscriptions/${subscriptionId}/usage`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription usage:", error);
    throw error;
  }
};
