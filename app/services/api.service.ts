import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { Community } from '~/shared/models/community.model';
import { HashTag } from '~/shared/models/hashtag.model';
import { NotificationDTO } from '~/shared/models/notification.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Injectable()
export class ApiService {

  baseUrl = environment.baseUrl;

  activeAuth = 'login';

  constructor(private http: HttpClient) { }

  getTopHashtags() {
    // return this.http.get(this.baseUrl + 'hash-tag-with-highest-rank');
    return this.http.get(this.baseUrl + 'trending-hash-tag-list');
  }
  getTopUsers() {
    return this.http.get(this.baseUrl + 'users-with-highest-rank');
  }
  getUserOwnedCommunity(userId, page): Observable<QPage<Community>> {
    if (!userId) return of();
    return this.http.get<QPage<Community>>(this.baseUrl + 'user/' + userId + '/community', { params: { page } });
  }
  getJoinedCommunities(userId, page) {
    if (!userId) return of();
    return this.http.get(this.baseUrl + `user/${userId}/join/community`, { params: { page } });
  }
  getSuggestedCommunities() {
    return this.http.get(this.baseUrl + 'community/suggested-community-list');
  }
  getTrendingCommunities() {
    return this.http.get(this.baseUrl + 'community/trending-community-list');
  }
  getTrendingPostPollQuestion() {
    return this.http.get(this.baseUrl + 'user/explore/question');
  }
  searchHashtags(page, userInput: string) {
    return this.http.get<QPage<HashTag>>(this.baseUrl + `search/hash-tag`, { params: { page: page, hashTag: userInput } });
  }
  searchUsers(page, userInput: string) {
    return this.http.get<QPage<User>>(this.baseUrl + `user/search/users`, { params: { page: page, userString: userInput } });
  }
  searchCommunities(page, userInput: string) {
    return this.http.get<QPage<Community>>(this.baseUrl + `user/search/communities`, { params: { page: page, communityString: userInput } });
  }
  getNotifications(page: any = 0) {
    return this.http.get<NotificationDTO[]>(this.baseUrl + 'user/notification', { params: { page } });
  }
  getNotificationAnswers(page: any = 0) {
    return this.http.get<NotificationDTO[]>(this.baseUrl + 'user/notification/answer', { params: { page } });
  }
  removeNotification(id) {
    if (!id) return of();
    return this.http.delete(this.baseUrl + 'user/notification/' + id, { observe: 'response' });
  }
  registerPushNotificationToken(token: string) {
    return this.http.post(this.baseUrl + 'user/push-notification/token', { token: token });
  }
  readNotification(notificationId) {
    return this.http.put(this.baseUrl + `user/notification/${notificationId}`, {});
  }
  getUnreadNotificationCount() {
    return this.http.get<number>(this.baseUrl + `user/unread-notification`);
  }
  getUnreadNotificationAnswerCount() {
    return this.http.get<number>(this.baseUrl + `user/unread-notification/answer`);
  }
  // deletePushNotificationToken(token: string) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: { token: token }
  //   };
  //   return this.http.delete(this.baseUrl + 'push-notification/token', httpOptions);
  // }
  refreshPushNotificationToken(currentToken: string, refreshedToken: string) {
    return this.http.post(this.baseUrl + 'user/push-notification/refresh-token',
      { expiredToken: currentToken, token: refreshedToken }
    );
  }
  getCommunityPostsUsingPosts(communityId, posts: string) {
    return this.http.get(this.baseUrl + `user/community/${communityId}/notification/posts`, { params: { posts } });
  }
  getUserFeedPostsUsingPosts(posts: string) {
    return this.http.get(this.baseUrl + `user/feed/notification/posts`, { params: { posts } });
  }

  getCommunityPostsUsingLastId(communityId, lastPostId) {
    return this.http.get(this.baseUrl + `user/community/${communityId}/notification/last/posts`, { params: { lastPostId } });
  }
  getUserFeedPostsUsingLastId(lastPostId) {
    return this.http.get(this.baseUrl + `user/feed/notification/last/posts`, { params: { lastPostId } });
  }
}
