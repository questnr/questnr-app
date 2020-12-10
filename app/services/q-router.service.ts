import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from '~/shared/constants';

@Injectable()
export class QRouterService {
  userRouterRequest$: BehaviorSubject<string>;
  communityRouterRequest$: BehaviorSubject<string>;
  hashTagRouterRequest$: BehaviorSubject<string>;

  constructor(public routerExtensions: RouterExtensions) {
    this.userRouterRequest$ = new BehaviorSubject(null);
    this.communityRouterRequest$ = new BehaviorSubject(null);
    this.hashTagRouterRequest$ = new BehaviorSubject(null);
  }

  public onRequestUserRouter(userSlug: string) {
    this.userRouterRequest$.next(userSlug);
  }

  public onRequestCommunityRouter(communitySlug: string) {
    this.communityRouterRequest$.next(communitySlug);
  }

  public onRequestHashTagRouter(hashTagValue: string) {
    this.hashTagRouterRequest$.next(hashTagValue);
  }

  goToHome(tabIndex: number = 0, hashTagValue: string = ''): void {
    let queryParams = { tabIndex, q: hashTagValue };
    this.routerExtensions.navigate(
      ["/",
        GlobalConstants.homePath,
        {
          outlets: {
            feedTab: [GlobalConstants.feedPath],
            userPageTab: [GlobalConstants.userPath],
            explorePageTab: [GlobalConstants.explorePath],
            createCommunityPageTab: [GlobalConstants.createCommunityPath]
          }
        }], { clearHistory: true, queryParams: queryParams });
  }

  goToFeedTab(): void {
    this.goToHome(0);
  }

  goToExploreTab(hashTagValue: string = ''): void {
    this.goToHome(1, hashTagValue);
  }

  goToCreateCommunityTab(): void {
    this.goToHome(2);
  }

  goToUserProfileTab(): void {
    this.goToHome(3);
  }
}
