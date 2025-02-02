import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class FirstPublicationRegisterGoldFreeService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpCliente: HttpClient) {}

  firstPublication(): Observable<any> {
    return this.httpCliente.post<any>(
      `${this.baseURL}/first-publication-register-gold-free`,
      {}
    );
  }
}
