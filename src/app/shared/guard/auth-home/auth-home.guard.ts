import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TokenStorageSecurityRequestService } from '../../service/token-storage-security-request/token-storage-security-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHomeGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  canActivate(): Observable<boolean> {
    return this.tokenStorageSecurityRequestService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true; // Permite o acesso à rota
        } else {
          this.router.navigate(['auth/sign']); // Redireciona para a página de login
          return false;
        }
      })
    );
  }
}
