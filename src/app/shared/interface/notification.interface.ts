import { DataConnectChatMessage } from './data-connect-chat-message.interface';

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

export interface GetNotificationsResponse {
  subscription: boolean;
  items: NotificationItem[];
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  subscription: boolean;
  actors: NotificationActor[];
  meta: NotificationActionMeta;
  target: NotificationTarget | null;
  createdAt: string; // ⚠️ string já formatada (ex: "há 2 horas")
  isRead: boolean;
  match: boolean;
  matchData: DataConnectChatMessage;
}

export interface NotificationActor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface NotificationTarget {
  id: string;
  type: NotificationTargetType;
  thumbnailUrl: string | null;
}

export type NotificationTargetType = 'photo' | 'video' | 'post';

export interface NotificationActionMeta {
  commentText?: string;
  totalCount?: number; // para multi like
  isFollowing?: boolean; // botão seguir
}
