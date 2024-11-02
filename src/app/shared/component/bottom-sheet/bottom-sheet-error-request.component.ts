import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  Inject,
  Input,
  Renderer2,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  styleUrl: './bottom-sheet-error-request.component.scss',
  templateUrl: './bottom-sheet-error-request.component.html',
})
export class BottomSheetErrorRequestComponent {
  @Input()
  errorMessage: string = '';
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetErrorRequestComponent>,
    private renderer: Renderer2,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data?: { messageTitle: string; messageDescription: string }
  ) {}

  dismiss(): void {
    this.bottomSheetRef.dismiss();
  }

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(target: HTMLElement) {
    if (target.closest('.action-timer')) {
      const liElement = target.closest('li');
      this.renderer.addClass(liElement, 'active');
    }
  }

  // Listener para soltar o clique
  @HostListener('mouseup', ['$event.target'])
  onMouseUp(target: HTMLElement) {
    if (target.closest('.action-timer')) {
      const liElement = target.closest('li');
      this.renderer.removeClass(liElement, 'active');
    }
  }

  selectPostTimer(timer: string) {
    this.router.navigate(['/home/take-picture-shared-message']);
    this.bottomSheetRef.dismiss();
  }
}
