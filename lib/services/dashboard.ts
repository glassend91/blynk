import apiClient from '../apiClient';

export async function getDashboardOverview(): Promise<{ success: boolean; data?: any }> {
    const { data } = await apiClient.get('/dashboard/me');
    return data;
}

export default getDashboardOverview;
