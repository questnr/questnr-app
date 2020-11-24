import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventData, FinalEventData, Img } from '@nativescript-community/ui-image';
import { ScrollView } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { CommunityActivityService } from '~/services/community-activity.service';
import { CommunityMembersService } from '~/services/community-members.service';
import { CommunityService } from '~/services/community.service';
import { PostMenuService } from '~/services/post-menu.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UtilityService } from '~/services/utility.service';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { CommunityMembersComponent } from '~/shared/containers/community-members/community-members.component';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { Community, CommunityPrivacy, CommunityProfileMeta } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { RelationType } from '~/shared/models/relation-type';
import { UserListType } from '~/shared/models/user-list.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-page',
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit {
  communitySlug: string;
  community: Community;
  defaultSrc: string = StaticMediaSrc.communityFile;
  isLoading: boolean = false;
  isOwner: boolean = false;
  communityFeeds: Post[] = [];
  page: number = 0;
  endOfPosts: boolean = false;
  @ViewChildren(SimplePostComponent) simplePostComponentList!: QueryList<SimplePostComponent>;
  @ViewChild("container") container: ElementRef;
  scrollCached: any;
  feedComponentHelperTimeout: any;
  questionParentTypeClass = QuestionParentType;
  postTypeClass = PostType;
  pageSize = "4";
  qColors = qColors;
  pendingRequests: number;
  isCommunityPrivate = false;
  explorePath = GlobalConstants.explorePath;
  isAllowedIntoCommunity: boolean;
  feedSubscriber: Subscription;
  userListTypeClass = UserListType;
  // communitySubject = new Subject<Community>();
  communityInfo: CommunityProfileMeta;
  relationType: RelationType;
  communityMemeberCompRef: CommunityMembersComponent;
  @ViewChild('communityMemeberComp')
  set communityMemeberComp(communityMemeberCompRef: CommunityMembersComponent) {
    this.communityMemeberCompRef = communityMemeberCompRef;
  }
  // questionListRef: UserQuestionListComponent;
  // @ViewChild("questionList")
  // set questionList(questionListRef: UserQuestionListComponent) {
  //   this.questionListRef = questionListRef;
  // }
  // communityActivityRef: CommunityActivityComponent;
  // @ViewChild("communityActivity")
  // set communityActivity(communityActivityRef: CommunityActivityComponent) {
  //   this.communityActivityRef = communityActivityRef;
  // }

  constructor(public viewContainerRef: ViewContainerRef,
    private postMenuService: PostMenuService,
    public communityService: CommunityService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    public userInteractionService: UserInteractionService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService,
    private communityActivityService: CommunityActivityService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.communitySlug = params.get('communitySlug');
      // console.log("communitySlug", this.communitySlug);
      this.communityService.getCommunityDetails(this.communitySlug)
        .subscribe((community: Community) => {
          this.community = community;
          this.relationType = this.community.communityMeta.relationShipType;
          this.restartCommunityFeeds(true);

          this.communityMemeberCompRef.setCommunity(this.community);
        });
    });
  }

  ngOnInit(): void {
    this.postMenuService.postDeleteRequest$.subscribe((postActionId: number) => {
      this.communityFeeds = this.communityFeeds.filter((feed: Post) => {
        return feed.postActionId !== postActionId;
      });
    });
  }

  ngAfterViewInit() {
    // this.communityActivityRef.setCommunity(this.communityDTO);
    // this.questionListRef?.setCommunityData(this.communityDTO, this.communityService.isAllowedIntoCommunity(this.communityDTO));
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
          if (this.communityFeeds.length > 0 && !this.endOfPosts) {
            if (!this.isLoading) {
              this.getCommunityFeed();
            }
          }
        }
        this.scrollCached = null;
      }, 100);
    }
    this.scrollCached = event;

    // let index = 0;
    // container.eachLayoutChild((childView) => {
    //   const locationY = childView.getLocationRelativeTo(container).y;
    //   this.cards[index].isShown = locationY >= verticalOffset && locationY <= visibleRange
    //   index += 1;
    // });
  }

  restartCommunityFeeds(callFromConstructor: boolean = false) {
    // this.ngOnInit();
    // this.getCommunityDetailsById();
    this.isAllowedIntoCommunity = this.communityService.isAllowedIntoCommunity(this.community);

    this.isOwner = this.communityService.isOwner(this.community);

    // No need to re-fetch feeds again if the community is not private.
    if (!callFromConstructor && this.community.communityPrivacy == CommunityPrivacy.pub) return;

    this.communityFeeds = [];
    this.page = 0;

    this.getCommunityFeed();
  }

  cancelIfAnyCurrentFeedSubscription(): void {
    // If already feed is being fetched, stop the thread
    if (this.feedSubscriber) {
      this.feedSubscriber.unsubscribe();
    }
  }

  getCommunityFeed() {
    this.cancelIfAnyCurrentFeedSubscription();
    this.isLoading = true;
    this.feedSubscriber = this.communityService.getCommunityFeeds(this.community.communityId, this.page, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          this.page++;
          feedPage.content.forEach(post => {
            this.communityFeeds.push(post);
          });

          // If the page was 0, then feedComponentHelper would have been called
          // if (this.page - 1 == 0) {
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
    this.feedSubscriber = this.communityService.getCommunityFeeds(this.community.communityId, this.page, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          // this.page++;

          let postExists = [];
          feedPage.content.forEach((newPost: Post) => {
            this.communityFeeds.forEach((feed: Post) => {
              if (newPost.postActionId === feed.postActionId) {
                postExists.push(newPost.postActionId);
              }
            });
          });
          // let newPost = Number(this.pageSize) - postExists.length;
          // console.log("postExists.length", postExists.length, newPost);
          if (postExists.length == 0) {
            this.communityFeeds = [];
            feedPage.content.forEach(post => {
              this.communityFeeds.push(post);
            });
          } else {
            let index = 0;
            let spliceIndex = 0;
            feedPage.content.forEach((post: Post) => {
              if (postExists[index] == post.postActionId) {
                index++;
              } else {
                this.communityFeeds.splice(spliceIndex, 0, post);
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

  getCommunityInfo() {
    this.isLoading = true;
    this.communityActivityService.getCommunityMetaInfo(this.communitySlug).subscribe((res: CommunityProfileMeta) => {
      this.communityInfo = res;
      // this.communityActivityRef.setCommunityInfo(this.communityInfo);
      // this.questionListRef.setTotalCounts(this.communityInfo.totalQuestions);
      // this.communityHorizontalCardRef?.setCommunityInfo(this.communityInfo);
      if (this.isOwner) {
        this.pendingRequests = this.communityInfo.totalRequests;
      }
    }, error => {
    });
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

  handlePostCreation(newPost: Post) {
    this.ngZone.run(() => {
      // console.log("handlePostCreation", !!newPost)
      if (typeof newPost === 'undefined') return;
      if (this.communityFeeds?.length) {
        this.communityFeeds.splice(0, 0, newPost);
        // console.log("Added 1");
      } else {
        this.communityFeeds = [newPost];
        // console.log("Added 2");
      }
    });
  }

  handlePostEditing(editedPost: Post) {
    this.ngZone.run(() => {
      if (typeof editedPost === 'undefined') return;
      if (this.communityFeeds?.length) {
        this.communityFeeds.forEach((feed: Post, index: number) => {
          if (feed.postActionId === editedPost.postActionId) {
            this.communityFeeds[index] = editedPost;
          }
        });
      }
    });
  }

  copyLinkOfCommunity(args): void {
    this.snackBarService.show({ snackText: 'Link copied to clipboard' });
  }

  onRelationChangeEvent($event: RelationType) {
    this.relationType = $event;
    this.community.communityMeta.relationShipType = $event;
    // console.log("actionEvent", $event);
    // this.communityUsersComponentRef.ngOnInit();
    this.restartCommunityFeeds();
  }

  // community avatar
  onFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }
}
