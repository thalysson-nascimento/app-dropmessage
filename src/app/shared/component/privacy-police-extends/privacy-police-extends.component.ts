import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-police-extends',
  templateUrl: './privacy-police-extends.component.html',
  styleUrls: ['./privacy-police-extends.component.scss'],
  standalone: true,
  imports: [],
})
export class PrivacyPoliceExtendsComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  scrollToElement(elementId: string) {
    const element = this.elementRef.nativeElement.querySelector(
      `#${elementId}`
    );
    const marginTop = 16;

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const scrollTop = document.documentElement.scrollTop;
      const targetPosition = elementRect.top + scrollTop - marginTop;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    } else {
      console.error(`Elemento com ID ${elementId} não encontrado.`);
    }
  }
}
