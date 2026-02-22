import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  standalone: true,
})
export class MainMenuComponent implements OnInit {
  activeMenu: string = 'likes';

  @Output() select = new EventEmitter<
    'profile' | 'ai-profiles' | 'likes' | 'notification' | 'chat'
  >();

  constructor() {}

  ngOnInit() {}

  onClick(
    option: 'profile' | 'ai-profiles' | 'likes' | 'notification' | 'chat'
  ) {
    this.select.emit(option);
    this.activeMenu = option;
  }
}
