export interface AIProfileInterface {
  slug: string;
  name: string;
  height: number;
  zodiac: string;
  description: string;
  bio: string;
  age: number;

  country: string;
  city: string | null;

  avatarUrl: string;

  personality: string;
  style: string;

  traits: AITraitInterface[];
  interests: AIHobbyInterface[];
  lifestyles: AIHobbyInterface[];
}

export interface AITraitInterface {
  key: string;
  name: string;
}

export interface AIHobbyInterface {
  key: string;
  icon: string;
  name: string;
}
