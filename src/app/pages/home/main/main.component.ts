import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/component/header/header.component';
import { MainMenuComponent } from '../../../shared/component/main-menu/main-menu.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [MainMenuComponent, HeaderComponent, RouterModule],
  standalone: true,
})
export class MainComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onMenuSelect(
    option: 'profile' | 'ai-profiles' | 'likes' | 'favorites' | 'chat'
  ) {
    const routes: Record<typeof option, string> = {
      profile: '/home/main/profile',
      'ai-profiles': '/home/main/ia-profile',
      likes: '/home/main/post-message',
      favorites: '/home/main/favorites',
      chat: '/home/main/chat',
    };

    this.router.navigate([routes[option]]);
  }
}
