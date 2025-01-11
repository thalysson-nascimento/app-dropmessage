import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivacyPoliceExtendsComponent } from '../../../shared/component/privacy-police-extends/privacy-police-extends.component';

@Component({
  selector: 'app-privacy-police',
  templateUrl: './privacy-police.component.html',
  styleUrls: ['./privacy-police.component.scss'],
  imports: [PrivacyPoliceExtendsComponent],
  standalone: true,
})
export class PrivacyPoliceComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToBack() {
    window.history.back();
  }
}
