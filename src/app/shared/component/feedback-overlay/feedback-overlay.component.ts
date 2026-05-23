import { Component, Input } from '@angular/core';

export type FeedbackVariant = 'error' | 'warning' | 'success' | 'info';

@Component({
  selector: 'app-feedback-overlay',
  templateUrl: './feedback-overlay.component.html',
  styleUrls: ['./feedback-overlay.component.scss'],
  standalone: true,
})
export class FeedbackOverlayComponent {
  @Input() variant: FeedbackVariant = 'error';

  @Input() icon: string = 'warning_amber';

  @Input() title?: string;

  @Input() description?: string;
}
