import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { User } from '~/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfilePageService {
  baseUrl = environment.baseUrl;

  constructor(public http: HttpClient) { }

  getUserFeeds(userId, page, size = "4") {
    if (!userId) return of();
    return this.http.get(this.baseUrl + 'user/' + userId + '/posts', { params: { page: page, size: size } });
  }
  getUserProfile(slug): Observable<User> {
    if (!slug) return of();
    return this.http.get<User>(this.baseUrl + 'user/profile/' + slug);
  }
  updateProfilePicture(file) {
    return this.http.post(this.baseUrl + 'user/avatar', file);
  }
  updateUser(formData) {
    return this.http.put(this.baseUrl + 'user', formData);
  }
  updateUserBanner(formData) {
    return this.http.post(this.baseUrl + 'user/banner', formData);
  }
  getUserQuestions(userId): Observable<QPage<Post>> {
    return this.http.get<QPage<Post>>(this.baseUrl + `user/${userId}/posts/poll/question`);
  }
}
