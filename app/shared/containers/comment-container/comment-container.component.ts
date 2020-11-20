import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { StackLayout } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { AuthService } from '~/services/auth.service';
import { CommentSectionService } from '~/services/comment-section.service';
import { CreateCommentComponent } from '~/shared/components/create-comment/create-comment.component';
import { GlobalConstants } from '~/shared/constants';
import { CommentAction, PostSourceType } from '~/shared/models/comment-action.model';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-comment-container',
  templateUrl: './comment-container.component.html',
  styleUrls: ['./comment-container.component.scss']
})
export class CommentContainerComponent implements OnInit {
  @Input() feed: Post;
  @Input() parentType: PostSourceType = PostSourceType.feed;
  commentContainer: StackLayout;
  isCommentLoading: boolean;
  isCommenting: boolean = false;
  isReplying: boolean = false;
  @ViewChild("container") container: ElementRef<any>;
  createCommentRef: CreateCommentComponent;
  @ViewChild("createComment")
  set createComment(createCommentRef: CreateCommentComponent) {
    this.createCommentRef = createCommentRef;
  }
  page: number = 0;
  endOfComments: boolean = false;
  qColors = qColors;

  constructor(
    public authService: AuthService,
    private routerExtensions: RouterExtensions,
    private commentSectionService: CommentSectionService) { }

  ngOnInit(): void {
    if (this.commentSectionService.getMaxCommentWithPostCount() < this.feed.commentActionList.length) {
      this.feed.commentActionList = this.feed.commentActionList.slice(0, 2);
    }
  }

  toggleComments(isCommenting: boolean) {
    this.isCommenting = isCommenting;
    if (this.isCommenting) {
      this.container.nativeElement.show();
      this.container.nativeElement.slideDown(225);
    }
    else {
      this.container.nativeElement.slideUp(225).then(() => {
        this.container.nativeElement.hide();
      });
    }
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

  onCommentContainerLoaded(args) {
    this.commentContainer = args.object as StackLayout;
  }

  onCommentLoading(isCommentLoading: boolean) {
    this.isCommentLoading = isCommentLoading;
  }

  replyTo(comment: CommentAction, parentComment: CommentAction) {
    this.createCommentRef.replyTo(comment, parentComment);
  }

  onDeleteComment($event) {
    this.feed.commentActionList = this.feed.commentActionList.filter((comment: CommentAction) =>
      $event !== comment.commentActionId
    );
  }
}
