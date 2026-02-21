import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective implements AfterViewInit, OnDestroy {
  private btn!: HTMLElement;

  private _variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  private _disabled = false;
  private _loading = false;

  private removeListeners: (() => void)[] = [];

  @Input('appButton')
  set variant(value: 'primary' | 'secondary' | 'ghost' | '') {
    this._variant = (value as any) || 'primary';
    this.updateStyles();
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateState();
  }

  @Input()
  set loading(value: boolean) {
    this._loading = value;
    this.updateState();
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.btn = this.el.nativeElement;

    this.applyBaseStyles();
    this.registerEvents();
    this.updateStyles();
    this.updateState();
  }

  ngOnDestroy(): void {
    this.removeListeners.forEach((remove) => remove());
  }

  // ========================
  // BASE STYLES
  // ========================

  private applyBaseStyles() {
    const styles: Record<string, string> = {
      width: '100%',
      padding: '1.2rem',
      borderRadius: '50px',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'background 0.15s ease, opacity 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      outline: 'none',
    };

    Object.entries(styles).forEach(([key, value]) => {
      this.renderer.setStyle(this.btn, key, value);
    });
  }

  // ========================
  // VARIANT CONTROL
  // ========================

  private updateStyles() {
    if (!this.btn) return;

    // Reset visual styles
    this.renderer.removeStyle(this.btn, 'background');
    this.renderer.removeStyle(this.btn, 'color');
    // this.renderer.removeStyle(this.btn, 'border');

    switch (this._variant) {
      case 'secondary':
        this.renderer.setStyle(this.btn, 'background', '#ffffff');
        this.renderer.setStyle(this.btn, 'border', '1px solid #e5e7eb');
        this.renderer.setStyle(this.btn, 'color', '#111827');
        break;

      case 'ghost':
        this.renderer.setStyle(this.btn, 'background', 'transparent');
        this.renderer.setStyle(this.btn, 'border', 'none');
        this.renderer.setStyle(this.btn, 'color', '#374151');
        break;

      default:
        this.renderer.setStyle(
          this.btn,
          'background',
          'linear-gradient(90deg, #FF3781 0%, #FF9D76 100%)'
        );
        this.renderer.setStyle(this.btn, 'color', '#ffffff');
    }
  }

  // ========================
  // STATE CONTROL
  // ========================

  private updateState() {
    if (!this.btn) return;

    const isDisabled = this._disabled || this._loading;

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

  // ========================
  // MOBILE CLICK EFFECT
  // ========================

  private registerEvents() {
    const press = this.renderer.listen(this.btn, 'pointerdown', () => {
      if (this._variant === 'ghost' && !this._disabled && !this._loading) {
        this.renderer.setStyle(this.btn, 'background', '#e5e7eb');
      }
    });

    const release = this.renderer.listen(this.btn, 'pointerup', () => {
      if (this._variant === 'ghost' && !this._disabled && !this._loading) {
        this.renderer.setStyle(this.btn, 'background', 'transparent');
      }
    });

    const cancel = this.renderer.listen(this.btn, 'pointerleave', () => {
      if (this._variant === 'ghost') {
        this.renderer.setStyle(this.btn, 'background', 'transparent');
      }
    });

    this.removeListeners.push(press, release, cancel);
  }
}
