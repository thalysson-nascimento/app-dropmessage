export interface DataConnectChatMessage {
  mathId: string;
  name: string;
  avatar: string;
  userLocation: {
    stateCode: string;
    city: string;
  };
}
