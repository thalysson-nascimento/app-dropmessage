import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guard/auth/auth.guard';

export const authRouting: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth.component').then((m) => m.AuthComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'auth/sign',
        pathMatch: 'full',
      },
      {
        path: 'auth/sign',
        loadComponent: () =>
          import('./sign/sign.component').then((m) => m.SignComponent),
      },
      {
        path: 'auth/signup',
        loadComponent: () =>
          import('./signup/signup.component').then((m) => m.SignupComponent),
      },
      {
        path: 'auth/information-user-registred',
        loadComponent: () =>
          import(
            './information-user-registred/information-user-registred.component'
          ).then((m) => m.InformationUserRegistredComponent),
      },
      {
        path: 'auth/teste',
        loadComponent: () =>
          import('./teste/teste.component').then((m) => m.TesteComponent),
      },
      {
        path: 'auth/privacy-police',
        loadComponent: () =>
          import('./privacy-police/privacy-police.component').then(
            (m) => m.PrivacyPoliceComponent
          ),
      },
    ],
  },
];
