import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardGlassComponent } from '../../../shared/component/card-glass/card-glass.component';
import { AIProfileInterface } from '../../../shared/interface/ai-profile.interface';
import { IaProfileDetailsInfoComponent } from './ia-profile-details-info/ia-profile-details-info.component';

@Component({
  selector: 'app-ia-profile-details',
  templateUrl: './ia-profile-details.component.html',
  styleUrls: ['./ia-profile-details.component.scss'],
  imports: [CardGlassComponent, IaProfileDetailsInfoComponent, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class IaProfileDetailsComponent implements OnInit {
  public aiProfiles!: AIProfileInterface;
  public movieAI!: string;

  @ViewChild('swiperRef') swiperRef!: ElementRef;

  get swiper() {
    return this.swiperRef.nativeElement.swiper;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    const state = window.history.state as { aiProfile?: AIProfileInterface };

    if (!state?.aiProfile) return;

    this.aiProfiles = state.aiProfile;
    this.loadMoviesAI();
  }

  goBack() {
    this.router.navigate(['home/main/ia-profile']);
  }

  goToListSubscriptionAI() {
    this.router.navigate(['home/list-subscription-ai']);
  }

  public loadMoviesAI() {
    if (this.aiProfiles.name === 'Sophia') {
      this.movieAI = 'assets/movie/sophia-movie.mp4';
    } else if (this.aiProfiles.name === 'David') {
      this.movieAI = 'assets/movie/david-movie.mp4';
    }
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
