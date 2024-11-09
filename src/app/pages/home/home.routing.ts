import { Routes } from '@angular/router';
import { AuthHomeGuard } from '../../shared/guard/auth-home/auth-home.guard';
import { CreateAvatarComponent } from './create-avatar/create-avatar.component';
import { HomeComponent } from './home.component';
import { MatchComponent } from './match/match.component';
import { PostMessagesComponent } from './post-messages/post-messages.component';
import { ProfileComponent } from './profile/profile.component';
import { SendMessageSuccessComponent } from './send-message-success/send-message-success.component';
import { TakePictureSharedMessageComponent } from './take-picture-shared-message/take-picture-shared-message.component';
import { UserLocationComponent } from './user-location/user-location.component';

export const HomeRouting: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthHomeGuard],
    children: [
      {
        path: '',
        redirectTo: 'post-messages',
        pathMatch: 'full',
      },
      {
        path: 'post-messages',
        component: PostMessagesComponent,
      },
      {
        path: 'take-picture-shared-message',
        component: TakePictureSharedMessageComponent,
      },
      {
        path: 'send-message-success',
        component: SendMessageSuccessComponent,
      },
      {
        path: 'match-notification',
        component: MatchComponent,
      },
      {
        path: 'create-avatar',
        component: CreateAvatarComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'user-location',
        component: UserLocationComponent,
      },
    ],
  },
];
