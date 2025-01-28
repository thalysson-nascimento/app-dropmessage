import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-active-signature',
  templateUrl: './active-signature.component.html',
  styleUrls: ['./active-signature.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ActiveSignatureComponent implements OnInit {
  @Input()
  plan?: string;
  @Input()
  description?: string;
  @Input()
  labelTag?: string;
  @Input()
  currentPeriodEnd?: number;
  @Input()
  colorTop?: string = '#00b894';
  @Input()
  colorBottom?: string = '#03836a';
  @Input()
  status?: string = '';

  @Output()
  clickeCardActiveSignature = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.clickeCardActiveSignature.emit();
  }
}
