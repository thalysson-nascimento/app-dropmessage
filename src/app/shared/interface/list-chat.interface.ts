export interface ListChat {
  matchId: string;
  message: string;
  name: string;
  avatar: string;
  userLocation: UserLocation;
}

export interface UserLocation {
  stateCode: string;
  city: string;
}
