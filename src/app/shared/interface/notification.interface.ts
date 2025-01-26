export interface Notification {
  id: string;
  createdAt: Date;
  user: User;
  post?: Post;
}

export interface Post {
  id: string;
  createdAt: Date;
  image: string;
}

export interface User {
  name: string;
  avatar: string;
}
