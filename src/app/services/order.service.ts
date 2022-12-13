import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = "http://localhost:8989/api/orders";

  urlOrderDetail = "http://localhost:8989/api/orderDetail";

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.url);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByOrder(id:number) {
    return this.httpClient.get(this.urlOrderDetail+'/order/'+id);
  }

  cancel(id: number) {
    return this.httpClient.get(this.url+'/cancel/'+id);
  }

  cancelReason(id: number, reason : string) {
    return this.httpClient.post(this.url+'/cancelReason/'+id, reason);
  }

  deliver(id: number) {
    return this.httpClient.get(this.url+'/deliver/'+id);
  }

  success(id: number) {
    return this.httpClient.get(this.url+'/success/'+id);
  }
}
