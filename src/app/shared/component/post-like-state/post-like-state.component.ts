import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StaticLikePreferences } from '../../interface/static-like-preferences.interface';
import { StaticLikePreferencesService } from '../../service/static-like-preferences/static-like-preferences.service';
import { LoadShimmerComponent } from '../load-shimmer/load-shimmer.component';

const SharedComponents = [LoadShimmerComponent];

@Component({
  selector: 'app-post-like-state',
  templateUrl: './post-like-state.component.html',
  styleUrls: ['./post-like-state.component.scss'],
  standalone: true,
  imports: [SharedComponents, NgIf],
})
export class PostLikeStateComponent implements OnInit {
  isLoading: boolean = true;
  likePreferences!: StaticLikePreferences;
  showErrorStatict: boolean = false;
  constructor(
    private staticLikePreferencesService: StaticLikePreferencesService
  ) {}

  ngOnInit() {
    this.loadStaticLikePreferences();
  }

  loadStaticLikePreferences() {
    return this.staticLikePreferencesService.staticLikePreferences().subscribe({
      next: (data) => {
        this.likePreferences = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorStatict = true;
        this.isLoading = false;
        console.error(err);
      },
    });
  }
}
