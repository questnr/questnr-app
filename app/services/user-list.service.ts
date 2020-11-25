import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  baseUrl = environment.baseUrl;

  constructor(public http: HttpClient) { }

  searchUser(userString: string) {
    if (!userString) return of();
    return this.http.get(this.baseUrl + 'user/search/users?userString=' + userString);
  }

}
