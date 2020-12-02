import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import * as SocialShare from "nativescript-social-share-ns-7";
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { CommunityMenuService } from '~/services/community-menu.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { Community, CommunityPrivacy } from '~/shared/models/community.model';
import { qColors } from '~/_variables';
import { CommunityPrivacyChangeModalComponent } from '../community-privacy-change-modal/community-privacy-change-modal.component';

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
  communityPrivacyClass = CommunityPrivacy;

  constructor(public communityMenuService: CommunityMenuService,
    private authService: AuthService,
    public userInteractionService: UserInteractionService,
    private commonService: CommonService,
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
          translate: { x: 0, y: platformModule.Screen.mainScreen.heightDIPs - 300 },
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

  onCommunityPrivacyChangeRequest(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        community: this.currentCommunity
      }
    };
    this.close();
    this.modalService.showModal(CommunityPrivacyChangeModalComponent, options).then((community: Community) => {
      if (community)
        this.communityMenuService.onRequestCommunityRefresh(community);
    });
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
