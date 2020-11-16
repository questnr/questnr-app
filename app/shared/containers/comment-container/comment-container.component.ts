import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '~/services/auth.service';
import { FeedService } from '~/services/feeds.service';
import { CommentAction, CommentParentClassType } from '~/shared/models/comment-action.model';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-comment-container',
  templateUrl: './comment-container.component.html',
  styleUrls: ['./comment-container.component.scss'],
  animations: [
    trigger('expand', [
      state('collapsed', style({ height: '0', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CommentContainerComponent implements OnInit {
  @Input() feed: Post;
  @Input() parentType: CommentParentClassType = CommentParentClassType.feed;
  isCommentLoading: boolean;
  isCommenting: boolean = false;
  replyingTo: any;
  isReplying: boolean = false;
  commentInputRef: ElementRef;
  comment = new FormControl('', Validators.required);
  replyComment = new FormControl('', Validators.required);
  @ViewChild("container") container: ElementRef<any>;
  @ViewChild('commentInput')
  set commentInput(commentInputRef: ElementRef) {
    this.commentInputRef = commentInputRef;
  }
  // @ViewChild('commentAttachFileInput')
  // set commentAttachFileInput(commentAttachFileInputRef: any) {
  //   this.commentAttachFileInputRef = commentAttachFileInputRef;
  // }
  // commentAttachFileInputRef: ElementRef;
  // @ViewChild('attachedFileListComponent') attachedFileListComponent: AttachedFileListComponent;
  attachedFileList = [];
  page: number = 0;
  endOfComments: boolean = false;
  qColors = qColors;

  constructor(private feedService: FeedService,
    public authService: AuthService) { }

  ngOnInit(): void {
    if (this.parentType === CommentParentClassType.singlePost) {
      this.isCommenting = true;
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

  getComments() {
    this.isCommentLoading = true;
    this.feedService.getComments(this.feed.postActionId, this.page).subscribe(
      (res: QPage<CommentAction>) => {
        this.isCommentLoading = false;
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

  postComment() {
    if (this.comment.value) {
      this.isCommentLoading = true;
      const formData = new FormData();
      formData.append('postId', String(this.feed.postActionId));
      formData.append('parentCommentId', this.replyingTo ? this.replyingTo.parentCommentId || this.replyingTo.commentId : 0);
      formData.append('commentObject', this.comment.value);
      if (this.attachedFileList.length > 0) {
        this.attachedFileList.forEach(attachedFile => {
          formData.append('files', attachedFile);
        });
      }
      if (this.comment.valid) {
        this.feedService.postComment(this.feed.postActionId, formData).subscribe(
          (res: CommentAction) => {
            if (this.replyingTo && (this.replyingTo.parentCommentId || this.replyingTo.commentId)) {
              this.feed.commentActionList.forEach(c => {
                if (c.commentActionId === this.replyingTo.commentId || c.commentActionId === this.replyingTo.parentCommentId) {
                  if (!c.childCommentDTOSet) {
                    c.childCommentDTOSet = [];
                  }
                  c.childCommentDTOSet.unshift(res);
                }
              });
            } else {
              this.feed.commentActionList.unshift(res);
            }
            ++this.feed.postActionMeta.totalComments;
            this.isCommentLoading = false;
            this.replyingTo = null;
            this.comment.setValue('');
            // this.clearAttachedFileList();
          }, err => {
            this.isCommentLoading = false;
          }
        );
      }
    }
  }

  replyTo(event) {
    this.replyingTo = event;
    this.commentInputRef.nativeElement.focus();
  }

  removeReplying() {
    this.replyingTo = null;
    this.commentInputRef.nativeElement.focus();
  }

  chooseFile(): void {

  }

  // openFileSelector() {
  //   this.commentAttachFileInputRef.nativeElement.click();
  // }

  // selectFiles(event) {
  //   if (event.target.files.length > 0) {
  //     this.filesDroppedOnComment(event.target.files);
  //   }
  // }

  // filesDroppedOnComment(droppedFiles) {
  //   this.attachedFileList = [];
  //   const files = Object.values(droppedFiles);
  //   files.forEach((file: any) => {
  //     if (file.type.includes('image') || file.type.includes('application')) {
  //       this.attachedFileList.push(file);
  //       this.showOnAttachedFileContainer(file);
  //     }
  //   });
  // }

  // showOnAttachedFileContainer(file) {
  //   this.attachedFileListComponent.pushFile(file);
  // }

  // finalizedAttachedFileListListener($event) {
  //   this.attachedFileList = $event;
  // }

  // clearAttachedFileList() {
  //   this.attachedFileList = [];
  //   this.attachedFileListComponent.clearAttachedFileList();
  // }

  deleteComment($event) {
    this.feed.commentActionList = this.feed.commentActionList.filter((comment: CommentAction) =>
      $event !== comment.commentActionId
    );
  }
}
