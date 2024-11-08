export interface AvatarSuccess {
  image: string;
  createdAt: Date;
  user: User;
}

export interface User {
  name: string;
  email: string;
}

export interface Avatar {
  file: Blob;
  dateOfBirth: string;
  gender: string;
  interests: string;
}
