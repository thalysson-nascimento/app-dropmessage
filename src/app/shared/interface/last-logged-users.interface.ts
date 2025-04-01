export interface LastLoggedUsers {
  isUserFirsPublication: boolean;
  gender: string;
  data: Users[];
}

export interface Users {
  id: string;
  name: string;
  avatar: string;
  age: number;
  country: string;
}
