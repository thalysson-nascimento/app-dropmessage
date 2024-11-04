import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-information-user-registred',
  templateUrl: './information-user-registred.component.html',
  styleUrls: ['./information-user-registred.component.scss'],
  standalone: true,
  imports: [...SharedComponents],
})
export class InformationUserRegistredComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToLogin() {
    this.router.navigateByUrl('auth/sign');
  }
}
