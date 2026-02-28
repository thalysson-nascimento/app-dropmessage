import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  imports: [RouterModule],
  standalone: true,
})
export class MainMenuComponent implements OnInit {
  activeMenu: string = 'likes';

  constructor() {}

  ngOnInit() {}

  onClick(
    option: 'profile' | 'ai-profiles' | 'likes' | 'notification' | 'chat'
  ) {
    this.activeMenu = option;
  }
}
