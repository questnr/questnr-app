import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '~/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostReportService {
    baseUrl: string = environment.baseUrl;
    constructor(public http: HttpClient) { }

    reportPost(postId, reportCategory, reportText) {
        if (!postId || !reportCategory) return of();
        return this.http.post(this.baseUrl + `user/posts/${postId}/report`, { reportCategory, reportText });
    }
};