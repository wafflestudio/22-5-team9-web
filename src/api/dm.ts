import type { Message, NewMessageRequest } from '../types/message';

const API_BASE_URL = 'https://waffle-instaclone.kro.kr';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface GetConversationMessagesParams {
  recipientId: number;
  offset: number;
  limit: number;
}

export const dmApi = {
  async getMessage(messageId: number): Promise<Message> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(
      `${API_BASE_URL}/api/dm/message/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch message');
    }

    const data = (await response.json()) as Message;
    return data;
  },

  async getSentMessages(): Promise<Message[]> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/dm/sent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch sent messages');
    }

    const data = (await response.json()) as Message[];
    return data;
  },

  async getReceivedMessages(): Promise<Message[]> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/dm/received`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch received messages');
    }

    const data = (await response.json()) as Message[];
    return data;
  },

  async sendMessage(request: NewMessageRequest): Promise<Message> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/dm/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to send message');
    }

    const data = (await response.json()) as Message;
    return data;
  },

  async deleteMessage(messageId: number): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/dm/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to delete message');
    }
  },

  async markMessagesAsRead(messageIds: number[]): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (token == null) throw new Error('No access token');

    const response = await fetch(`${API_BASE_URL}/api/dm/mark-read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageIds }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to mark messages as read');
    }
  },

  async getConversationMessages({
    recipientId,
    offset,
    limit,
  }: GetConversationMessagesParams): Promise<Message[]> {
    const response = await fetch(
      `/api/messages/conversation/${recipientId}?offset=${offset}&limit=${limit}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch conversation messages');
    }
    return response.json() as Promise<Message[]>;
  },
};
