export interface Post {
  id: string;
  image: string;
  typeExpirationTimer: string;
  expirationTimer: string;
}

export interface PostList {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  data: Post[];
}
