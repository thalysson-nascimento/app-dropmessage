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
}
