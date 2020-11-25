import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import * as SocialShare from "nativescript-social-share-ns-7";
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { CommunityMenuService } from '~/services/community-menu.service';
import { CommunityService } from '~/services/community.service';
import { FeedService } from '~/services/feed.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { Community } from '~/shared/models/community.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-menu-modal',
  templateUrl: './community-menu-modal.component.html',
  styleUrls: ['./community-menu-modal.component.scss']
})
export class CommunityMenuModalComponent implements OnInit {
  qColors = qColors;
  currentCommunity: Community;
  isLoading: boolean = false;
  isOwner: boolean = false;
  isCommunityPost: boolean = false;
  loggedInUserId: number;

  constructor(public communityMenuService: CommunityMenuService,
    private authService: AuthService,
    public userInteractionService: UserInteractionService,
    private feedService: FeedService,
    private commonService: CommonService,
    private snackBarService: SnackBarService,
    private communityService: CommunityService,
    public viewContainerRef: ViewContainerRef,
    private modalService: ModalDialogService) { }

  ngOnInit() {
    this.communityMenuService.communityRequests$.subscribe((community: Community) => {
      this.currentCommunity = community;
      if (this.currentCommunity) {
        this.loggedInUserId = this.authService.getStoredUserProfile().id;
        this.isOwner = this.authService.isThisLoggedInUser(this.currentCommunity.ownerUserDTO.userId);
      } else {
        this.isOwner = false;
      }
    });
  }

  onPageLoaded(args) {
    let page = args.object as Page;
    page.translateY = platformModule.Screen.mainScreen.heightDIPs;

    this.communityMenuService.isShowing$.subscribe((showMenu) => {
      if (showMenu) {
        page.animate({
          duration: 500,
          translate: { x: 0, y: platformModule.Screen.mainScreen.heightDIPs - 250 },
          curve: new CubicBezierAnimationCurve(.04, .84, .84, 1.42)
        });
      } else {
        page.animate({
          duration: 500,
          translate: { x: 0, y: platformModule.Screen.mainScreen.heightDIPs },
          curve: new CubicBezierAnimationCurve(.04, .84, .84, 1.42)
        });
      }
    })
  }

  onCommunityEdit(): void {
    this.communityMenuService.onRequestCommunityEdit(this.currentCommunity);
    this.close();
  }

  onCommunityShare(): void {
    SocialShare.shareUrl(this.commonService.getCommunitySharableLink(this.currentCommunity.slug), "Questnr Community");
    this.close();
  }

  onCopyCommunityLink(): void {
    this.commonService.copyToClipboard(this.commonService.getCommunitySharableLink(this.currentCommunity.slug)).then(() => {
      this.close();
    });
  }

  // reportCommunity(): void {
  //   const options: ModalDialogOptions = {
  //     viewContainerRef: this.viewContainerRef,
  //     fullscreen: false,
  //     context: { communityId: this.currentCommunity.communityId }
  //   };
  //   this.close();
  //   this.modalService.showModal(ReportPostModalComponent, options).then((newPost: Post) => {
  //     // console.log("reportPost", newPost);
  //   });
  // }

  close(): void {
    this.communityMenuService.onRequestEnd();
  }
}
