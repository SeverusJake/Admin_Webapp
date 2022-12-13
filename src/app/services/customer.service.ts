import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../common/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = "http://localhost:8989/api/auth";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getAllAdmin() {
    return this.httpClient.get(this.url + '/admin');
  }

  post(customer: Customer) {
    return this.httpClient.post(this.url, customer);
  }

  postAdminComment(customer: Customer) {
    return this.httpClient.post(this.url + '/admin/comment', customer);
  }

  postAdminOrder(customer: Customer) {
    return this.httpClient.post(this.url + '/admin/order', customer);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getByEmail(email: string) {
    return this.httpClient.get(this.url + '/email/' + email);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  hide(id: number) {
    return this.httpClient.delete(this.url + '/set-status-hide/' + id);
  }

  show(id: number) {
    return this.httpClient.delete(this.url + '/set-status-show/' + id);
  }

  update(id: number, customer: Customer) {
    return this.httpClient.put(this.url + '/' + id, customer);
  }

  updateAdmin(id: number, customer: Customer) {
    return this.httpClient.put(this.url + '/admin/' + id, customer);
  }

  updateAdminComment(id: number, customer: Customer) {
    return this.httpClient.put(this.url + '/admin/comment/' + id, customer);
  }

  updateAdminOrder(id: number, customer: Customer) {
    return this.httpClient.put(this.url + '/admin/order/' + id, customer);
  }
}
