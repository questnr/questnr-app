import { Component, ElementRef, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { EventData } from '@nativescript-community/ui-image';
import { ListView, ScrollView, StackLayout } from '@nativescript/core';
import { FeedService } from '~/services/feeds.service';
import { GlobalConstants } from '~/shared/constants';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private userFeedService: FeedService) { }

  ngOnInit(): void {
    this.getUserFeeds();
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
              this.getUserFeeds();
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

  getUserFeeds() {
    this.isLoading = true;
    this.userFeedService.getFeeds(this.page).subscribe(
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
        console.log("err", err);
        this.isLoading = false;
      }
    );
  }

  onPostCreationBoxLoaded(args): void {
    // this.postCreationBox = args.object as CreatePostComponent;
  }

  handlePostCreation(newPost: Post) {
    console.log("handlePostCreation", !!newPost)
    if (typeof newPost === 'undefined') return;
    if (this.userFeeds?.length) {
      this.userFeeds = [newPost, ...this.userFeeds];
      console.log("Added 1");
    } else {
      this.userFeeds = [newPost];
      console.log("Added 2");
    }
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