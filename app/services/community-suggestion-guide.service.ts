import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';
import { Community } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { UserInterest } from '~/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommunitySuggestionGuideService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) { }

  searchUserInterest(interestString: string) {
    return this.http.get<UserInterest[]>(this.baseUrl + 'user/search/interest', { params: { interestString: interestString } });
  }

  skipCommunitySuggestionGuide() {
    return this.http.delete(this.baseUrl + 'user/interest');
  }

  getCommunitySuggestionsForGuide(page, userInterests: string) {
    if (!userInterests) of();
    return this.http.post<QPage<Community>>(this.baseUrl + 'user/community/suggestion/guide', { userInterests: userInterests });
  }
}
