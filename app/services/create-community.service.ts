import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as bghttp from '@nativescript/background-http';
import { environment } from '~/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreateCommunityService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient,
    private authService: AuthService) { }
  createCommunity(formData) {
    let communityRequestId = Math.floor(Math.random() * 100);
    let request: bghttp.Request = {
      url: this.baseUrl + 'user/community',
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": 'Bearer ' + this.authService.getAccessToken()
      },
      description: `Uploading ${communityRequestId}`
    };
    let session = bghttp.session(`community-create ${communityRequestId}`);
    return session.multipartUpload(formData, request);
  }
}
