import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventData, FinalEventData, Img } from '@nativescript-community/ui-image';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import * as bghttp from '@nativescript/background-http';
import { ImageSource, Page, ScrollView, StackLayout } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { ImagePickerOptions, Mediafilepicker } from 'nativescript-mediafilepicker';
import { combineLatest, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '~/services/auth.service';
import { CommunityActivityService } from '~/services/community-activity.service';
import { CommunityMenuService } from '~/services/community-menu.service';
import { CommunityService } from '~/services/community.service';
import { ImageCropService } from '~/services/image-crop.service';
import { PostMenuService } from '~/services/post-menu.service';
import { QRouterService } from '~/services/q-router.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserInteractionService } from '~/services/user-interaction.service';
import { UtilityService } from '~/services/utility.service';
import { CommunityActivityComponent } from '~/shared/components/community-activity/community-activity.component';
import { CommunityRelationActionButtonComponent } from '~/shared/components/community-relation-action-button/community-relation-action-button.component';
import { HorizontalOwnerProfileComponent } from '~/shared/components/horizontal-owner-profile/horizontal-owner-profile.component';
import { QuestionListCardComponent } from '~/shared/components/question-list-card/question-list-card.component';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { CommunityMembersComponent } from '~/shared/containers/community-members/community-members.component';
import { SimplePostComponent } from '~/shared/containers/simple-post/simple-post.component';
import { ModifyCommunityModalComponent } from '~/shared/modals/modify-community-modal/modify-community-modal.component';
import { Community, CommunityPrivacy, CommunityProfileMeta } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { Post, PostType, QuestionParentType } from '~/shared/models/post-action.model';
import { RelationType } from '~/shared/models/relation-type';
import { UserListType } from '~/shared/models/user-list.model';
import { UserQuestionListModalType } from '~/shared/models/user-question.model';
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
  isCommunityLoading: boolean = true;
  isLoading: boolean = false;
  isOwner: boolean = false;
  communityFeeds: Post[] = [];
  pageNumber: number = 0;
  endOfPosts: boolean = false;
  @ViewChildren(SimplePostComponent) simplePostComponentList!: QueryList<SimplePostComponent>;
  containerRef: ElementRef;
  @ViewChild("container")
  set container(containerRef: ElementRef) {
    this.containerRef = containerRef;
  }
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
    if (this.community) {
      this.communityMemeberCompRef.setCommunity(this.community);
    }
  }
  relationButtonCompRef: CommunityRelationActionButtonComponent;
  @ViewChild('relationButtonComp')
  set relationButtonComp(relationButtonCompRef: CommunityRelationActionButtonComponent) {
    this.relationButtonCompRef = relationButtonCompRef;
    if (this.community && this.relationButtonCompRef) {
      this.relationButtonCompRef.setData(this.community, this.relationType);
    }
  }
  ownerProfileCompRef: HorizontalOwnerProfileComponent;
  @ViewChild('ownerProfileComp')
  set ownerProfileComp(ownerProfileCompRef: HorizontalOwnerProfileComponent) {
    this.ownerProfileCompRef = ownerProfileCompRef;
    if (this.community) {
      this.ownerProfileCompRef.setUser(this.community.ownerUserDTO);
    }
  }
  communityActivityCompRef: CommunityActivityComponent;
  @ViewChild('communityActivityComp')
  set communityActivityComp(communityActivityCompRef: CommunityActivityComponent) {
    this.communityActivityCompRef = communityActivityCompRef;
    if (this.community && this.communityInfo) {
      this.communityActivityCompRef.setCommunity(this.community);
      this.communityActivityCompRef.setCommunityInfo(this.communityInfo);
    }
  }
  relationTypeClass = RelationType;
  questionListCardCompRef: QuestionListCardComponent;
  @ViewChild("questionListCardComp")
  set questionListCardComp(questionListCardCompRef: QuestionListCardComponent) {
    this.questionListCardCompRef = questionListCardCompRef;
  }
  scrollView: ScrollView;
  questionListTypeClass = UserQuestionListModalType;
  modifiedCommunityImage: ImageSource;
  modifiedCommunityAvatarPath: string;
  commuityDetailsView;

  constructor(public viewContainerRef: ViewContainerRef,
    private postMenuService: PostMenuService,
    public communityService: CommunityService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    public userInteractionService: UserInteractionService,
    private ngZone: NgZone,
    private snackBarService: SnackBarService,
    private communityActivityService: CommunityActivityService,
    private routerExtensions: RouterExtensions,
    private communityMenuService: CommunityMenuService,
    private authService: AuthService,
    private modalService: ModalDialogService,
    public page: Page,
    private imageCropService: ImageCropService,
    private qRouterService: QRouterService) {
    this.isCommunityLoading = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.communitySlug = params.get('communitySlug');
      // console.log("communitySlug", this.communitySlug);

      // fetch community entity
      const communitySubscriber = this.communityService.getCommunityDetails(this.communitySlug)
        .pipe(catchError((error: any) => {
          this.routerExtensions.backToPreviousPage();
          this.snackBarService.showHTTPError(error);
          return of(null);
        }));

      // fetch community profile information
      const communityAcitivitySubscriber = this.communityActivityService.getCommunityMetaInfo(this.communitySlug)
        .pipe(catchError((error: any) => {
          this.routerExtensions.backToPreviousPage();
          this.snackBarService.showHTTPError(error);
          return of(null);
        }));

      combineLatest([communitySubscriber, communityAcitivitySubscriber]).subscribe(
        ([community, communityProfileMeta]) => {
          if (!community || !communityProfileMeta) {
            this.snackBarService.show({ snackText: 'Community not found!' });
            this.routerExtensions.backToPreviousPage();
            return;
          }
          this.community = community;
          this.communityInfo = communityProfileMeta;
          /**
           * Starts community
           */
          this.afterReceivingCommunity(true);
          /**
           * Ends community
           */
          /**
           * Starts communityProfileMeta
           */
          // this.communityActivityRef.setCommunityInfo(this.communityInfo);
          // this.questionListRef.setTotalCounts(this.communityInfo.totalQuestions);
          // this.communityHorizontalCardRef?.setCommunityInfo(this.communityInfo);
          if (this.isOwner) {
            this.pendingRequests = this.communityInfo.totalRequests;
          }
          /**
           * Ends communityProfileMeta
           */
        });
    });
  }

  ngOnInit(): void {
    this.postMenuService.postDeleteRequest$.subscribe((postActionId: number) => {
      this.communityFeeds = this.communityFeeds.filter((feed: Post) => {
        return feed.postActionId !== postActionId;
      });
    });

    this.communityMenuService.communityEditRequest$.subscribe((communityToBeEdited: Community) => {
      if (communityToBeEdited && communityToBeEdited.communityId
        && this.authService.isThisLoggedInUser(communityToBeEdited.ownerUserDTO.userId)) {
        this.onEdit(communityToBeEdited);
      }
    });

    this.communityMenuService.communityRefreshRequest$.subscribe((community: Community) => {
      this.community = community;
    });
  }

  ngAfterViewInit() {
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
  }

  afterReceivingCommunity(callFromConstructor: boolean = false): void {
    this.isCommunityLoading = false;
    this.relationType = this.community.communityMeta.relationShipType;
    this.isAllowedIntoCommunity = this.communityService.isAllowedIntoCommunity(this.community);
    this.restartCommunityFeeds(callFromConstructor);
    this.communityMemeberCompRef?.setCommunity(this.community);
    this.ownerProfileCompRef?.setUser(this.community.ownerUserDTO);
    this.relationButtonCompRef?.setData(this.community, this.relationType);
    this.communityActivityCompRef?.setCommunity(this.community);
    this.communityActivityCompRef?.setCommunityInfo(this.communityInfo);
    this.questionListCardCompRef.setCommunityData(this.community, this.isAllowedIntoCommunity);
    this.questionListCardCompRef.setTotalQuestion(this.communityInfo.totalQuestions);
  }

  restartCommunityFeeds(callFromConstructor: boolean = false) {
    this.isOwner = this.communityService.isOwner(this.community);

    // No need to re-fetch feeds again if the community is not private.
    if (!callFromConstructor && this.community.communityPrivacy == CommunityPrivacy.pub) return;

    this.communityFeeds = [];
    this.pageNumber = 0;

    if (!this.isAllowedIntoCommunity) return;

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
    this.feedSubscriber = this.communityService.getCommunityFeeds(this.community.communityId, this.pageNumber, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          this.pageNumber++;
          feedPage.content.forEach(post => {
            this.communityFeeds.push(post);
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
    this.feedSubscriber = this.communityService.getCommunityFeeds(this.community.communityId, this.pageNumber, this.pageSize).subscribe(
      (feedPage: QPage<Post>) => {
        // console.log("feedPage", feedPage);
        if (!feedPage.empty && feedPage.content.length) {
          // this.pageNumber++;

          let postExists = [];
          feedPage.content.forEach((newPost: Post) => {
            this.communityFeeds.forEach((feed: Post) => {
              if (newPost.postActionId === feed.postActionId) {
                postExists.push(newPost.postActionId);
              }
            });
          });
          // let newPost = Number(this.pageNumberSize) - postExists.length;
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
    this.communityMemeberCompRef.ngOnInit();
    this.restartCommunityFeeds();
  }

  // community avatar
  onFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  onOpenCommunitySettings(args) {
    this.communityMenuService.onRequestStart(this.community);
  }

  onEdit(communityToBeEdited: Community): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {
        community: communityToBeEdited
      }
    };
    this.modalService.showModal(ModifyCommunityModalComponent, options).then((newCommunity: Community) => {
      // console.log("onEdit: newCommunity", newCommunity);
      this.community = newCommunity;
      this.afterReceivingCommunity();
    });
  }

  onScrollViewLoaded(args) {
    this.scrollView = args.object as ScrollView;
  }

  onScrollToPostEvent(args) {
    let postTop = this.page.getViewById('community-post-feed') as StackLayout;
    this.scrollView.scrollToVerticalOffset(postTop.getLocationOnScreen().y, true);
  }

  onCommunityAvatarEdit() {
    let pictureOptions: ImagePickerOptions = {
      android: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 1,
        isNeedFolderList: true
      }, ios: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 1,
      }
    };

    let mediafilepicker = new Mediafilepicker();
    mediafilepicker.openImagePicker(pictureOptions);

    mediafilepicker.on("getFiles", (res) => {
      let results = res.object.get('results');

      let keys = Object.keys(results);

      keys.forEach((key) => {
        if (results[key].type === 'image') {
          if (results[key].file) {
            ImageSource.fromFile(results[key].file).then((imageSource) => {
              this.imageCropService.openCommunityAvatarImageCropper(imageSource).then((croppedImg) => {
                this.modifiedCommunityImage = croppedImg.image;
                this.modifiedCommunityAvatarPath = croppedImg.path;
                this.changeCommunityAvatar();
              });
            })
          }
        }
      });
    });

    // for iOS iCloud downloading status
    mediafilepicker.on("exportStatus", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on("error", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on("cancel", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });
  }

  changeCommunityAvatar() {
    if (this.modifiedCommunityAvatarPath) {
      const formData = [];
      formData.push({ name: 'file', filename: this.modifiedCommunityAvatarPath });
      let task: bghttp.Task = this.communityService.updateCommunityAvatar(formData, this.community.communityId);
      task.on("progress", (e) => {
        // this.uploading = true;
        // this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
        // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
      });

      task.on("error", (error) => {
        this.communityAvatarErrorHandler(error);
      });

      task.on("complete", (e: any) => {
        // console.log("completed", e);
      });

      task.on("responded", (e) => {
        // console.log("responded", JSON.parse(e.data));
        try {
          this.onCommunityAvatarChanged();
        } catch (e) {
          this.snackBarService.showSomethingWentWrong();
        }
      });
    }
  }

  communityAvatarErrorHandler(error): void {
    // console.log("error", error);
    this.modifiedCommunityAvatarPath = null;
    this.snackBarService.show({ snackText: "Failed to upload the community avatar." });
  }

  onCommunityAvatarChanged(): void {
    this.snackBarService.show({ snackText: "Community avatar has been changed!" });
  }

  onCommuityDetailsViewLoaded(args): void {
    this.commuityDetailsView = args.object;
    this.commuityDetailsView.animate({
      translate: { x: 0, y: -20 },
    }).then(() => {
      this.commuityDetailsView.animate({
        translate: { x: 0, y: 0 },
        duration: 1300,
        curve: new CubicBezierAnimationCurve(.42, .39, .16, 1.5)
      });
    });
  }

  onShowCommunityCard(args): void {
    //@todo: show community card with community primary imformation: name, description, and avatar
  }

  onOpenExplorePage(): void {
    this.qRouterService.goToExploreTab();
  }
}
