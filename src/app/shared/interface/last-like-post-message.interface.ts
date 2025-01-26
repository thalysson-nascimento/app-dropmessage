export interface LastLikePostMessage {
  praseLikePostMessage: string;
  countLike: string;
  lastLikePostMessage: LastLikePostMessageClass;
}

export interface LastLikePostMessageClass {
  user: User;
}

export interface User {
  name: string;
  avatar: Avatar;
}

export interface Avatar {
  image: string;
}
