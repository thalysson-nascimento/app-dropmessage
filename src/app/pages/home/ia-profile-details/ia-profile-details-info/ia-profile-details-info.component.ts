import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardGlassComponent } from '../../../../shared/component/card-glass/card-glass.component';
import { AIProfileInterface } from '../../../../shared/interface/ai-profile.interface';

export interface Interesse {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-ia-profile-details-info',
  templateUrl: './ia-profile-details-info.component.html',
  styleUrls: ['./ia-profile-details-info.component.scss'],
  imports: [CardGlassComponent],
  standalone: true,
})
export class IaProfileDetailsInfoComponent implements OnInit {
  @Input() aiProfiles!: AIProfileInterface;
  @Output() $goBack = new EventEmitter<void>();

  person = ['Ousada', 'carinhosa', 'curiosa'];

  interesses: Interesse[] = [
    { label: 'Running', icon: 'sprint' },
    { label: 'Fitness', icon: 'fitness_center' },
    { label: 'Reading', icon: 'menu_book' },
    { label: 'Traveling', icon: 'flight' },
  ];

  estiloCompanhia: Interesse[] = [
    { label: 'Conversas à noite', icon: 'sprint' },
    { label: 'Conselhos emocionais', icon: 'fitness_center' },
    { label: 'profundas', icon: 'fitness_center' },
    { label: 'humor leve', icon: 'fitness_center' },
    { label: 'sem julgamentos', icon: 'fitness_center' },
  ];

  constructor() {}

  ngOnInit() {}

  goBack() {
    this.$goBack.emit();
  }
}
