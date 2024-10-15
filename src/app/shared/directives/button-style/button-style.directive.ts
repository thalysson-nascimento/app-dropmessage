import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appButtonStyle]',
  standalone: true,
})
export class ButtonStyleDirective implements OnChanges {
  @Input() buttonType: 'primary' | 'secondary' = 'secondary';
  @Input() disabledButton: boolean = false; // Valor inicial como falso

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    this.setStyle();

    if (this.disabledButton) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
  }

  private setStyle() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '1rem 2rem');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '2rem');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '1rem');
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'opacity 0.3s ease'
    );

    const backgroundColor =
      this.buttonType === 'primary' ? '#dc6fa3' : '#454545';
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      backgroundColor
    );
  }

  @HostListener('click') onClick() {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.8');

    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }, 200);
  }
}
