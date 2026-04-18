import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const likeLimiteRewardAnimation = [
  trigger('backdropFade', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('180ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
  ]),
  trigger('cardScale', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.85)' }),
      animate(
        '500ms ease-out',
        keyframes([
          style({ opacity: 1, transform: 'scale(1.08)', offset: 0.55 }),
          style({ transform: 'scale(0.98)', offset: 0.85 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ])
      ),
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
    ]),
  ]),
];
