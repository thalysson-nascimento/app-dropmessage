export interface ChatResponse {
  match: {
    id: string;
    otherUser: {
      userHashPublic: string;
      name: string;
      avatar: string;
      isOnline: boolean;
      lastSeen?: string;
    };
  };
  pagination: {
    page: number;
    limit: number;
    totalMessages: number;
    totalPages: number;
    hasMore: boolean;
  };
  messages: ChatMessageApi[];
}

export interface ChatMessageApi {
  id: string;
  content: string;
  createdAt: string;
  time: string;
  dateLabel: string;
  isOwnMessage: boolean;
  user: {
    userHashPublic: string;
    name: string;
    avatar: string;
  };
}
