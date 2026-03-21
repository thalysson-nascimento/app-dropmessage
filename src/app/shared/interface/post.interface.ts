export type FeedPostCard =
  | FeedPost
  | FeedAISuggestion
  | FeedWatchVideo
  | FeedLikeLimit;

export interface FeedPost {
  type: 'POST';

  id: string;
  image: string;
  expirationTimer: string;
  typeExpirationTimer: string;

  user: {
    name: string;
    avatar: {
      image: string;
    };
    UserLocation: {
      city: string | null;
      stateCode: string | null;
    };
  };
}

export interface FeedAISuggestion {
  type: 'AI_SUGGESTION';
}

export interface FeedWatchVideo {
  type: 'WATCH_VIDEO';
}

export interface FeedLikeLimit {
  type: 'LIKE_LIMIT';
}

export interface Post {
  page: number;
  totalPages: number;
  totalItems: number;
  interests: string;
  type: string;
  items: FeedPostCard[];
}

export interface FeedEmptyResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  interests: string;
  type: string;
  items: [];
}

export type FeedApiResponse = Post | FeedEmptyResponse;
