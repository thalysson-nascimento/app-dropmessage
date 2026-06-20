import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceLanguageService {
  async getLanguage(): Promise<any> {
    let langValue = 'en-US';

    try {
      const langTag = await Device.getLanguageTag();
      if (langTag && langTag.value) {
        langValue = langTag.value;
      } else if (typeof navigator !== 'undefined' && navigator.language) {
        langValue = navigator.language;
      }
    } catch (e) {
      if (typeof navigator !== 'undefined' && navigator.language) {
        langValue = navigator.language;
      }
    }

    let [codeLanguage, countryLanguage] = langValue.replace('_', '-').split('-');

    if (!codeLanguage) {
      codeLanguage = 'en';
    }

    if (!countryLanguage) {
      const fallbackCountries: Record<string, string> = {
        pt: 'BR',
        en: 'US',
        es: 'ES',
        fr: 'FR',
        de: 'DE',
        it: 'IT',
      };
      countryLanguage = fallbackCountries[codeLanguage.toLowerCase()] || codeLanguage.toUpperCase();
    }

    return {
      language: this.getLanguageName(codeLanguage.toLowerCase()),
      codeLanguage: codeLanguage.toLowerCase(),
      countryLanguage: countryLanguage.toUpperCase(),
    };
  }

  private getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      pt: 'Português',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
    };

    return languages[code] || code;
  }
}
