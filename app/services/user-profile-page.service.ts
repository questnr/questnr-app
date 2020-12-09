import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as bghttp from '@nativescript/background-http';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { User } from '~/shared/models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfilePageService {
  baseUrl = environment.baseUrl;

  constructor(public http: HttpClient,
    private authService: AuthService) { }

  getUserFeeds(userId, page, size = "4") {
    if (!userId) return of();
    return this.http.get(this.baseUrl + 'user/' + userId + '/posts', { params: { page: page, size: size } });
  }
  getUserProfile(slug): Observable<User> {
    if (!slug) return of();
    return this.http.get<User>(this.baseUrl + 'user/profile/' + slug);
  }
  updateUserAvatar(formData) {
    let userAvatarRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: this.baseUrl + 'user/avatar',
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${userAvatarRequestId}`
    };
    let session = bghttp.session(`modify-user-avatar ${userAvatarRequestId}`);
    return session.multipartUpload(formData, request);
  }
  updateUser(formData) {
    return this.http.put(this.baseUrl + 'user', formData);
  }
  updateUserBanner(formData) {
    let userBannerRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: this.baseUrl + 'user/banner',
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${userBannerRequestId}`
    };
    let session = bghttp.session(`modify-user-banner ${userBannerRequestId}`);
    return session.multipartUpload(formData, request);
  }
  getUserQuestions(userId): Observable<QPage<Post>> {
    return this.http.get<QPage<Post>>(this.baseUrl + `user/${userId}/posts/poll/question`);
  }
}
