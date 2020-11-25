import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InviteUserService {

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    getInviteUserList(communityId, page) {
        if (!communityId) return of();
        return this.http.get(this.baseUrl + `user/join/community/${communityId}/users`, { params: { page } });
    }

    inviteUser(communityId, userId) {
        if (!communityId || !userId) return of();
        return this.http.post(this.baseUrl + `user/join/community/${communityId}/invite`, { userId });
    }
}
