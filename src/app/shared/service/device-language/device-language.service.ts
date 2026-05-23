import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceLanguageService {
  async getLanguage(): Promise<any> {
    const langTag = await Device.getLanguageTag();

    const [codeLanguage, countryLanguage] = langTag.value.split('-');

    return {
      language: this.getLanguageName(codeLanguage),
      codeLanguage,
      countryLanguage,
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
