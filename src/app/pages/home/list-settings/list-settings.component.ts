import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToHomePostMessages() {
    this.router.navigateByUrl('/home/post-messages');
  }

  goToSign() {
    this.router.navigate(['auth/sign']); // Redireciona para a rota signup
  }
}
