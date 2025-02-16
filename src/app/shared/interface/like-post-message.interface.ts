export interface LikePostMessage {
  id: string;
  createdAt: Date;
  postId: string;
  awaitLikePostMessage?: boolean;
  mustVideoWatch?: boolean;
  message?: string;
}
