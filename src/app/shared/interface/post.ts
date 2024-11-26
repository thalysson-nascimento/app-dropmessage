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
export interface Post {
  id: string;
  image: string;
  expirationTimer: string;
  typeExpirationTimer: string;
  user: {
    UserLocation: {
      city: string;
      stateCode: string;
    };
    name: string;
    avatar: {
      image: string;
    };
  };
}

export interface PostList {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  data: Post[];
}
