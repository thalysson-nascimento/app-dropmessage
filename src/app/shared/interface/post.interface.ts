export interface FeedPost {
  type: string[];

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

export interface Post {
  page: number;
  totalPages: number;
  totalItems: number;
  interests: string;
  type: string[];
  items: FeedPost[];
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
