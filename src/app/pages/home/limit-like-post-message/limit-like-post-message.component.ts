import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-limit-like-post-message',
  templateUrl: './limit-like-post-message.component.html',
  styleUrls: ['./limit-like-post-message.component.scss'],
  standalone: true,
})
export class LimitLikePostMessageComponent implements OnInit {
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.message = params.get('message') || '';
    });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/main/post-message');
  }
}
