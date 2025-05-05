
// app/models/firm.server.ts
import { createApiClient, handleApiError } from '~/utils/api.server';
import type { Firm } from '~/types';

export async function getFirms(token: string): Promise<Firm[]> {
  try {
    const api = createApiClient(token);
    const response = await api.get('/firms');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getFirm(token: string, id: number): Promise<Firm> {
  try {
    const api = createApiClient(token);
    const response = await api.get(`/firms/${id}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createFirm(
  token: string,
  data: Pick<Firm, 'name' | 'address' | 'phone' | 'industry'>
): Promise<Firm> {
  try {
    const api = createApiClient(token);
    const response = await api.post('/firms', { firm: data });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateFirm(
  token: string,
  id: number,
  data: Partial<Firm>
): Promise<Firm> {
  try {
    const api = createApiClient(token);
    const response = await api.put(`/firms/${id}`, { firm: data });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteFirm(token: string, id: number): Promise<void> {
  try {
    const api = createApiClient(token);
    await api.delete(`/firms/${id}`);
  } catch (error) {
    handleApiError(error);
  }
}
