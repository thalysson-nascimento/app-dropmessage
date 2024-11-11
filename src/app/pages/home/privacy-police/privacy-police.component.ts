import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-police',
  templateUrl: './privacy-police.component.html',
  styleUrls: ['./privacy-police.component.scss'],
  standalone: true,
})
export class PrivacyPoliceComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToBack() {
    window.history.back();
  }
}
