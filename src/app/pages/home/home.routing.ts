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
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        resolve: {
          verify: VerifyUserPermissionResolver,
        },
        loadComponent: () =>
          import('./main/main.component').then((m) => m.MainComponent),
        children: [
          {
            path: '',
            redirectTo: 'post-message', // sua tela principal de cards
            pathMatch: 'full',
          },
          {
            path: 'post-message',
            loadComponent: () =>
              import('./main/post-message/post-message.component').then(
                (m) => m.PostMessageComponent
              ),
          },
          {
            path: 'chat',
            loadComponent: () =>
              import('./main/chat/chat.component').then((m) => m.ChatComponent),
          },
          {
            path: 'favorites',
            loadComponent: () =>
              import('./main/favorites/favorites.component').then(
                (m) => m.FavoritesComponent
              ),
          },
          {
            path: 'ia-profile',
            loadComponent: () =>
              import('./main/ia-profile/ia-profile.component').then(
                (m) => m.IaProfileComponent
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./main/profile/profile.component').then(
                (m) => m.ProfileComponent
              ),
          },
        ],
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
      {
        path: 'view-card-free-trial',
        loadComponent: () =>
          import('./view-card-free-trial/view-card-free-trial.component').then(
            (m) => m.ViewCardFreeTrialComponent
          ),
      },
      {
        path: 'user-welcome',
        loadComponent: () =>
          import('./user-welcome/user-welcome.component').then(
            (m) => m.UserWelcomeComponent
          ),
      },
      {
        path: 'user-first-publication-post',
        loadComponent: () =>
          import(
            './user-first-publication-post/user-first-publication-post.component'
          ).then((m) => m.UserFirstPublicationPostComponent),
      },
      {
        path: 'payment-success',
        loadComponent: () =>
          import('./payment-success/payment-success.component').then(
            (m) => m.PaymentSuccessComponent
          ),
      },
      {
        path: 'limit-like-post-message',
        loadComponent: () =>
          import(
            './limit-like-post-message/limit-like-post-message.component'
          ).then((m) => m.LimitLikePostMessageComponent),
      },
      {
        path: 'admob-video-reward-free-trial',
        loadComponent: () =>
          import(
            './view-card-free-trial/admob-video-reward/admob-video-reward.component'
          ).then((m) => m.AdmobVideoRewardCardFreeTrialComponent),
      },
      {
        path: 'app-infor',
        loadComponent: () =>
          import('./app-infor/app-infor.component').then(
            (m) => m.AppInforComponent
          ),
      },
    ],
  },
];
