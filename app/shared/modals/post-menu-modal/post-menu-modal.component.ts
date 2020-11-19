import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { Dialogs, Page } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { CommunityService } from '~/services/community.service';
import { FeedService } from '~/services/feed.service';
import { PostMenuService } from '~/services/post-menu.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UserProfileService } from '~/services/user-profile.service';
import { Post, PostEditorType, PostType } from '~/shared/models/post-action.model';
import { RelationType } from '~/shared/models/relation-type';
import { SimplifiedPostType } from '~/shared/models/single-post.model';
import { qColors } from '~/_variables';
import { ReportPostModalComponent } from '../report-post-modal/report-post-modal.component';

@Component({
  selector: 'qn-post-menu-modal',
  templateUrl: './post-menu-modal.component.html',
  styleUrls: ['./post-menu-modal.component.scss']
})
export class PostMenuModalComponent implements OnInit {
  currentPost: Post;
  isLoading: boolean = false;
  qColors = qColors;
  isOwner: boolean = false;
  simplifiedPostType: SimplifiedPostType;
  simplifiedPostTypeClass = SimplifiedPostType;
  isCommunityPost: boolean = false;
  loggedInUserId: number;
  displayNameOfEntity: string;

  constructor(public postMenuService: PostMenuService,
    private authService: AuthService,
    public userInteractionService: UserInteractionService,
    private feedService: FeedService,
    private commonService: CommonService,
    private snackBarService: SnackBarService,
    private communityService: CommunityService,
    private userProfileService: UserProfileService,
    public viewContainerRef: ViewContainerRef,
    private modalService: ModalDialogService) { }

  ngOnInit() {
    this.postMenuService.postRequests$.subscribe((post: Post) => {
      this.currentPost = post;
      this.reset();
      if (this.currentPost) {
        this.loggedInUserId = this.authService.getStoredUserProfile().id;
        if (this.authService.isThisLoggedInUser(this.currentPost.userDTO.userId)) {
          this.isOwner = true;
        }

        if (typeof this.currentPost?.communityDTO.communityId != 'undefined') {
          this.isCommunityPost = true;
          this.displayNameOfEntity = this.currentPost.communityDTO.communityName;
        }
        else {
          this.displayNameOfEntity = this.currentPost.userDTO.username;
        }

        if (this.currentPost?.postData?.postEditorType) {
          if (this.currentPost?.postData.postEditorType === PostEditorType.blog) {
            this.simplifiedPostType = SimplifiedPostType.blog;
          } else if (this.currentPost?.postType === PostType.question) {
            this.simplifiedPostType = SimplifiedPostType.question;
          } else if (this.currentPost?.postType === PostType.simple) {
            this.simplifiedPostType = SimplifiedPostType.post;
          }
        }
      }
    });
  }

  reset(): void {
    this.isOwner = false;
    this.isCommunityPost = false;
  }

  onPageLoaded(args) {
    let page = args.object as Page;
    page.translateY = platformModule.Screen.mainScreen.heightDIPs;

    this.postMenuService.isShowing$.subscribe((showMenu) => {
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

  onPostEdit(): void {
    this.postMenuService.onRequestPostEdit(this.currentPost);
    this.close();
  }

  showUnfollowBtn(): boolean {
    if (this.currentPost.communityDTO?.communityId) {
      return !this.authService.isThisLoggedInUser(this.currentPost.communityDTO?.ownerUserDTO?.userId) &&
        (!this.isOwner && this.currentPost.communityDTO.communityMeta.relationShipType === RelationType.FOLLOWED);
    }
    return false;
  }

  unfollow(): void {
    let title = "Do you want to unfollow " + this.displayNameOfEntity + "?";
    Dialogs.confirm({
      title: title,
      okButtonText: "Unfollow",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result) {
        this.snackBarService.show({ snackText: 'Unfollowing...' });
        console.log("this.loggedInUserId", this.loggedInUserId);
        if (this.isCommunityPost) {
          this.communityService.unfollowCommunityService(this.currentPost.communityDTO.communityId, this.loggedInUserId).subscribe((res: any) => {
            this.snackBarService.show({ snackText: "Unfollowed " + this.currentPost.communityDTO.communityName });
          }, error => {
            this.snackBarService.show({ snackText: error.error.errorMessage });
          });
        } else {
          this.userProfileService.unfollowMe(this.loggedInUserId, this.currentPost.userDTO.userId).subscribe((res: any) => {
            this.snackBarService.show({ snackText: "Unfollowed " + this.currentPost.userDTO.username });
          }, error => {
            this.snackBarService.show({ snackText: error.error.errorMessage });
          });
        }
      }
    });
  }

  removePost(): void {
    Dialogs.confirm({
      title: "Are You Sure?",
      okButtonText: "Delete Post",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result && this.currentPost) {
        this.snackBarService.show({ snackText: 'Post is being deleted' });
        this.feedService.removePost(this.currentPost.postActionId).subscribe((res: any) => {
          this.close();
          this.snackBarService.show({ snackText: 'Post has been deleted' });
          this.postMenuService.onRequestPostDeletion(this.currentPost.postActionId);
        }, error => {
          if (error.error.errorMessage) {
            this.snackBarService.show({ snackText: error.error.errorMessage });
          } else {
            this.snackBarService.showSomethingWentWrong();
          }
        });
      }
    });
  }

  onCopyPostLink(): void {
    this.commonService.copyToClipboard(this.commonService.getPostSharableLink(this.currentPost)).then(() => {
      this.close();
    });
  }

  reportPost(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { postActionId: this.currentPost.postActionId }
    };
    this.close();
    this.modalService.showModal(ReportPostModalComponent, options).then((newPost: Post) => {
      // console.log("reportPost", newPost);
    });
  }

  close(): void {
    this.postMenuService.onRequestEnd();
  }
}
