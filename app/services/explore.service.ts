import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  explore(page, size = "4") {
    return this.http.get(this.baseUrl + '/user/explore', { params: { page: page, size: size } });
  }

  getHashtagPost(hashTags, page) {
    if (!hashTags) return of();
    return this.http.get(this.baseUrl + '/user/hash-tag/posts', { params: { page, hashTags: hashTags } });
  }

}
