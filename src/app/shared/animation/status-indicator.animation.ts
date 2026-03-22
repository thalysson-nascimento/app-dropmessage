import { animate, style, transition, trigger } from '@angular/animations';

export const statusIndicatorAnimation = [
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(5px)' }),
      animate(
        '300ms ease-out',
        style({ opacity: 1, transform: 'translateY(0)' })
      ),
    ]),
    transition(':leave', [
      animate(
        '300ms ease-in',
        style({ opacity: 0, transform: 'translateY(-5px)' })
      ),
    ]),
  ]),
  trigger('fadeIndicator', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms ease', style({ opacity: 0 }))]),
  ]),
];
