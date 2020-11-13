import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StackLayout } from '@nativescript/core';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { FeedService } from '~/services/feeds.service';
import { GlobalConstants } from '~/shared/constants';
import { HashTag } from '~/shared/models/hashtag.model';
import { Post, PostEditorType, PostMedia, ResourceType } from '~/shared/models/post-action.model';
import { UserListType } from '~/shared/models/user-list.model';
import { FeedTextComponent } from '../feed-text/feed-text.component';
import { MediaContainerComponent } from '../media-container/media-container.component';
import { ProfileIconComponent } from '../profile-icon/profile-icon.component';

@Component({
  selector: 'qn-simple-post',
  templateUrl: './simple-post.component.html',
  styleUrls: ['./simple-post.component.scss']
})
export class SimplePostComponent implements OnInit {
  @Input() feed: Post;
  @ViewChild('feedTextComponent') feedTextComponent: FeedTextComponent;
  @Output() removePostEvent = new EventEmitter();
  @Input() showUserHeader: boolean = false;
  isLoading = false;
  loggedInUserId: any;
  hashTagsData: any = {};
  userPath: string = GlobalConstants.userPath;
  communityPath: string = GlobalConstants.communityPath;
  editableFeed: Post;
  displayText: string;
  postPath: string = GlobalConstants.postPath;
  isYouTubeVideoLink: boolean = false;
  safeYoutubeLink: SafeResourceUrl;
  youtubeLinkTemplate: string = "https://youtube.com/embed/";
  viewMediaList: PostMedia[] = [];
  applicationMediaList: PostMedia[] = [];
  containerRef;
  @ViewChild("container") container: ElementRef;
  viewPortPassed: boolean = false;
  userListTypeClass = UserListType;
  profileIconRef: ProfileIconComponent;
  @ViewChild("profileIcon")
  set profileIcon(profileIconRef: ProfileIconComponent) {
    this.profileIconRef = profileIconRef;
  }
  @ViewChild("mediaContainer") mediaContainer: MediaContainerComponent;
  // commentComponentRef: CreateCommentComponent;
  // @ViewChild("commentComponent")
  // set commentComponent(commentComponentRef: CreateCommentComponent) {
  //   this.commentComponentRef = commentComponentRef;
  // }

  constructor(private authService: AuthService,
    private commonService: CommonService,
    private _sanitizer: DomSanitizer,
    private feedService: FeedService) {
  }

  ngOnInit(): void {
    if (!this.showUserHeader) {
      if (this.feed?.communityDTO) {
        this.showUserHeader = false;
      } else {
        this.showUserHeader = true;
      }
    }
    for (let mediaIndex = 0; mediaIndex < this.feed.postMediaList?.length; mediaIndex++) {
      if (this.feed.postMediaList[mediaIndex]?.resourceType === ResourceType.application) {
        this.applicationMediaList.push(this.feed.postMediaList[mediaIndex]);
      } else {
        this.viewMediaList.push(this.feed.postMediaList[mediaIndex]);
      }
    }
    this.editableFeed = Object.assign({}, this.feed);
    this.loggedInUserId = this.authService.getStoredUserProfile().id;
    this.parseFeedText();
  }
  async parseFeedText() {
    if (this.feed.postData.text)
      this.displayText = this.feed.postData.text;
    if (this.displayText && this.displayText.length > 0 && this.feed.postData.postEditorType !== PostEditorType.blog) {
      this.displayText.replace('\n', '<br>');
      this.feed.hashTags.forEach((hashTag: HashTag) => {
        // let hashTagNode = document.createElement("span");
        // hashTagNode.style.color = 'red';
        var regEx = new RegExp("#" + hashTag.hashTagValue, "ig");
        let index = this.commonService.indexOfUsingRegex(this.displayText, regEx, 0);
        if (index >= 0) {
          this.hashTagsData[index] = hashTag.hashTagValue.length + 1;
          this.displayText = this.displayText.substr(0, index) +
            "<app-hash-tag hash-tag-value=\"" + hashTag.hashTagValue + "\"></app-hash-tag>" +
            this.displayText.substr(index + hashTag.hashTagValue.length + 1);
        }
      });
      let detectedLink: string = this.commonService.parseTextToFindURL(this.displayText);
      if (detectedLink) {
        let youTubeId = this.commonService.getYouTubeVideoId(detectedLink);
        if (youTubeId) {
          this.isYouTubeVideoLink = true;
          this.safeYoutubeLink = this._sanitizer.bypassSecurityTrustResourceUrl(this.youtubeLinkTemplate + youTubeId);
        } else {
          this.isYouTubeVideoLink = false;
          // this.iFramelyData = await this.iFramelyService.getIFramelyData(detectedLink);
        }
      }
    }
  }

  feedCameInView() {
    this.viewPortPassed = true;
    if (!this.feed.postActionMeta.visited) {
      this.feedService.visitPost(this.feed.postActionId).subscribe();
    }
  }


  onViewPort(flag: boolean) {
    // console.log("onViewPort", flag, this.feed.postActionId);
    // if (flag) {
    //   this.mediaContainer?.playVideoIfAny();
    // } else {
    //   this.mediaContainer?.pauseVideoIfAny();
    // }
  }
}
