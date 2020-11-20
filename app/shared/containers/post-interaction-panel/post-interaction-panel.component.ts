import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { FeedService } from '~/services/feed.service';
import { GlobalConstants } from '~/shared/constants';
import { PostSourceType } from '~/shared/models/comment-action.model';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';
import { CommentContainerComponent } from '../comment-container/comment-container.component';

@Component({
  selector: 'qn-post-interaction-panel',
  templateUrl: './post-interaction-panel.component.html',
  styleUrls: ['./post-interaction-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInteractionPanelComponent implements OnInit {
  @Input() feed: Post;
  isLoading: boolean = false;
  qColors = qColors;
  postSourceTypeClass = PostSourceType;
  isCommenting: boolean = false;
  @ViewChild("commentContainer") commentContainer: CommentContainerComponent;

  constructor(private feedService: FeedService,
    private cd: ChangeDetectorRef,
    private routerExtensions: RouterExtensions) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.commentContainer.toggleComments(this.isCommenting);
  }

  setPost(feed: Post): void {
    this.feed = feed;
    this.cd.detectChanges();
  }

  likePost() {
    this.isLoading = true;
    if (this.feed.postActionMeta.liked) {
      this.dislikedPost();
      this.feedService.dislikePost(this.feed.postActionId).subscribe(
        (res: any) => {
          if (res.status !== 200) { this.likedPost(); }
        }, err => { this.likedPost(); }
      );
    } else {
      this.likedPost();
      this.feedService.likePost(this.feed.postActionId).subscribe(
        (res: any) => {
          if (res.status !== 200) { this.dislikedPost(); }
        }, err => { this.dislikedPost(); }
      );
    }
  }

  likedPost() {
    this.isLoading = false;
    this.feed.postActionMeta.liked = true;
    ++this.feed.postActionMeta.totalLikes;
  }

  dislikedPost() {
    this.isLoading = false;
    this.feed.postActionMeta.liked = false;
    --this.feed.postActionMeta.totalLikes;
  }

  toggleComments() {
    this.isCommenting = !this.isCommenting;
    this.commentContainer.toggleComments(this.isCommenting);
  }

  openCommentSectionPage() {
    this.routerExtensions.navigate(['/',
      GlobalConstants.feedPath,
      this.feed.postActionId,
      GlobalConstants.feedCommentPath],
      {
        queryParams: { feed: JSON.stringify(this.feed) },
        animated: true,
        transition: {
          name: "slideLeft",
          duration: 400,
          curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
        }
      })
  }

  openShareDialog() {

  }
}
