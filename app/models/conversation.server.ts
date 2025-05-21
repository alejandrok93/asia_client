// app/models/conversation.server.ts
import { createApiClient, handleApiError } from '~/utils/api.server';
import type { Conversation } from '~/types';

export async function getConversations(token: string): Promise<Conversation[]> {
  try {
    console.log('getConversations()')
    console.log('token', token)
    const api = createApiClient(token);
    console.log(api)
    const response = await api.get('/conversations');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getConversation(token: string, id: number): Promise<Conversation> {
  try {
    const api = createApiClient(token);
    const response = await api.get(`/conversations/${id}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createConversation(
  token: string,
  data: Pick<Conversation, 'title'>
): Promise<Conversation> {
  try {
    const api = createApiClient(token);
    const response = await api.post('/conversations', { conversation: data });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateConversation(
  token: string,
  id: number,
  data: Partial<Conversation>
): Promise<Conversation> {
  try {
    const api = createApiClient(token);
    const response = await api.put(`/conversations/${id}`, { conversation: data });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteConversation(token: string, id: number): Promise<void> {
  try {
    const api = createApiClient(token);
    await api.delete(`/conversations/${id}`);
  } catch (error) {
    handleApiError(error);
  }
}

export async function sendMessage(
  token: string,
  conversationId: number,
  message: string
): Promise<void> {
  try {
    console.log('token', token)
    console.log('sendMessage()')
    console.log('conversationId', conversationId)
    const api = createApiClient(token);
    await api.post(`/conversations/${conversationId}/messages`, { message });
  } catch (error) {
    handleApiError(error);
  }
}
