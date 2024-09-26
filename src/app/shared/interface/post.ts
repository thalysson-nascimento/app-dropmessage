export interface Post {
  id: string;
  path: string;
  name: string;
}

export interface PostList {
  posts: Post[];
}
