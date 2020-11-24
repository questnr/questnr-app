import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '~/environments/environment';
import { CommunityProfileMeta } from '~/shared/models/community.model';
@Injectable({
  providedIn: 'root'
})
export class CommunityActivityService {
  baseUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getCommunityMetaInfo(communitySlug): Observable<CommunityProfileMeta> {
    if (!communitySlug) return of();
    return this.http.get<CommunityProfileMeta>(this.baseUrl + `/community/meta/${communitySlug}/info`);
  }
}
