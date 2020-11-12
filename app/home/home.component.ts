import { Component, ViewContainerRef } from '@angular/core';
import { ListView } from '@nativescript/core';
import { FeedService } from '~/services/feeds.service';
import { GlobalConstants } from '~/shared/constants';
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

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private userFeedService: FeedService) { }

  ngOnInit(): void {
    this.getUserFeeds();
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

          if (feedPage.last) {
            this.endOfPosts = true;
          }

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

  isTablet() {
    return this.utilityService.isTablet();
  }
}