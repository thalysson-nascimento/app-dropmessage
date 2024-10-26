import { CommonModule } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { currentEnvironment } from '../../../environment.config';
import { PostMock } from '../../shared/service/post/post.mock';
import { PostMessageService } from '../../shared/service/post/post.service';
import { DevelopmentRequestHttpBackend } from '../../shared/utils/developmentRequestHttpBackend/developmentRequestHttpBackend';

const environmentMock = currentEnvironment.mock;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [
    environmentMock
      ? [{ provide: HttpBackend, useClass: DevelopmentRequestHttpBackend }]
      : [],
    {
      provide: PostMessageService,
      useClass: environmentMock ? PostMock : PostMessageService,
    },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
