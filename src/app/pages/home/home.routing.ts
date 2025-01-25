import { Routes } from '@angular/router';
import { AuthHomeGuard } from '../../shared/guard/auth-home/auth-home.guard';
import { VerifyUserPermissionResolver } from '../../shared/resolver/verify-user-permission/verify-user-permission.resolver';

export const HomeRouting: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
    canActivate: [AuthHomeGuard],
    children: [
      {
        path: '',
        redirectTo: 'post-messages',
        pathMatch: 'full',
      },
      {
        path: 'post-messages',
        resolve: {
          verify: VerifyUserPermissionResolver,
        },
        loadComponent: () =>
          import('./post-messages/post-messages.component').then(
            (m) => m.PostMessagesComponent
          ),
      },
      {
        path: 'take-picture-shared-message',
        loadComponent: () =>
          import(
            './take-picture-shared-message/take-picture-shared-message.component'
          ).then((m) => m.TakePictureSharedMessageComponent),
      },
      {
        path: 'send-message-success',
        loadComponent: () =>
          import('./send-message-success/send-message-success.component').then(
            (m) => m.SendMessageSuccessComponent
          ),
      },
      {
        path: 'match-notification',
        loadComponent: () =>
          import('./match/match.component').then((m) => m.MatchComponent),
      },
      {
        path: 'create-avatar',
        loadComponent: () =>
          import('./create-avatar/create-avatar.component').then(
            (m) => m.CreateAvatarComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'user-location',
        loadComponent: () =>
          import('./user-location/user-location.component').then(
            (m) => m.UserLocationComponent
          ),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('./notification/notification.component').then(
            (m) => m.NotificationComponent
          ),
      },
      {
        path: 'privacy-police',
        loadComponent: () =>
          import('./privacy-police/privacy-police.component').then(
            (m) => m.PrivacyPoliceComponent
          ),
      },
      {
        path: 'user-post-message',
        loadComponent: () =>
          import('./user-post-message/user-post-message.component').then(
            (m) => m.UserPostMessageComponent
          ),
      },
      {
        path: 'user-data',
        loadComponent: () =>
          import('./user-data/user-data.component').then(
            (m) => m.UserDataComponent
          ),
      },
      {
        path: 'list-chat',
        loadComponent: () =>
          import('./list-chat/list-chat.component').then(
            (m) => m.ListChatComponent
          ),
      },
      {
        path: 'chat-message',
        loadComponent: () =>
          import('./chat-message/chat-message.component').then(
            (m) => m.ChatMessageComponent
          ),
      },
      {
        path: 'admob-video-reward',
        loadComponent: () =>
          import(
            './post-messages/admob-video-reward/admob-video-reward.component'
          ).then((m) => m.AdmobVideoRewardComponent),
      },
      {
        path: 'verify-token-email',
        loadComponent: () =>
          import('./verify-token-email/verify-token-email.component').then(
            (m) => m.VerifyTokenEmailComponent
          ),
      },
      {
        path: 'user-description',
        loadComponent: () =>
          import('./user-description/user-description.component').then(
            (m) => m.UserDescriptionComponent
          ),
      },
      {
        path: 'plan-active-signature',
        loadComponent: () =>
          import(
            './plan-active-signature/plan-active-signature.component'
          ).then((m) => m.PlanActiveSignatureComponent),
      },
      {
        path: 'list-subscription',
        loadComponent: () =>
          import('./list-subscription/list-subscription.component').then(
            (m) => m.ListSubscriptionComponent
          ),
      },
      {
        path: 'checkout-payment',
        loadComponent: () =>
          import('./checkout-payment/checkout-payment.component').then(
            (m) => m.CheckoutPaymentComponent
          ),
      },
    ],
  },
];
