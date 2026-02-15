import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CardGlassComponent } from '../../../shared/component/card-glass/card-glass.component';
import { IaProfileDetailsInfoComponent } from './ia-profile-details-info/ia-profile-details-info.component';

@Component({
  selector: 'app-ia-profile-details',
  templateUrl: './ia-profile-details.component.html',
  styleUrls: ['./ia-profile-details.component.scss'],
  imports: [CardGlassComponent, IaProfileDetailsInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class IaProfileDetailsComponent implements OnInit {
  @ViewChild('swiperRef') swiperRef!: ElementRef;

  get swiper() {
    return this.swiperRef.nativeElement.swiper;
  }

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['home/main/ia-profile']);
  }

  async slidePrev() {
    const swiper = this.swiperRef.nativeElement;
    await swiper.swiper.slidePrev();
  }

  async slideNext() {
    const swiper = this.swiperRef.nativeElement;
    await swiper.swiper.slideNext();
  }
}
