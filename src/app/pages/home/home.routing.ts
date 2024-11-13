import { Routes } from '@angular/router';
import { AuthHomeGuard } from '../../shared/guard/auth-home/auth-home.guard';

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
    ],
  },
];
