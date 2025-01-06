import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputCustom]',
  standalone: true,
})
export class InputCustomDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Definir estilo diretamente no elemento
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      '#f6f6f6'
    );
    this.renderer.setStyle(this.el.nativeElement, 'color', '#333');
    this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '1rem');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '0.5rem');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '1rem');
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'outline', 'none');
  }

  @HostListener('focus') onFocus() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'border',
      '1px solid #d9d9d9'
    );
  }

  @HostListener('blur') onBlur() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'border',
      '1px solid #B5B5B5'
    );
  }
}
