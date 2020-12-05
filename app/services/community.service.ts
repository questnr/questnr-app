import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as bghttp from '@nativescript/background-http';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { MetaTagCard } from '~/shared/models/common.model';
import { Community, CommunityPrivacy, CommunityProfileMeta, CommunityPublic, CommunityRequestActionType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { RelationType } from '~/shared/models/relation-type';
import { User } from '~/shared/models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,
    private authService: AuthService) {
  }

  isAllowedIntoCommunity(community: Community): boolean {
    return this.isAllowedIntoCommunityWithRelationType(community.communityPrivacy, community.communityMeta.relationShipType);
  }

  isAllowedIntoCommunityWithRelationType(communityPrivacy: CommunityPrivacy, relationShipType: RelationType): boolean {
    if (communityPrivacy === CommunityPrivacy.pri &&
      (relationShipType === RelationType.OWNED ||
        relationShipType === RelationType.FOLLOWED)) {
      return true;
    }
    if (communityPrivacy == CommunityPrivacy.pub) {
      return true;
    }
    return false;
  }

  getCommunityDetails(slug): Observable<CommunityPublic> {
    if (!slug) {
      return of();
    }
    return this.http.get<CommunityPublic>(this.baseUrl + 'community/' + slug);
  }

  getCommunityUserList(slug) {
    if (!slug) {
      return of();
    }
    return this.http.get(this.baseUrl + 'user/community/' + slug + '/users');
  }

  getCommunityFeeds(id, page, size = "4") {
    if (!id) {
      return of();
    }
    return this.http.get(this.baseUrl + 'user/community/' + id + '/posts', { params: { page: page, size: size } });
  }

  updateCommunityAvatar(formData, communityId) {
    let communityAvatarRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: this.baseUrl + `user/community/${communityId}/avatar`,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${communityAvatarRequestId}`
    };
    let session = bghttp.session(`modify-community-avatar ${communityAvatarRequestId}`);
    return session.multipartUpload(formData, request);
  }

  followCommunity(id) {
    if (!id) {
      return of();
    }
    return this.http.post(this.baseUrl + 'user/join/community/' + id, '');
  }

  unfollowCommunityService(communityId, userId) {
    if (!communityId || !userId) {
      of();
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete(this.baseUrl + `user/${userId}/join/community/${communityId}`, httpOptions);
  }

  getCommunityMetaCard(communitySlug: string): Observable<MetaTagCard> {
    if (!communitySlug) {
      return of();
    }
    return this.http.get<MetaTagCard>(this.baseUrl + 'community/meta-information/' + communitySlug);
  }

  getSharableLink(communityId) {
    if (!communityId) {
      return of();
    }
    return this.http.get(this.baseUrl + `user/community/${communityId}/link`, {});
  }

  getCommunityJoinRequests(communityId, page) {
    if (!communityId) {
      return of();
    }
    return this.http.get<QPage<User>>(this.baseUrl + 'user/community/' + communityId + '/users/request', { params: { page } });
  }

  joinRequestResponse(communityId, userId, requestType: CommunityRequestActionType) {
    if (!communityId || !userId) {
      return of();
    }
    if (requestType === CommunityRequestActionType.accept) {
      return this.http.post(this.baseUrl + `user/community/${communityId}/users/${userId}/request`, {});
    }
    if (requestType === CommunityRequestActionType.reject) {
      return this.http.delete(this.baseUrl + `user/community/${communityId}/users/${userId}/request`);
    }
  }

  toggleCommunityPrivacy(communityId, communityPrivacy: CommunityPrivacy) {
    if (!communityPrivacy || !communityId) {
      return of();
    }
    return this.http.put(this.baseUrl + `user/community/${communityId}/privacy`, { communityPrivacy });
  }
  deleteUsersOwnPendingCommunityJoinRequests(communityId) {
    if (!communityId) {
      of();
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {}
    };
    return this.http.delete(this.baseUrl + `user/community/${communityId}/users/request`, httpOptions);
  }
  getCommunityDetailsById(communityId) {
    if (!communityId) {
      of();
    }
    return this.http.get(this.baseUrl + `user/community/${communityId}`);
  }

  getCommunityMetaInfoWithParams(communitySlug, params): Observable<CommunityProfileMeta> {
    if (!communitySlug) return of();
    return this.http.get<CommunityProfileMeta>(this.baseUrl + `/community/meta/${communitySlug}/info/params`, { params: { params } });
  }

  isOwner(community: Community) {
    return community?.communityMeta.relationShipType === RelationType.OWNED;
  }
}

