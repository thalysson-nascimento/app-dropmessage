import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageSecurityRequestService } from '../../service/token-storage-security-request/token-storage-security-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  canActivate(): boolean {
    if (this.tokenStorageSecurityRequestService.isAuthenticated()) {
      // Redireciona para a página "home/post-message" se o usuário já estiver autenticado
      this.router.navigate(['home/post-messages']);
      return false;
    }
    return true; // Permite acesso à rota "auth/sign" se o usuário não estiver autenticado
  }
}
