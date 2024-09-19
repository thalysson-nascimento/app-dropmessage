import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignComponent } from './sign/sign.component';
import { SignupComponent } from './signup/signup.component';

export const authRouting: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/sign',  // Redireciona para sign ao acessar "auth/"
        pathMatch: 'full'
      },
      {
        path: 'auth/sign',
        component: SignComponent
      },
      {
        path: 'auth/signup',
        component: SignupComponent
      }
    ]
  }
];
