import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AvatarSuccess } from '../../interface/avatar.interface';

@Injectable({
  providedIn: 'root',
})
export class CacheAvatarService {
  private behaviorSubjectAvatarCache$: BehaviorSubject<AvatarSuccess | null> =
    new BehaviorSubject<AvatarSuccess | null>(null);

  constructor() {}

  setDataAvatarCache(avatar: AvatarSuccess | null) {
    this.behaviorSubjectAvatarCache$.next(avatar);
  }

  getDataAvatarCache(): Observable<AvatarSuccess | null> {
    return this.behaviorSubjectAvatarCache$.asObservable();
  }

  resetDataAvatarCache() {
    this.behaviorSubjectAvatarCache$.next(null);
  }
}
