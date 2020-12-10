import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { EventData } from '@nativescript-community/ui-image';
import { RouterExtensions } from '@nativescript/angular';
import { ScrollView } from '@nativescript/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '~/services/api.service';
import { ExploreService } from '~/services/explore.service';
import { PostMenuService } from '~/services/post-menu.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UtilityService } from '~/services/utility.service';
import { GlobalConstants } from '~/shared/constants';
import { HashTagListComponent } from '~/shared/containers/hash-tag-list/hash-tag-list.component';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { HashTag } from '~/shared/models/hashtag.model';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

enum USER_FOCUS {
  prestine, touched, dirty
}

class ExploreFeedCached {
  feed: Post[] = [];
  page: number = 0;
  endOfPosts: boolean = false;
}

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
  postTypeClass = PostType;
  pageSize = "4";
  qColors = qColors;
  hashTagUrl = GlobalConstants.hashTagPath;
  queryString: string;
  hashTagTemplate: boolean = false;
  selectedHashTagBucket: HashTag[] = [];
  queryParams: string;
  hashTagsForm: FormGroup;
  hashTagControl: FormControl = new FormControl('', {
    validators: [
      Validators.pattern(/^[A-z0-9 ]*$/),
      Validators.maxLength(30)
    ]
  });
  tagsCount = new FormControl(0, {
    validators: [
      Validators.min(1),
      Validators.max(10)
    ]
  });
  nullError: boolean = false;
  bucketFullError: boolean = false;
  bucketEmptyError: boolean = false;
  tagExistsError: boolean = false;
  searchResults: HashTag[];
  questionParentTypeClass = QuestionParentType;
  hasTagInputFocus: USER_FOCUS = USER_FOCUS.prestine;
  popularHashTagTitle: string = "Popular Hashtags";
  popularHashTagList: HashTag[] = [];
  hashTagListCompRef: HashTagListComponent
  @ViewChild('hashTagListComp')
  set hashTagListComp(hashTagListCompRef: HashTagListComponent) {
    this.hashTagListCompRef = hashTagListCompRef;
    if (this.hashTagListCompRef && this.popularHashTagList?.length) {
      // this.hashTagListCompRef?.setHashTagListData(this.popularHashTagList, this.popularHashTagTitle);
    }
  }
  exploreFeedCached: ExploreFeedCached;

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private exploreService: ExploreService,
    private ngZone: NgZone,
    public userInteractionService: UserInteractionService,
    public postMenuService: PostMenuService,
    private apiService: ApiService,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute) {
    this.exploreFeedCached = new ExploreFeedCached();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params && params['q'])
        this.handleHashTagQueryString(params['q']);
    });
    this.getTopHashTags();
    this.getExploreFeed();
    this.hashTagControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .subscribe((queryField) => {
        this.resetTagErrors();
        if (!queryField || queryField.length < 1) {
          this.searchResults = [];
        } else {
          this.apiService.searchHashtags(0, queryField).subscribe(
            (res: QPage<HashTag>) => {
              this.searchResults = res.content;
            });
        }
      });
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
              this.fetchData();
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

  fetchData(): void {
    if (this.queryParams) {
      this.getHashtagRelatedPost(false);
    } else {
      this.getExploreFeed();
    }
  }

  getExploreFeed() {
    this.isLoading = true;
    this.exploreService.explore(this.page, this.pageSize).subscribe(
      (explorePage: QPage<Post>) => {
        if (this.queryParams) {
          console.log("cached getExploreFeed");
          if (!explorePage.empty && explorePage.content.length) {
            this.exploreFeedCached.feed = [];
            explorePage.content.forEach(post => {
              this.exploreFeedCached.feed.push(post);
            });
            this.exploreFeedCached.page = 1;
            this.exploreFeedCached.endOfPosts = false;
          } else {
            this.exploreFeedCached.endOfPosts = true;
          }
        }
        else if (!explorePage.empty && explorePage.content.length) {
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

  handleHashTagQueryString(queryString: string): void {
    this.queryString = queryString;
    if (this.queryString) {
      let hashtags: string[] = this.queryString.split(",");
      hashtags.forEach((hasTag: string) => {
        if (hasTag)
          this.selectedHashTagBucket.push(new HashTag(hasTag));
      });
      this.updateQuery();
    }
  }

  getTopHashTags() {
    this.apiService.getTopHashtags().subscribe(
      (res: QPage<HashTag>) => {
        if (res.content) {
          this.popularHashTagList = res.content;
          // this.hashTagListCompRef?.setHashTagListData(res.content, this.popularHashTagTitle);
        }
      }, err => {
      });
  }

  getHashtagRelatedPost(searchedListChanged: boolean = false) {
    if (searchedListChanged == true) {
      this.userExploreFeeds = [];
      this.page = 0;
      this.endOfPosts = false;
    }
    this.isLoading = true;
    // console.log("getHashtagRelatedPost", this.page);
    // console.log("this.queryParams", this.queryParams);
    this.exploreService.getHashtagPost(this.queryParams, this.page).subscribe((postPage: QPage<Post>) => {
      // console.log("getHashtagPost", postPage);
      if (postPage.content.length) {
        this.page++;
        postPage.content.forEach(post => {
          this.userExploreFeeds.push(post);
        });
        this.isLoading = false;
      } else {
        this.endOfPosts = true;
        this.isLoading = false;
      }
    }, error => {
      // console.log(error.error.errorMessage);
      this.isLoading = false;
    });
  }

  onHashTagInputFocus(): void {
    this.hasTagInputFocus = USER_FOCUS.touched;
  }

  hasHashTagInputErrors(): boolean {
    // real time errors
    return (this.hasTagInputFocus === USER_FOCUS.touched ||
      this.hasTagInputFocus === USER_FOCUS.dirty) &&
      !this.hashTagControl.valid || this.tagExistsError;
  }

  hasHashTagListErrors(): boolean {
    // on pressing the submit button
    return this.hasTagInputFocus === USER_FOCUS.dirty &&
      !this.tagsCount.valid;
  }

  updateQuery() {
    this.queryParams = '';
    if (!this.selectedHashTagBucket?.length) {
      this.userExploreFeeds = this.exploreFeedCached.feed;
      this.page = this.exploreFeedCached.page;
      this.endOfPosts = this.exploreFeedCached.endOfPosts;
    } else {
      this.selectedHashTagBucket.forEach((searchedHashTag: HashTag, index: number) => {
        if (index == 0) {
          this.queryParams = searchedHashTag.hashTagValue;
        } else {
          this.queryParams += "," + searchedHashTag.hashTagValue;
        }
      });
      this.getHashtagRelatedPost(true);
    }
    // const queryParams: Params = { q: this.queryParams };

    // this.routerExtensions.navigate(
    //   [],
    //   {
    //     queryParams: queryParams,
    //     queryParamsHandling: 'merge', // remove to replace all query params by provided
    //   });
  }

  resetTagErrors() {
    this.nullError = false;
    this.tagExistsError = false;
    this.bucketFullError = false;
    this.bucketEmptyError = false;
  }

  removeHashTagFromSearchingBucket(hashTag: HashTag) {
    this.selectedHashTagBucket = this.selectedHashTagBucket.filter((searchedHashTag: HashTag) => {
      return searchedHashTag.hashTagValue != hashTag.hashTagValue;
    });
  }

  removeHashTagFromSearchingBucketEvent($event, hashTag: HashTag) {
    this.selectedHashTagBucket = this.selectedHashTagBucket.filter((searchedHashTag: HashTag) => {
      return searchedHashTag.hashTagValue != hashTag.hashTagValue;
    });
    this.updateQuery();
  }

  toggleHashTagToSearchingBucket(hashTag: HashTag) {
    if (this.isInListofSeachingBucket(hashTag)) {
      if (this.selectedHashTagBucket.length > 1) {
        this.removeHashTagFromSearchingBucket(hashTag);
      }
    } else {
      this.addHashTagToSearchingBucket(hashTag, false);
    }
    this.updateQuery();
  }

  isInListofSeachingBucket(hashTag: HashTag) {
    let hasFound: boolean = false;
    this.selectedHashTagBucket.forEach((searchedHashTag: HashTag) => {
      if (searchedHashTag.hashTagValue == hashTag.hashTagValue) hasFound = true;
    });
    return hasFound;
  }

  isInListofSeachingBucketUsingInput(value: string) {
    let doesNotHave = false;
    this.selectedHashTagBucket.forEach((searchedHashTag: HashTag) => {
      if (searchedHashTag.hashTagValue.toLowerCase().trim() === value.toLocaleLowerCase().trim()) {
        doesNotHave = true;
      }
    });
    return doesNotHave;
  }

  addHashTagToSearchingBucket(hashTag: HashTag, isClick: boolean) {
    if (this.isInListofSeachingBucket(hashTag)) {
      this.searchResults = [];
      this.tagExistsError = true;
      return;
    }
    this.resetTagErrors();
    if (isClick) {
      setTimeout(() => {
        this.hashTagControl.setValue("");
        this.searchResults = [];
        this.selectedHashTagBucket.push(hashTag);
        this.updateQuery();
      }, 700);
    }
    else {
      this.selectedHashTagBucket.push(hashTag);
      setTimeout(() => {
        this.updateQuery();
      }, 400);
    }
  }

  addHashTagToSearchingBucketUsingInput(value: string) {
    this.resetTagErrors();
    if (!(value && value.length > 0)) return;
    if (this.isInListofSeachingBucketUsingInput(value)) {
      this.tagExistsError = true;
      return;
    }
    if (this.selectedHashTagBucket.length >= 10) {
      this.bucketFullError = true;
    }
    else if (this.hashTagControl.valid) {
      this.tagsCount.setValue(Number(this.tagsCount.value) + 1);
      this.hashTagControl.setValue("");
      this.searchResults = [];
      this.selectedHashTagBucket.push(new HashTag(value.toLowerCase()));
    }
  }

  onHashTagTap(hashTag: HashTag) {
    if (!this.queryParams) {
      this.exploreFeedCached.feed = this.userExploreFeeds;
      this.exploreFeedCached.page = this.page;
      this.exploreFeedCached.endOfPosts = this.endOfPosts;
    }
    this.addHashTagToSearchingBucket(hashTag, false);
  }
}
