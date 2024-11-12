export interface UserPostMessage {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  userPostMessages: UserPostMessageElement[];
}

export interface UserPostMessageElement {
  id: string;
  image: string;
  createdAt: Date;
  typeExpirationTimer: string;
  isExpired: boolean;
  totalLikes: number;
}
