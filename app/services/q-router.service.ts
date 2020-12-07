import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { GlobalConstants } from '~/shared/constants';

@Injectable()
export class QRouterService {
  constructor(public routerExtensions: RouterExtensions) { }

  goToHome(tabIndex: number = 0): void {
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
        }], { clearHistory: true, queryParams: { tabIndex } });
  }

  goToFeedTab(): void {
    this.goToHome(0);
  }

  goToExploreTab(): void {
    this.goToHome(1);
  }

  goToCreateCommunityTab(): void {
    this.goToHome(2);
  }

  goToUserProfileTab(): void {
    this.goToHome(3);
  }
}
