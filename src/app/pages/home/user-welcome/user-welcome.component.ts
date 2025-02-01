import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.scss'],
  standalone: true,
  imports: [...SharedComponents],
})
export class UserWelcomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  toGoPostMessage() {
    this.router.navigateByUrl('/home/post-messages');
  }
}
