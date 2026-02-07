import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  standalone: true,
})
export class MainMenuComponent implements OnInit {
  @Output() select = new EventEmitter<
    'profile' | 'ai-profiles' | 'likes' | 'favorites' | 'chat'
  >();

  constructor() {}

  ngOnInit() {}

  onClick(option: 'profile' | 'ai-profiles' | 'likes' | 'favorites' | 'chat') {
    this.select.emit(option);
  }
}
