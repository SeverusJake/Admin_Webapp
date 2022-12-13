import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RateService {
  url = "http://localhost:8989/api/rates";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url+'/'+id);
  }

  hide(id: number) {
    return this.httpClient.delete(this.url + '/set-status-hide/' + id);
  }

  show(id: number) {
    return this.httpClient.delete(this.url + '/set-status-show/' + id);
  }
  
  getAllAdmin() {
    return this.httpClient.get(this.url + "/admin");
  }
}
