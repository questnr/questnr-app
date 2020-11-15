import { Component, OnInit } from '@angular/core';
import { Page } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { AuthService } from '~/services/auth.service';
import { FeedService } from '~/services/feeds.service';
import { PostMenuService } from '~/services/post-menu.service';
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
    private feedService: FeedService) { }

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
  showUnfollowBtn(): boolean {
    if (this.currentPost.communityDTO?.communityId) {
      return !this.authService.isThisLoggedInUser(this.currentPost.communityDTO?.ownerUserDTO?.userId);
    }
    return false;
  }

  unfollow(): void {
  }
  close(): void {
    this.postMenuService.onRequestEnd();
  }
}
