import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective implements AfterViewInit, OnChanges {
  @Input('appButton') variant: 'primary' | 'secondary' | '' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;

  private btn!: HTMLElement;
  private spinner!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.btn = this.el.nativeElement;
    this.applyBaseStyles();
    this.applyVariant();
    this.applyState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.btn) {
      this.applyVariant();
      this.applyState();
    }
  }

  private applyBaseStyles() {
    this.renderer.setStyle(this.btn, 'width', '100%');
    this.renderer.setStyle(this.btn, 'padding', '1.2rem');
    this.renderer.setStyle(this.btn, 'border-radius', '50px');
    this.renderer.setStyle(this.btn, 'font-weight', 'bold');
    this.renderer.setStyle(this.btn, 'font-size', '1rem');
    this.renderer.setStyle(this.btn, 'cursor', 'pointer');
    this.renderer.setStyle(this.btn, 'text-align', 'center');
    this.renderer.setStyle(this.btn, 'transition', 'all 0.2s ease');
    this.renderer.setStyle(this.btn, 'position', 'relative');
    this.renderer.setStyle(this.btn, 'overflow', 'hidden');
    this.renderer.setStyle(this.btn, 'display', 'flex');
    this.renderer.setStyle(this.btn, 'align-items', 'center');
    this.renderer.setStyle(this.btn, 'justify-content', 'center');
    this.renderer.setStyle(this.btn, 'gap', '0.5rem');
    this.renderer.setStyle(this.btn, 'transition', 'all 0.2s ease');
    this.renderer.setStyle(this.btn, 'position', 'relative');
    this.renderer.setStyle(this.btn, 'overflow', 'hidden');
  }

  private applyVariant() {
    const finalVariant = this.variant === 'secondary' ? 'secondary' : 'primary';

    if (finalVariant === 'secondary') {
      this.renderer.setStyle(this.btn, 'background', '#ffffff');
      this.renderer.setStyle(this.btn, 'border', '1px solid #e5e7eb');
      this.renderer.setStyle(this.btn, 'color', '#111827');
    } else {
      this.renderer.setStyle(this.btn, 'border', 'none');
      this.renderer.setStyle(
        this.btn,
        'background',
        'linear-gradient(90deg, #FF3781 0%, #FF9D76 100%)'
      );
      this.renderer.setStyle(this.btn, 'color', '#ffffff');
    }
  }

  private applyState() {
    const isDisabled = this.disabled || this.loading;

    if (isDisabled) {
      this.renderer.setStyle(this.btn, 'opacity', '0.6');
      this.renderer.setStyle(this.btn, 'cursor', 'not-allowed');
      this.renderer.setStyle(this.btn, 'pointer-events', 'none');
    } else {
      this.renderer.setStyle(this.btn, 'opacity', '1');
      this.renderer.setStyle(this.btn, 'cursor', 'pointer');
      this.renderer.removeStyle(this.btn, 'pointer-events');
    }
  }
}
