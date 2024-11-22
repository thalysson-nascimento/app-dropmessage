import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.trim().length === 0) {
      return { noOnlySpaces: true };
    }
    return null; // Retorna válido se a condição acima não for atendida
  };
}
