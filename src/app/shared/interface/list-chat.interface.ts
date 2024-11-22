// export interface ListChat {
//   mathId: string;
//   name: string;
//   avatar: string;
// }

export interface ListChat {
  mathId: string;
  name: string;
  avatar: string;
  userLocation: UserLocation;
}

export interface UserLocation {
  stateCode: string;
  city: string;
}
