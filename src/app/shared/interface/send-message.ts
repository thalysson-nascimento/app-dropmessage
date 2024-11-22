export interface SendMessage {
  matchId: string;
  userHashPublic: string;
  content: string;
}
export interface ResponseSuccessSendMessage {
  createdAt: Date;
  content: string;
  match: Match;
}

export interface Match {
  id: string;
  initiator: Initiator;
  recipient: Initiator;
}

export interface Initiator {
  userHashPublic: string;
}
