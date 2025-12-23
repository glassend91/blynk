import apiClient from '../apiClient';

export interface PaymentMethod {
    id: string;
    _id: string;
    type: 'card' | 'bank_account';
    isDefault: boolean;
    billingDetails: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        };
    };
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
        funding: string;
        country: string;
    };
    bankAccount?: {
        bankName: string;
        last4: string;
        routingNumber: string;
        accountType: string;
        country: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface AutoPaySettings {
    autoPayEnabled: boolean;
    emailNotifications: boolean;
    billingNotifications: boolean;
}

export interface SetupIntentResponse {
    clientSecret: string;
    id: string;
}

export interface CreatePaymentMethodRequest {
    paymentMethodId: string;
    billingDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        };
    };
}

export interface UpdatePaymentMethodRequest {
    billingDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        };
    };
}

export interface UpdateAutoPaySettingsRequest {
    autoPayEnabled?: boolean;
    emailNotifications?: boolean;
    billingNotifications?: boolean;
}

// Create setup intent for adding payment methods
export const createSetupIntent = async (): Promise<SetupIntentResponse> => {
    try {
        const response = await apiClient.post('/payment-methods/setup-intent');
        return response.data;
    } catch (error) {
        console.error('Error creating setup intent:', error);
        throw error;
    }
};

// Create a new payment method
export const createPaymentMethod = async (data: CreatePaymentMethodRequest): Promise<{ message: string; paymentMethod: PaymentMethod }> => {
    try {
        const response = await apiClient.post('/payment-methods', data);
        return response.data;
    } catch (error) {
        console.error('Error creating payment method:', error);
        throw error;
    }
};

// Get all payment methods for the authenticated user
export const getPaymentMethods = async (): Promise<{ paymentMethods: PaymentMethod[] }> => {
    try {
        const response = await apiClient.get('/payment-methods');
        console.log('API response for payment methods:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }
};

// Get default payment method
export const getDefaultPaymentMethod = async (): Promise<{ paymentMethod: PaymentMethod }> => {
    try {
        const response = await apiClient.get('/payment-methods/default');
        return response.data;
    } catch (error) {
        console.error('Error fetching default payment method:', error);
        throw error;
    }
};

// Set default payment method
export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<{ message: string; paymentMethod: PaymentMethod }> => {
    try {
        console.log('API call to set default payment method:', `/payment-methods/${paymentMethodId}/default`);
        const response = await apiClient.put(`/payment-methods/${paymentMethodId}/default`);
        return response.data;
    } catch (error) {
        console.error('Error setting default payment method:', error);
        throw error;
    }
};

// Update payment method billing details
export const updatePaymentMethod = async (paymentMethodId: string, data: UpdatePaymentMethodRequest): Promise<{ message: string; paymentMethod: PaymentMethod }> => {
    try {
        const response = await apiClient.put(`/payment-methods/${paymentMethodId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating payment method:', error);
        throw error;
    }
};

// Delete payment method
export const deletePaymentMethod = async (paymentMethodId: string): Promise<{ message: string }> => {
    try {
        const response = await apiClient.delete(`/payment-methods/${paymentMethodId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting payment method:', error);
        throw error;
    }
};

// Get auto-pay settings
export const getAutoPaySettings = async (): Promise<AutoPaySettings> => {
    try {
        const response = await apiClient.get('/payment-methods/auto-pay/settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching auto-pay settings:', error);
        throw error;
    }
};

// Update auto-pay settings
export const updateAutoPaySettings = async (data: UpdateAutoPaySettingsRequest): Promise<{ message: string; settings: AutoPaySettings }> => {
    try {
        const response = await apiClient.put('/payment-methods/auto-pay/settings', data);
        return response.data;
    } catch (error) {
        console.error('Error updating auto-pay settings:', error);
        throw error;
    }
};

// Admin functions for managing customer payment methods
export interface AdminPaymentMethodsResponse {
    success: boolean;
    data?: { paymentMethods: PaymentMethod[] };
    message?: string;
}

// Get payment methods for a specific customer (Admin)
export const getCustomerPaymentMethods = async (customerId: string): Promise<AdminPaymentMethodsResponse> => {
    try {
        const response = await apiClient.get(`/v1/customer/${customerId}/payment-methods`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer payment methods:', error);
        throw error;
    }
};

// Create setup intent for a specific customer (Admin)
export const createCustomerSetupIntent = async (customerId: string): Promise<SetupIntentResponse> => {
    try {
        const response = await apiClient.post(`/v1/customer/${customerId}/payment-methods/setup-intent`);
        return response.data;
    } catch (error) {
        console.error('Error creating customer setup intent:', error);
        throw error;
    }
};

// Add payment method for a specific customer (Admin)
export const createCustomerPaymentMethod = async (
    customerId: string,
    data: CreatePaymentMethodRequest
): Promise<{ success: boolean; message: string; data?: { paymentMethod: PaymentMethod } }> => {
    try {
        const response = await apiClient.post(`/v1/customer/${customerId}/payment-methods`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating customer payment method:', error);
        throw error;
    }
};

// Set default payment method for a specific customer (Admin)
export const setCustomerDefaultPaymentMethod = async (
    customerId: string,
    paymentMethodId: string
): Promise<{ success: boolean; message: string; data?: { paymentMethod: PaymentMethod } }> => {
    try {
        const response = await apiClient.put(`/v1/customer/${customerId}/payment-methods/${paymentMethodId}/default`);
        return response.data;
    } catch (error) {
        console.error('Error setting customer default payment method:', error);
        throw error;
    }
};

// Delete payment method for a specific customer (Admin)
export const deleteCustomerPaymentMethod = async (
    customerId: string,
    paymentMethodId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await apiClient.delete(`/v1/customer/${customerId}/payment-methods/${paymentMethodId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting customer payment method:', error);
        throw error;
    }
};