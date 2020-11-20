import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';
import * as bghttp from '@nativescript/background-http';
import { AuthService } from './auth.service';

@Injectable()
export class CommentSectionService {
  baseUrl = environment.baseUrl;
  maxCommentWithPostCount: number = 2;

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getMaxCommentWithPostCount() {
    return this.maxCommentWithPostCount;
  }

  getComments(postId, page) {
    if (!postId) return of();
    return this.http.get(this.baseUrl + `user/posts/${postId}/comment`, { params: { page } });
  }
  likeComment(commentId) {
    if (!commentId) return of();
    return this.http.post(this.baseUrl + `user/posts/comment/${commentId}/like`, {});
  }
  dislikeComment(commentId) {
    if (!commentId) return of();
    return this.http.delete(this.baseUrl + `user/posts/comment/${commentId}/like`);
  }
  postComment(postId, formData): bghttp.Task {
    if (!postId || !formData) return;
    let commentRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: `${this.baseUrl}user/posts/${postId}/comment`,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${commentRequestId}`
    };
    let session = bghttp.session(`comment-upload ${commentRequestId}`);
    return session.multipartUpload(formData, request);
  }

  postNormalComment(postId, data) {
    if (!postId) return of();
    return this.http.post(this.baseUrl + `user/posts/${postId}/comment/normal`, data);
  }

  deleteComment(postId, commentId) {
    if (!postId || !commentId) return of();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete(this.baseUrl + `user/posts/${postId}/comment/${commentId}`, httpOptions);
  }
}
