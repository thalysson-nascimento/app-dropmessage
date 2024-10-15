/* tslint:disable:no-unused-variable */

import { ElementRef, Renderer2 } from '@angular/core';
import { ButtonStyleDirective } from './button-style.directive';

describe('Directive: ButtonStyleDirective', () => {
  it('should create an instance', () => {
    const directive = new ButtonStyleDirective(
      {} as ElementRef<any>,
      {} as Renderer2
    );
    expect(directive).toBeTruthy();
  });
});
