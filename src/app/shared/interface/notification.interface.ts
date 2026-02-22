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

export interface NotificationActor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface NotificationTarget {
  id: string;
  thumbnailUrl?: string;
  type: 'photo' | 'video' | 'post';
}

export interface NotificationActionMeta {
  commentText?: string;
  totalCount?: number; // para multi like
  isFollowing?: boolean; // botão seguir
}

export interface NotificationModel {
  id: string;
  type: NotificationType;
  actors: NotificationActor[];
  target?: NotificationTarget;
  meta?: NotificationActionMeta;
  createdAt: Date;
  isRead: boolean;
  match: boolean;
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  SHARE = 'SHARE',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
}

export type NotificationFilter =
  | 'ALL'
  | 'LIKES'
  | 'COMMENTS'
  | 'MENTIONS'
  | 'FOLLOWS'
  | 'SHARES';
