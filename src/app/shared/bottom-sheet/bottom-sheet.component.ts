import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  Renderer2,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'bottom-sheet-overview',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  styleUrl: './bottom-sheet.component.scss',
  templateUrl: './bottom-sheet.component.html',
})
export class BottomSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private renderer: Renderer2
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
    console.log(timer);
  }
}