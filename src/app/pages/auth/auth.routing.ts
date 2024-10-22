import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { DataCompleteComponent } from './data-complete/data-complete.component';
import { SignComponent } from './sign/sign.component';
import { SignupComponent } from './signup/signup.component';
import { TesteComponent } from './teste/teste.component';

export const authRouting: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/sign', // Redireciona para sign ao acessar "auth/"
        pathMatch: 'full',
      },
      {
        path: 'auth/sign',
        component: SignComponent,
      },
      {
        path: 'auth/signup',
        component: SignupComponent,
      },
      {
        path: 'auth/data-complete',
        component: DataCompleteComponent,
      },
      {
        path: 'auth/teste',
        component: TesteComponent,
      },
    ],
  },
];
