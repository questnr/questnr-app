import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { LikeAction } from '~/shared/models/like-action.model';
import { QPage } from '~/shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class UserFollowersService {
  baseUrl = environment.baseUrl;

  constructor(public http: HttpClient) { }

  getUserFollowers(userId, page, size = "4") {
    if (!userId) return of();
    return this.http.get(this.baseUrl + 'user/follow/following/user/' + userId, { params: { page, size } });
  }
  getFollowedBy(userId, page, size = "4") {
    if (!userId) return of();
    return this.http.get(this.baseUrl + 'user/follow/user/following/' + userId, { params: { page, size } });
  }
  getUserLikedList(postId: number, page, size = "4"): Observable<QPage<LikeAction>> {
    if (!postId) return of();
    return this.http.get<QPage<LikeAction>>(this.baseUrl + `user/posts/${postId}/like`, { params: { page, size } });
  }
}
