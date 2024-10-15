import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonSecondary]',
  standalone: true,
})
export class SecondaryButtonDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Definir estilo diretamente no elemento
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      '#454545'
    );
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '10px');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '2rem');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '1rem');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '1rem 2rem');
  }
}
