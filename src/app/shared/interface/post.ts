// export interface Post {
//   id: string;
//   image: string;
//   typeExpirationTimer: string;
//   expirationTimer: string;
//   user: {
//     name: string;
//     avatar: string;
//     city?: string;
//     stateCode?: string;
//   };
// }

// export interface PostList {
//   currentPage: number;
//   totalPages: number;
//   perPage: number;
//   totalItems: number;
//   data: Post[];
// }
// export interface Post {
//   id: string;
//   image: string;
//   expirationTimer: string;
//   preferences?: string;
//   typeExpirationTimer: string;
//   user: {
//     UserLocation: {
//       city: string;
//       stateCode: string;
//     };
//     name: string;
//     avatar: {
//       image: string;
//     };
//   };
// }

// export interface PostList {
//   currentPage: number;
//   totalPages: number;
//   perPage: number;
//   totalItems: number;
//   interests?: string;
//   noMatchesResponse?: {
//     id: string;
//     typeExpirationTimer: string;
//   };
//   data: Post[];
// }
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

export interface PostList {
  page: number;
  totalPages: number;
  totalItems: number;
  interests: string;
  items: FeedPostCard[];
}

export interface FeedEmptyResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  interests: string;
  type: 'AI_SUGGESTION';
  posts: [];
}

export type FeedApiResponse = PostList | FeedEmptyResponse;
