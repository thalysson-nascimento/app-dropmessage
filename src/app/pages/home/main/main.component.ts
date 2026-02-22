import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MainMenuComponent } from '../../../shared/component/main-menu/main-menu.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [MainMenuComponent, RouterModule],
  standalone: true,
})
export class MainComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onMenuSelect(
    option: 'profile' | 'ai-profiles' | 'likes' | 'notification' | 'chat'
  ) {
    const routes: Record<typeof option, string> = {
      profile: '/home/main/profile',
      'ai-profiles': '/home/main/ia-profile',
      likes: '/home/main/post-message',
      notification: '/home/main/notification',
      chat: '/home/main/chat',
    };

    this.router.navigate([routes[option]]);
  }
}
