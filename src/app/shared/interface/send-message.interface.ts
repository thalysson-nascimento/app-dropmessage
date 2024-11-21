export interface SendMessage {
  pagination: Pagination;
  messages: Message[];
}

export interface Message {
  id: string;
  createdAt: Date;
  content: string;
  user: User;
}

export interface User {
  userHashPublic: string;
  name: string;
  avatar: Avatar;
}

export interface Avatar {
  image: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalMessages: number;
  totalPages: number;
}
