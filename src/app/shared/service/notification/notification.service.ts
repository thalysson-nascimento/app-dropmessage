import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { GetNotificationsResponse } from '../../interface/notification.interface';
import { SocketService } from '../socket.service.ts/socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseURL = currentEnvironment.baseURL;

  public unreadCount$ = new BehaviorSubject<number>(0);
  public hasUnread$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {
    this.socketService.onNotificationUnread().subscribe({
      next: (data) => {
        console.log('📩 notification:unread socket event payload:', data);
        this.unreadCount$.next(data.count);
        this.hasUnread$.next(data.hasUnread);
      },
      error: (err) => console.error('Socket notification unread event error:', err)
    });
  }

  notification(): Observable<GetNotificationsResponse> {
    return this.httpClient
      .get<GetNotificationsResponse>(`${this.baseURL}/notification`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  unreadCount(): Observable<{ count: number; hasUnread: boolean }> {
    return this.httpClient
      .get<{ count: number; hasUnread: boolean }>(`${this.baseURL}/notification/unread-count`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  loadInitialUnreadCount(): void {
    this.unreadCount().subscribe({
      next: (data) => {
        this.unreadCount$.next(data.count);
        this.hasUnread$.next(data.hasUnread);
      },
      error: (err) => {
        console.error('Error fetching initial unread notifications count:', err);
      }
    });
  }
}
