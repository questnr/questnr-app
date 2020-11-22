import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { EventData } from '@nativescript-community/ui-image';
import { ScrollView } from '@nativescript/core';
import { ExploreService } from '~/services/explore.service';
import { PostMenuService } from '~/services/post-menu.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UtilityService } from '~/services/utility.service';
import { GlobalConstants } from '~/shared/constants';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit {
  isLoading: boolean = false;
  userExploreFeeds: Post[] = [];
  pathLink = GlobalConstants.feedPath;
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

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private exploreService: ExploreService,
    private ngZone: NgZone,
    public userInteractionService: UserInteractionService,
    public postMenuService: PostMenuService) {
  }

  ngOnInit(): void {
    this.getExploreFeed();
    this.postMenuService.postDeleteRequest$.subscribe((postActionId: number) => {
      this.userExploreFeeds = this.userExploreFeeds.filter((feed: Post) => {
        return feed.postActionId !== postActionId;
      });
    });
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
          if (this.userExploreFeeds.length > 0 && !this.endOfPosts) {
            if (!this.isLoading) {
              this.getExploreFeed();
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

  getExploreFeed() {
    this.isLoading = true;
    this.exploreService.explore(this.page, this.pageSize).subscribe(
      (explorePage: QPage<Post>) => {
        if (!explorePage.empty && explorePage.content.length) {
          this.page++;
          explorePage.content.forEach(post => {
            this.userExploreFeeds.push(post);
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
    this.exploreService.explore(0, this.pageSize).subscribe(
      (explorePage: QPage<Post>) => {
        // console.log("explorePage", explorePage);
        if (!explorePage.empty && explorePage.content.length) {
          // this.page++;

          let postExists = [];
          explorePage.content.forEach((newPost: Post) => {
            this.userExploreFeeds.forEach((feed: Post) => {
              if (newPost.postActionId === feed.postActionId) {
                postExists.push(newPost.postActionId);
              }
            });
          });
          // let newPost = Number(this.pageSize) - postExists.length;
          // console.log("postExists.length", postExists.length, newPost);
          if (postExists.length == 0) {
            this.userExploreFeeds = [];
            explorePage.content.forEach(post => {
              this.userExploreFeeds.push(post);
            });
          } else {
            let index = 0;
            let spliceIndex = 0;
            explorePage.content.forEach((post: Post) => {
              if (postExists[index] == post.postActionId) {
                index++;
              } else {
                this.userExploreFeeds.splice(spliceIndex, 0, post);
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
      if (this.userExploreFeeds?.length) {
        this.userExploreFeeds.splice(0, 0, newPost);
        // console.log("Added 1");
      } else {
        this.userExploreFeeds = [newPost];
        // console.log("Added 2");
      }
    });
  }

  handlePostEditing(editedPost: Post) {
    this.ngZone.run(() => {
      if (typeof editedPost === 'undefined') return;
      if (this.userExploreFeeds?.length) {
        this.userExploreFeeds.forEach((feed: Post, index: number) => {
          if (feed.postActionId === editedPost.postActionId) {
            this.userExploreFeeds[index] = editedPost;
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
