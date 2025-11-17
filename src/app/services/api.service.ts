
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private scanEndpoint = environment.apiBaseUrl ? `${environment.apiBaseUrl}/index/repository` : 'http://localhost:8080/api/scan';
  private queryEndpoint = environment.apiBaseUrl ? `${environment.apiBaseUrl}/query/repository` : 'http://localhost:8080/api/query';

  constructor(private http: HttpClient) {}

  scanRepo(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.scanEndpoint, payload, { headers, responseType: 'text' });
  }

  runQuery(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.queryEndpoint, payload, { headers, responseType: 'text' });
  }
}
