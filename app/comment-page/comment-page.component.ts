import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, StackLayout } from '@nativescript/core';
import { AuthService } from '~/services/auth.service';
import { CommentSectionService } from '~/services/comment-section.service';
import { CreateCommentComponent } from '~/shared/components/create-comment/create-comment.component';
import { CommentAction, PostSourceType } from '~/shared/models/comment-action.model';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.scss']
})
export class CommentPageComponent implements OnInit {
  commentContainerPage: Page;
  @Input() feed: Post;
  @Input() parentType: PostSourceType = PostSourceType.feed;
  commentContainer: StackLayout;
  isCommentLoading: boolean = false;
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
    public viewContainerRef: ViewContainerRef,
    private commentSectionService: CommentSectionService,
    public authService: AuthService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.parentType === PostSourceType.singlePost) {
      this.isCommenting = true;
    }
    this.route.queryParams.subscribe((params) => {
      if (params.feed) {
        this.feed = JSON.parse(params.feed) as Post;
      }
    });
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

  onCommentPageLoaded(args) {
    this.commentContainerPage = args.object as Page;
    // setTimeout(() => {
    //   console.log("page height: ", this.commentContainerPage.getMeasuredHeight());
    // }, 100);
  }

  getComments() {
    this.onCommentLoading(true);
    this.commentSectionService.getComments(this.feed.postActionId, this.page).subscribe(
      (res: QPage<CommentAction>) => {
        this.onCommentLoading(false);
        // console.log("res.content", res.content);
        if (res.content.length) {
          res.content.forEach(comment => {
            this.feed.commentActionList.push(comment);
          });
          ++this.page;
        } else {
          this.endOfComments = true;
        }
      }
    );
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
