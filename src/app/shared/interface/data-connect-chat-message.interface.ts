export interface DataConnectChatMessage {
  matchId: string;
  name: string;
  avatar: string;
  userLocation: {
    stateCode: string;
    city: string;
  };
}
