export interface MatchUsers {
  id?: string;
  matchId: string;
  name: string;
  UserLocation: UserLocation;
  avatar: {
    image: string;
  };
}

export interface UserLocation {
  state: string;
  stateCode: string;
  city: string;
}
