import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHashPublicService {
  constructor() {}

  setUserHashPublic(hash: string) {
    const setPreference = Preferences.set({
      key: 'userHashPublic',
      value: JSON.stringify(hash),
    });

    return from(setPreference);
  }

  getUserHashPublic(): Observable<string | null> {
    return from(Preferences.get({ key: 'userHashPublic' })).pipe(
      map((result) => {
        return result.value ? JSON.parse(result.value) : null;
      })
    );
  }

  removeUserHashPublic() {
    const removePreference = Preferences.remove({ key: 'userHashPublic' });

    return from(removePreference);
  }
}
