import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  ngOnInit() {}

  goToHomePostMessages() {
    this.router.navigateByUrl('/home/post-messages');
  }

  goToSign() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
  }
}
