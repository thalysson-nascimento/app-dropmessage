import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ListSettingsComponent } from './list-settings/list-settings.component';
import { MatchComponent } from './match/match.component';
import { PostMessagesComponent } from './post-messages/post-messages.component';
import { SendMessageSuccessComponent } from './send-message-success/send-message-success.component';
import { TakePictureSharedMessageComponent } from './take-picture-shared-message/take-picture-shared-message.component';

export const HomeRouting: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-messages', // Redireciona para sign ao acessar "auth/"
        pathMatch: 'full',
      },
      {
        path: 'post-messages',
        component: PostMessagesComponent,
      },
      {
        path: 'list-settings',
        component: ListSettingsComponent,
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
    ],
  },
];
