import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonIa]',
  standalone: true,
})
export class ButtonIaDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const btn = this.el.nativeElement;

    this.renderer.setStyle(btn, 'width', '100%');
    this.renderer.setStyle(btn, 'padding', '1.7rem');
    this.renderer.setStyle(btn, 'border', 'none');
    this.renderer.setStyle(btn, 'border-radius', '50px');
    this.renderer.setStyle(
      btn,
      'background',
      'linear-gradient(90deg, #FF3781 0%, #FF9D76 100%)'
    );
    this.renderer.setStyle(btn, 'color', '#ffffff');
    this.renderer.setStyle(btn, 'font-weight', 'bold');
    this.renderer.setStyle(btn, 'font-size', '1rem');
    this.renderer.setStyle(btn, 'cursor', 'pointer');
    this.renderer.setStyle(btn, 'text-align', 'center');

    this.renderer.setStyle(
      btn,
      'transition',
      'transform 0.1s ease, opacity 0.1s ease'
    );

    btn.addEventListener('touchstart', () => {
      this.renderer.setStyle(btn, 'transform', 'scale(0.97)');
      this.renderer.setStyle(btn, 'opacity', '0.9');
    });

    btn.addEventListener('touchend', () => {
      this.renderer.setStyle(btn, 'transform', 'scale(1)');
      this.renderer.setStyle(btn, 'opacity', '1');
    });
  }
}
