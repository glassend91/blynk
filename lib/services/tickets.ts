import apiClient from "@/lib/apiClient";

export type TicketMessage = {
    sender: string;
    content: string;
    isFromAdmin: boolean;
    _id: string;
    attachments: any[];
    createdAt: string;
    updatedAt: string;
};

export type Customer = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type Ticket = {
    id: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    customer: Customer;
    assignedTo: any;
    messages: TicketMessage[];
    tags: string[];
    firstResponseTime: string | null;
    resolvedAt: string | null;
    closedAt: string | null;
    lastActivity: string;
    source: string;
    escalationLevel: number;
    satisfactionRating: Record<string, any>;
    createdAt: string;
    updatedAt: string;
};

export type GetTicketsResponse = {
    success: boolean;
    data: {
        tickets: Ticket[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalTickets: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
};

export type CreateTicketPayload = {
    subject: string;
    description: string;
    category: string;
    priority: string;
};

export type CreateTicketResponse = {
    success: boolean;
    data: {
        ticket: Ticket;
    };
    message?: string;
};

export async function getAllTickets(page: number = 1, limit: number = 10): Promise<GetTicketsResponse> {
    const { data } = await apiClient.get<GetTicketsResponse>(`/support-tickets?page=${page}&limit=${limit}`);
    return data;
}

export async function createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
    try {
        const { data } = await apiClient.post<CreateTicketResponse>("/support-tickets", payload);
        return data;
    } catch (error: any) {
        // Re-throw the original error with response data intact
        throw error;
    }
}

