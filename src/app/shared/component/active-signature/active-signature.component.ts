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

  @Output()
  clickeCardActiveSignature = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.clickeCardActiveSignature.emit();
  }
}
