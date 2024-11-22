import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appListStyle]',
  standalone: true,
})
export class ListStyleDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.applyStyles();
  }

  applyStyles() {
    const listItems = this.el.nativeElement.querySelectorAll('li');

    listItems.forEach((item: HTMLElement, index: number) => {
      this.renderer.setStyle(item, 'display', 'flex');
      this.renderer.setStyle(item, 'width', '100%');
      this.renderer.setStyle(item, 'paddingTop', '1.5rem');
      this.renderer.setStyle(item, 'paddingBottom', '1.5rem');

      this.renderer.setStyle(item, 'justifyContent', 'space-between');
      this.renderer.setStyle(item, 'alignItems', 'center');

      // Estilo para o texto e descrição
      const textContainer = this.renderer.createElement('div');
      textContainer.style.flex = '1';

      // Criar o label
      const label = item.querySelector('[label]');
      if (label) {
        this.renderer.appendChild(textContainer, label);
      }

      // Criar a descrição
      const description = item.querySelector('[description]');
      if (description) {
        this.renderer.setStyle(description, 'fontSize', '0.9rem');
        this.renderer.appendChild(textContainer, description);
      }

      // Adiciona o container de texto à li
      this.renderer.insertBefore(item, textContainer, item.firstChild);

      // Estilo para o ícone
      const icon = item.querySelector('[icon]');
      if (icon) {
        this.renderer.setStyle(icon, 'marginLeft', 'auto');
      }

      // Linha divisória inferior, exceto no último item
      if (index < listItems.length - 1) {
        this.renderer.setStyle(item, 'borderBottom', '1px solid #E5E5E5');
      }
    });
  }
}
