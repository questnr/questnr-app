import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityMembersService {
  baseUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getCommunityMembers(url: string, page, size = "4"): Observable<QPage<User>> {
    if (!url) return of();
    return this.http.get<QPage<User>>(this.baseUrl + `user/community/${url}/users`, { params: { page: page, size: size } });
  }

  removeUserFromCommunity(communityId, userId) {
    if (!communityId || !userId) return of();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {}
    };
    return this.http.delete(this.baseUrl + `/user/${userId}/join/community/${communityId}`, httpOptions);
  }
}
