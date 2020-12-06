import { Component, ElementRef, Input, NgZone, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventData, FinalEventData, Img } from '@nativescript-community/ui-image';
import { ScrollView } from '@nativescript/core';
import { combineLatest, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserActivityService } from '~/services/user-activity.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UserProfilePageService } from '~/services/user-profile-page.service';
import { UserProfileService } from '~/services/user-profile.service';
import { UtilityService } from '~/services/utility.service';
import { QuestionListCardComponent } from '~/shared/components/question-list-card/question-list-card.component';
import { UserActivityComponent } from '~/shared/components/user-activity/user-activity.component';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { User, UserInfo } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  @Input() userSlug: string;
  user: User;
  defaultSrc: string = StaticMediaSrc.userFile;
  defaultBanner: string = StaticMediaSrc.communityFile;
  isLoading: boolean = false;
  isOwner: boolean = false;
  userFeeds: Post[] = [];
  pageNumber: number = 0;
  endOfPosts: boolean = false;
  @ViewChildren(SimplePostComponent) simplePostComponentList!: QueryList<SimplePostComponent>;
  @ViewChild("container") container: ElementRef;
  scrollCached: any;
  feedComponentHelperTimeout: any;
  questionParentTypeClass = QuestionParentType;
  postTypeClass = PostType;
  pageSize = "4";
  userInfo: UserInfo;
  qColors = qColors;
  scrollView: ScrollView;
  feedSubscriber: Subscription;
  modifiedUserAvatarPath: string;
  modifiedUserBannerPath: string;

  userAvatarView: any;
  userBannerView: any;
  showAvatar: boolean = true;

  userActivityCompRef: UserActivityComponent;
  @ViewChild("userActivityComp")
  set userActivityComp(userActivityCompRef: UserActivityComponent) {
    this.userActivityCompRef = userActivityCompRef;
  }
  questionListCardCompRef: QuestionListCardComponent;
  @ViewChild('questionListCardComp')
  set questionListCardComp(questionListCardCompRef: QuestionListCardComponent) {
    this.questionListCardCompRef = questionListCardCompRef;
  }

  constructor(
    public viewContainerRef: ViewContainerRef,
    private userProfilePageService: UserProfilePageService,
    private route: ActivatedRoute,
    private userFollowersService: UserProfileService,
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private userActivityService: UserActivityService,
    private utilityService: UtilityService,
    public userInteractionService: UserInteractionService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService) {
    this.route.data.subscribe((data) => {
      // if (data.isOwner) {
      this.isOwner = true;
      // this.user = this.authService.getUser();
      // this.afterReceivingUser(true);
      // } else if (this.userSlug) {
      this.userSlug = this.authService.getStoredUserProfile().slug;
      this.getUserProfileDetails(true);
      // }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.cancelIfAnyCurrentFeedSubscription();
  }

  refreshList(args) {
    const pullRefresh = args.object;
    setTimeout(() => {
      this.refreshUserFeed();
      pullRefresh.refreshing = false;
    }, 1000);
  }

  onScroll(event: EventData): void {
    if (!this.scrollCached) {
      setTimeout(() => {
        const scrollView = <ScrollView>event.object,
          verticalOffset = scrollView.verticalOffset,
          scrollableHeight = scrollView.scrollableHeight,
          height = scrollView.getActualSize().height,
          visibleRange = verticalOffset + height;
        this.feedComponentHelper(visibleRange, verticalOffset);
        if (visibleRange >= scrollableHeight - 300) {
          if (this.userFeeds.length > 0 && !this.endOfPosts) {
            if (!this.isLoading) {
              this.getUserFeed();
            }
          }
        }
        this.scrollCached = null;
      }, 100);
    }
    this.scrollCached = event;
  }

  getUserProfileDetails(fetchUser: boolean = false) {
    let subscriberList = [];
    const userInforSubscriber = this.userActivityService.getUserInfo(this.userSlug).pipe(catchError((error: any) => {
      // console.log(error.error.errorMessage);
      return of(null);
    }));
    if (fetchUser) {
      const userSubscriber = this.userProfilePageService.getUserProfile(this.userSlug).pipe(catchError((error: any) => {
        // console.log(error.error.errorMessage);
        return of(null);
      }));
      subscriberList.push(userSubscriber);
    }
    subscriberList.push(userInforSubscriber);

    combineLatest(subscriberList).subscribe(
      (responseList) => {
        if (fetchUser) {
          this.user = responseList[0] as User;
          this.userInfo = responseList[1] as UserInfo;
        } else {
          this.userInfo = responseList[0] as UserInfo;
        }
        this.afterReceivingUser(true);
      });
  }

  afterReceivingUser(callFromConstructor: boolean = false): void {
    this.restartUserFeeds(callFromConstructor);
    this.userActivityCompRef.setData(this.user, this.userInfo);
    this.questionListCardCompRef.setUserData(this.user);
    this.questionListCardCompRef.setTotalQuestion(this.userInfo.totalQuestions);
  }

  restartUserFeeds(callFromConstructor: boolean = false) {
    this.userFeeds = [];
    this.pageNumber = 0;
    this.getUserFeed();
  }

  cancelIfAnyCurrentFeedSubscription(): void {
    // If already feed is being fetched, stop the thread
    if (this.feedSubscriber) {
      this.feedSubscriber.unsubscribe();
    }
  }

  getUserFeed() {
    this.cancelIfAnyCurrentFeedSubscription();
    this.isLoading = true;
    this.feedSubscriber = this.userProfilePageService.getUserFeeds(this.user.userId, this.pageNumber, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          this.pageNumber++;
          feedPage.content.forEach(post => {
            this.userFeeds.push(post);
          });

          // If the page was 0, then feedComponentHelper would have been called
          // if (this.pageNumber - 1 == 0) {
          //   setTimeout(() => {
          //     this.feedComponentHelper();
          //   }, 1000);
          //   this.feedNotificationRef.setLastPostId(this.communityFeeds[0].postActionId);
          // }
        } else {
          this.endOfPosts = true;
        }
        this.isLoading = false;
      }, err => {
        // console.log("err", err);
        this.isLoading = false;
      }
    );
  }

  refreshUserFeed() {
    this.cancelIfAnyCurrentFeedSubscription();
    this.feedSubscriber = this.userProfilePageService.getUserFeeds(this.user.userId, this.pageNumber, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          // this.pageNumber++;

          let postExists = [];
          feedPage.content.forEach((newPost: Post) => {
            this.userFeeds.forEach((feed: Post) => {
              if (newPost.postActionId === feed.postActionId) {
                postExists.push(newPost.postActionId);
              }
            });
          });
          // let newPost = Number(this.pageNumberSize) - postExists.length;
          // console.log("postExists.length", postExists.length, newPost);
          if (postExists.length == 0) {
            this.userFeeds = [];
            feedPage.content.forEach(post => {
              this.userFeeds.push(post);
            });
          } else {
            let index = 0;
            let spliceIndex = 0;
            feedPage.content.forEach((post: Post) => {
              if (postExists[index] == post.postActionId) {
                index++;
              } else {
                this.userFeeds.splice(spliceIndex, 0, post);
                spliceIndex++;
              }
            });
          }
        }
      }, err => {
        // console.log("err", err);
      }
    );
  }

  feedComponentHelper = (visibleRange, verticalOffset) => {
    // if (!this.feedComponentHelperTimeout) {
    this.simplePostComponentList.forEach((simplePostComponent: SimplePostComponent, index: number) => {
      const locationY = simplePostComponent.container.nativeElement.getLocationOnScreen().y;
      // console.log("locationY", index,
      //   locationY, verticalOffset, visibleRange);
      simplePostComponent.onViewPort(locationY > 0 && locationY >= verticalOffset && locationY <= visibleRange);
    });
    // setTimeout(() => {
    //   this.feedComponentHelperTimeout = false;
    // }, 100);
    // }
    // this.feedComponentHelperTimeout = true;
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  // user banner
  onUserBannerFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultBanner;
  }

  // user avatar
  onUserAvatarFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  onScrollViewLoaded(args) {
    this.scrollView = args.object as ScrollView;
  }

  handlePostCreation(newPost: Post) {
    this.ngZone.run(() => {
      // console.log("handlePostCreation", !!newPost)
      if (typeof newPost === 'undefined') return;
      if (this.userFeeds?.length) {
        this.userFeeds.splice(0, 0, newPost);
        // console.log("Added 1");
      } else {
        this.userFeeds = [newPost];
        // console.log("Added 2");
      }
    });
  }

  handlePostEditing(editedPost: Post) {
    this.ngZone.run(() => {
      if (typeof editedPost === 'undefined') return;
      if (this.userFeeds?.length) {
        this.userFeeds.forEach((feed: Post, index: number) => {
          if (feed.postActionId === editedPost.postActionId) {
            this.userFeeds[index] = editedPost;
          }
        });
      }
    });
  }

  onUserAvatarViewLoaded(args) {
    this.userAvatarView = args.object;
  }

  onUserBannerViewLoaded(args) {
    this.userBannerView = args.object;
  }

  onUserBannerTap(args) {
    if (this.showAvatar) {
      this.userAvatarView.animate({
        opacity: 0,
        duration: 700
      }).then(() => {
        this.showAvatar = false;
      });
    } else {
      this.userAvatarView.animate({
        opacity: 1,
        duration: 700
      }).then(() => {
        this.showAvatar = true;
      });
    }
  }

  onUserDetailsEdit(args): void {

  }
}
