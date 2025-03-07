import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Location } from '../../interface/location-success.interface';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private httpCliente: HttpClient) {}

  getGeolocation(latitude: number, longitude: number): Observable<Location> {
    const apiKey = currentEnvironment.apiKeyGeoLocationCageData;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    return this.httpCliente.get<Location>(url).pipe(
      catchError((error) => {
        console.error('Erro na requisição de geolocalização:', error);
        return throwError(() => error);
      })
    );
  }
}
