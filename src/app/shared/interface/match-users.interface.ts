export interface MatchUsers {
  id: string;
  name: String;
  UserLocation: UserLocation;
  avatar: string;
}

export interface UserLocation {
  state: string;
  stateCode: string;
  city: string;
}
