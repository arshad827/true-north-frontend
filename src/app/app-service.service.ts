import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl = 'http://localhost:3000/get/getHello/';
  constructor(private httpClient: HttpClient) { }

  search(payload: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + payload);
  }
}
