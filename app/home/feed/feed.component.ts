import { Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { EventData } from '@nativescript-community/ui-image';
import { ListView, ScrollView } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { FeedService } from '~/services/feed.service';
import { PostMenuService } from '~/services/post-menu.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UtilityService } from '~/services/utility.service';
import { GlobalConstants } from '~/shared/constants';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  userFeeds: Post[] = [];
  pathLink = GlobalConstants.feedPath;
  page: number = 0;
  endOfPosts: boolean = false;
  userFeedListView: ListView;
  @ViewChildren(SimplePostComponent) simplePostComponentList!: QueryList<SimplePostComponent>;
  @ViewChild("container") container: ElementRef;
  scrollCached: any;
  feedComponentHelperTimeout: any;
  questionParentTypeClass = QuestionParentType;
  postTypeClass = PostType;
  pageSize = "10";
  qColors = qColors;
  feedSubscriber: Subscription;

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private userFeedService: FeedService,
    private ngZone: NgZone,
    public userInteractionService: UserInteractionService,
    public postMenuService: PostMenuService) {
  }

  ngOnInit(): void {
    this.getUserFeed();
    this.postMenuService.postDeleteRequest$.subscribe((postActionId: number) => {
      this.userFeeds = this.userFeeds.filter((feed: Post) => {
        return feed.postActionId !== postActionId;
      });
    });
  }

  ngOnDestroy(): void {
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

    // let index = 0;
    // container.eachLayoutChild((childView) => {
    //   const locationY = childView.getLocationRelativeTo(container).y;
    //   this.cards[index].isShown = locationY >= verticalOffset && locationY <= visibleRange
    //   index += 1;
    // });
  }

  onUserFeedListViewLoaded(args): void {
    this.userFeedListView = args.object as ListView;
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
    this.userFeedService.getFeeds(this.page, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          this.page++;
          feedPage.content.forEach(post => {
            this.userFeeds.push(post);
          });

          // If the page was 0, then feedComponentHelper would have been called
          // if (this.page - 1 == 0) {
          //   setTimeout(() => {
          //     this.feedComponentHelper();
          //   }, 1000);
          //   this.feedNotificationRef.setLastPostId(this.userFeeds[0].postActionId);
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
    this.userFeedService.getFeeds(0, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          // this.page++;

          let postExists = [];
          feedPage.content.forEach((newPost: Post) => {
            this.userFeeds.forEach((feed: Post) => {
              if (newPost.postActionId === feed.postActionId) {
                postExists.push(newPost.postActionId);
              }
            });
          });
          // let newPost = Number(this.pageSize) - postExists.length;
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

  onPostCreationBoxLoaded(args): void {
    // this.postCreationBox = args.object as CreatePostComponent;
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

  templateSelector(feed, index, items) {
    return feed.postType;
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
}
