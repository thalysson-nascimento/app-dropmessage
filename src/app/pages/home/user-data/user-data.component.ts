import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ListStyleDirective } from '../../../shared/directives/list-style/list-style.directive';

const SharedComponents = [
  LoadShimmerComponent,
  SystemUnavailableComponent,
  ListStyleDirective,
];
const CoreModule = [NgIf];

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class UserDataComponent implements OnInit {
  isLoading: boolean = false;
  showSystemUnavailable: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToProfile() {
    this.router.navigateByUrl('home/profile');
  }

  tryAgain() {}
}
