import { Component, OnInit } from '@angular/core';
import { Dialogs, Page } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { FeedService } from '~/services/feeds.service';
import { PostMenuService } from '~/services/post-menu.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

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

  constructor(public postMenuService: PostMenuService,
    private authService: AuthService,
    public userInteractionService: UserInteractionService,
    private feedService: FeedService,
    private commonService: CommonService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.postMenuService.postRequests$.subscribe((post: Post) => {
      this.currentPost = post;
      this.reset();
      if (this.currentPost) {
        if (this.authService.isThisLoggedInUser(this.currentPost.userDTO.userId)) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }
      }
    });
  }

  reset(): void {
    this.isOwner = false;
  }

  onPageLoaded(args) {
    let page = args.object as Page;
    page.translateY = platformModule.Screen.mainScreen.heightDIPs;

    this.postMenuService.isShowing$.subscribe((showMenu) => {
      if (showMenu) {
        page.animate({
          duration: 500,
          translate: { x: 0, y: platformModule.Screen.mainScreen.heightDIPs - 200 },
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
      return !this.authService.isThisLoggedInUser(this.currentPost.communityDTO?.ownerUserDTO?.userId);
    }
    return false;
  }

  unfollow(): void {
  }

  removePost(): void {
    Dialogs.confirm({
      title: "Are You Sure?",
      okButtonText: "Delete Post",
      cancelButtonText: "Cancel",
    }).then((result) => {
      // result argument is boolean
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

  close(): void {
    this.postMenuService.onRequestEnd();
  }
}
