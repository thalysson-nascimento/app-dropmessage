export interface MyProfile {
  name: string;
  email: string;
  UserLocation: UserLocation;
  About: About;
}

export interface About {
  dateOfBirth: string;
  gender: string;
  interests: string;
}

export interface UserLocation {
  state: string;
  stateCode: string;
  city: string;
}
