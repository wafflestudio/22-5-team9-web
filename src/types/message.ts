export interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  creation_date: string;
  read?: boolean;
}

export interface NewMessageRequest {
  receiver_id: number;
  text: string;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface Conversation {
  userId: number;
  username: string;
  profileImage: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface ConversationParticipant {
  user_id: number;
  username: string;
  profile_image: string;
}

// Type guard for Message interface
export function isMessage(obj: unknown): obj is Message {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message_id' in obj &&
    'sender_id' in obj &&
    'receiver_id' in obj &&
    'text' in obj &&
    'creation_date' in obj
  );
}

// Type guard for MessageResponse
export function isMessageResponse(obj: unknown): obj is MessageResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    (('message' in obj && isMessage(obj.message)) || 'error' in obj)
  );
}

export function processMessagesIntoConversations(
  sent: Message[],
  received: Message[],
  currentUserId: number
): Conversation[] {
	console.log('Raw sent messages:', sent);
	console.log('Raw received messages:', received);
  const allMessages = [...sent, ...received].sort(
    (a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
  );
  
  const conversations = new Map<number, Conversation>();
  
  allMessages.forEach(msg => {
    const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
    
    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, {
        userId: partnerId,
        username: `User ${partnerId}`, // Will be updated with real data
        profileImage: '', // Will be updated with real data
        lastMessage: msg,
        unreadCount: 0
      });
    }
    
    const conversation = conversations.get(partnerId);
    if ((conversation != null) && msg.receiver_id === currentUserId && !(msg.read ?? false)) {
      conversation.unreadCount += 1;
    }
  });
  
  return Array.from(conversations.values());
}