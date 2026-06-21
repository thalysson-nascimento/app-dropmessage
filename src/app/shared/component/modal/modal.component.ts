import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ModalComponent {
  public isOpen = false;
  public isLocked = false;

  open() {
    this.isOpen = true;
  }

  close() {
    if (this.isLocked) return;
    this.isOpen = false;
  }
}
