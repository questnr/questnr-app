import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { NormalPostData, PostActionForMedia } from '~/shared/models/post-action.model';
import * as bghttp from '@nativescript/background-http';
import { AuthService } from './auth.service';

@Injectable()
export class FeedService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  postFeed(formData, apiUrl: string): bghttp.Task {
    if (!apiUrl) return;
    let postRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: apiUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${postRequestId}`
    };
    let session = bghttp.session(`post-upload ${postRequestId}`);
    return session.multipartUpload(formData, request);
  }
  editPost(text: string, blogTitle: string, postId: number) {
    if (!postId) return of();
    return this.http.put(this.baseUrl + `user/posts/${postId}`, { text, blogTitle });
  }
  getPostText(postId: number): Observable<NormalPostData> {
    if (!postId) return of();
    return this.http.get<NormalPostData>(this.baseUrl + `post/data/${postId}`);
  }
  getFeeds(page, size = "4") {
    return this.http.get(this.baseUrl + 'user/feed', { params: { page: page, size: size } });
  }
  getPostMediaList(postId: number): Observable<PostActionForMedia> {
    return this.http.get<PostActionForMedia>(this.baseUrl + `user/posts/${postId}/media`);
  }
  likePost(postId) {
    if (!postId) return of();
    return this.http.post(this.baseUrl + `user/posts/${postId}/like`, {}, { observe: 'response' });
  }
  dislikePost(postId) {
    if (!postId) return of();
    return this.http.delete(this.baseUrl + `user/posts/${postId}/like`, { observe: 'response' });
  }
  getSharableLink(postId) {
    if (!postId) return of();
    return this.http.post(this.baseUrl + `post/${postId}/link`, {});
  }
  removePost(postId) {
    if (!postId) return of();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete(this.baseUrl + '/user/posts/' + postId, httpOptions);
  }
  visitPost(posts) {
    if (!posts) return of();
    return this.http.post(this.baseUrl + `user/posts/visit`, { posts: posts });
  }
}
