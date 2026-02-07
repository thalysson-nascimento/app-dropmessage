import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TokenStorageSecurityRequestService } from '../../service/token-storage-security-request/token-storage-security-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  canActivate(): Observable<boolean> {
    return this.tokenStorageSecurityRequestService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          // Redireciona para a página "home/main/post-message" se o usuário já estiver autenticado
          this.router.navigate(['home/main/post-message']);
          return false; // Bloqueia o acesso à rota de autenticação
        }
        return true; // Permite acesso à rota "auth/sign" se o usuário não estiver autenticado
      })
    );
  }
}
