import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { UserInfo } from '~/shared/models/user.model';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  baseUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getUserInfo(slug: string): Observable<UserInfo> {
    if (!slug) return of();
    return this.http.get<UserInfo>(this.baseUrl + 'user/profile/meta/' + slug + '/info');
  }
}
