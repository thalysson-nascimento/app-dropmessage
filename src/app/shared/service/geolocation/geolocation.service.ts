import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Location } from '../../interface/location-success.interface';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private httpCliente: HttpClient) {}

  getGeolocation(): Observable<Location> {
    const lat = '-7.11532';
    const lon = '-34.861';
    const apiKey = currentEnvironment.apiKeyGeoLocationCageData;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    return this.httpCliente.get<Location>(url);
  }
}
