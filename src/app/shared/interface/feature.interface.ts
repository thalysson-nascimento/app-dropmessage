export interface FeatureTranslationInterface {
  pt: string;
  en: string;
}

export interface FeatureInterface {
  id: string;
  title: FeatureTranslationInterface;
  description: FeatureTranslationInterface;
  icon: string;
  highlight?: boolean;
}
