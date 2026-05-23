// export interface LikePostMessage {
//   id: string;
//   createdAt: Date;
//   postId: string;
//   awaitLikePostMessage?: boolean;
//   mustVideoWatch?: boolean;
//   message?: string;
// }

export interface LikePostMessage {
  awaitLikePostMessage: boolean;
  message: string;
  mustVideoWatch: boolean;
  type: string[];
}
