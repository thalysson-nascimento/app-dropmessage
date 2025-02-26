import { Routes } from '@angular/router';

export const SupportRouting: Routes = [
  {
    path: 'home/support',
    loadComponent: () =>
      import('./support.component').then((m) => m.SupportComponent),
  },
  {
    path: 'home/support/list-support',
    loadComponent: () =>
      import('./list-support/list-support.component').then(
        (m) => m.ListSupportComponent
      ),
  },
  {
    path: 'home/support/request-support',
    loadComponent: () =>
      import('./request-support/request-support.component').then(
        (m) => m.RequestSupportComponent
      ),
  },
];
