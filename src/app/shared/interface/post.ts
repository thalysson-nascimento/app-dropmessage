export interface Post {
  id: string;
  path: string;
  name: string;
}

export interface PostList {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  data: Post[];
}
