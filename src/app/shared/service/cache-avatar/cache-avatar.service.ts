import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, map } from 'rxjs';
import { AvatarSuccess } from '../../interface/avatar.interface';

@Injectable({
  providedIn: 'root',
})
export class CacheAvatarService {
  constructor() {}

  setAvatarCachePreferences(avatar: AvatarSuccess): Observable<void> {
    const setPreference = Preferences.set({
      key: 'avatarCachePreferences',
      value: JSON.stringify(avatar),
    });

    return from(setPreference);
  }

  getAvatarCachePreferences(): Observable<AvatarSuccess> {
    return from(Preferences.get({ key: 'avatarCachePreferences' })).pipe(
      map((result) => {
        return result.value ? JSON.parse(result.value) : null;
      })
    );
  }

  resetAvatarCachePreferences(): Observable<void> {
    return from(Preferences.remove({ key: 'avatarCachePreferences' }));
  }
}
