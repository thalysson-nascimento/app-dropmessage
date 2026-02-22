import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationFilter } from '../../interface/notification.interface';

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  imports: [NgFor],
  standalone: true,
})
export class FilterChipsComponent {
  @Input() selected!: NotificationFilter;
  @Output() selectedChange = new EventEmitter<NotificationFilter>();

  filters: { label: string; value: NotificationFilter }[] = [
    { label: 'Tudo', value: 'ALL' },
    { label: 'Curtidas', value: 'LIKES' },
    { label: 'Comentários', value: 'COMMENTS' },
    { label: 'Menções', value: 'MENTIONS' },
  ];

  select(filter: NotificationFilter) {
    this.selectedChange.emit(filter);
  }
}
