import { Routes } from '@angular/router';
import { authRouting } from './pages/auth/auth.routing';
import { HomeRouting } from './pages/home/home.routing';
import { SupportRouting } from './pages/home/support/support.routing';

export const routes: Routes = [
  ...authRouting,
  ...HomeRouting,
  ...SupportRouting,
];
