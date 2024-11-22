export interface SendMessage {
  matchId: string;
  userHashPublic: string;
  content: string;
}
export interface ResponseSuccessSendMessage {
  id: string;
  createdAt: Date;
  content: string;
  user: User;
}

export interface User {
  userHashPublic: string;
  name: string;
  avatar: Avatar;
}

export interface Avatar {
  image: string;
}

export interface Match {
  id: string;
  initiator: Initiator;
  recipient: Initiator;
}

export interface Initiator {
  userHashPublic: string;
}
