import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class ViewCardFreeTrialService {
  private baseURL = currentEnvironment.baseURL;
  constructor(private httpCliente: HttpClient) {}

  viewCard(): Observable<any> {
    return this.httpCliente.put<any>(
      `${this.baseURL}/view-card-free-trial`,
      {}
    );
  }
}
