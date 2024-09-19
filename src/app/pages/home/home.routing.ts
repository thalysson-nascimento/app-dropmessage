import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostMessagesComponent } from './post-messages/post-messages.component';

export const HomeRouting: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-messages',  // Redireciona para sign ao acessar "auth/"
        pathMatch: 'full'
      },
      {
        path: 'post-messages',
        component: PostMessagesComponent
      },
    ]
  }
];
