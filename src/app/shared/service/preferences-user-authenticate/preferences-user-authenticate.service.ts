import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map } from 'rxjs';
import { TokenResponseSuccess } from '../../interface/token-response-success.interface';

@Injectable({
  providedIn: 'root',
})
export class PreferencesUserAuthenticateService {
  private preferencesKey = 'userAuthenticate';
  constructor() {}

  savePreferences(value: TokenResponseSuccess) {
    const setPreference = Preferences.set({
      key: this.preferencesKey,
      value: JSON.stringify(value),
    });

    return from(setPreference);
  }

  getToken(): Observable<TokenResponseSuccess | null> {
    return from(Preferences.get({ key: this.preferencesKey })).pipe(
      map((result) => {
        return result.value ? JSON.parse(result.value) : null;
      })
    );
  }

  deleteToken(): Observable<void> {
    return from(Preferences.remove({ key: this.preferencesKey }));
  }
}
