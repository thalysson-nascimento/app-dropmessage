import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { differenceInYears, isFuture, isValid, parse } from 'date-fns';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateString = control.value;

    // Faz o parse da data fornecida no formato esperado "dd/MM/yyyy"
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());

    // Verifica se a data é válida
    if (!isValid(parsedDate)) {
      return { invalidDate: 'Invalid date.' };
    }

    // Verifica se a data é futura
    if (isFuture(parsedDate)) {
      return { futureDate: 'Date cannot be in the future.' };
    }

    // Verifica se o usuário tem pelo menos 18 anos
    const age = differenceInYears(new Date(), parsedDate);
    if (age < 18) {
      return { underage: 'The user must be at least 18 years old.' };
    }

    return null; // Retorna null se não houver erros
  };
}
