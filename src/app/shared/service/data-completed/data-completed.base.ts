import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DataCompleted {
  file: Blob;
  dateOfBirth: string;
  gender: string;
}

export abstract class DataCompletedBase {
  constructor(protected httpClient: HttpClient) {}

  abstract dataCompleted({
    file,
    dateOfBirth,
    gender,
  }: DataCompleted): Observable<any>;
}
