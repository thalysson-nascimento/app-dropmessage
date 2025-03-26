export interface SharedPostMessage {
  firstPublicationPostMessage?: false;
  post: {
    id: string;
    image: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
      StripeSignature: {
        status: 'trialing' | 'active';
      }[];
    };
  };
}
