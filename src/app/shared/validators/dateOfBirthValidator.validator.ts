import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { differenceInYears, isFuture, isValid, parse } from 'date-fns';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateString = control.value;

    // Faz o parse da data fornecida no formato esperado "dd/MM/yyyy"
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());

    // Verifica se a data é válida
    if (!isValid(parsedDate)) {
      return { invalidDate: 'Data inválida' };
    }

    // Verifica se a data é futura
    if (isFuture(parsedDate)) {
      return { futureDate: 'A data não pode ser maior que a data atual' };
    }

    // Verifica se o usuário tem pelo menos 18 anos
    const age = differenceInYears(new Date(), parsedDate);
    if (age < 18) {
      return { underage: 'O usuário deve ter pelo menos 18 anos' };
    }

    return null; // Retorna null se não houver erros
  };
}
