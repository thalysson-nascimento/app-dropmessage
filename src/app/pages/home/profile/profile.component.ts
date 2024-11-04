import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../../../shared/interface/user-data.interface';
import { UserDataCacheService } from '../../../shared/service/user-data-cache/user-data-cache.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData!: UserData;

  constructor(
    private router: Router,
    private userDataCacheService: UserDataCacheService
  ) {}

  ngOnInit() {
    this.loadUserDataCache();
  }

  loadUserDataCache() {
    this.userDataCacheService.getUserDataCache().subscribe({
      next: (response) => {
        if (response) {
          this.userData = response;
          console.log('this.userData', this.userData);
        }
      },
    });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
  }
}
