import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-duration-option',
  templateUrl: './duration-option.component.html',
  styleUrls: ['./duration-option.component.scss'],
  standalone: true,
})
export class DurationOptionComponent {
  @Input() option!: any;
  @Input() selected = false;
  @Input() disabled = false;

  @Output() select = new EventEmitter<string>();

  onSelect() {
    if (this.disabled) return;
    this.select.emit(this.option);
  }
}
