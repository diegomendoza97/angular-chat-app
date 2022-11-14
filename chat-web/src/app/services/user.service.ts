import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor( private httpClient: HttpClient) { }

  createUser(user: any) {
    return this.httpClient.post('api/users/create', user);
  }

  login(user: any) {
    return this.httpClient.post('api/users/login', {email: user.email, password: user.password});
  }
}
