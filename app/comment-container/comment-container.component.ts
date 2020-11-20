import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as bghttp from '@nativescript/background-http';
import { ObservableArray, Page, StackLayout, TextField } from '@nativescript/core';
import * as app from '@nativescript/core/application';
import { Mediafilepicker } from 'nativescript-mediafilepicker';
import { FilePickerOptions } from 'nativescript-mediafilepicker/mediafilepicker.common';
import { AttachedFileListComponent } from '~/attached-file-list/attached-file-list.component';
import { AuthService } from '~/services/auth.service';
import { FeedService } from '~/services/feed.service';
import { SnackBarService } from '~/services/snackbar.service';
import { CommentAction, PostSourceType } from '~/shared/models/comment-action.model';
import { MediaSrc } from '~/shared/models/common.model';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

class CommentReply {
  commentId: number;
  parentCommentId: number;
  username: string;
}

enum CommentContainerTemplate {
  page,
  section
}

@Component({
  selector: 'qn-comment-container',
  templateUrl: './comment-container.component.html',
  styleUrls: ['./comment-container.component.scss']
})
export class CommentContainerComponent implements OnInit {
  @Input() feed: Post;
  @Input() parentType: PostSourceType = PostSourceType.feed;
  commentContainerPage: Page;
  commentContainer: StackLayout;
  isCommentLoading: boolean;
  isCommenting: boolean = false;
  commentReply: CommentReply;
  isReplying: boolean = false;
  commentInputRef: ElementRef<TextField>;
  comment = new FormControl('', Validators.required);
  @ViewChild("container") container: ElementRef<any>;
  @ViewChild('commentInput')
  set commentInput(commentInputRef: ElementRef<TextField>) {
    this.commentInputRef = commentInputRef;
  }
  // @ViewChild('commentAttachFileInput')
  // set commentAttachFileInput(commentAttachFileInputRef: any) {
  //   this.commentAttachFileInputRef = commentAttachFileInputRef;
  // }
  // commentAttachFileInputRef: ElementRef;
  @ViewChild('attachedFileListComponent') attachedFileListComponent: AttachedFileListComponent;
  attachedFileList = new ObservableArray<MediaSrc>();
  page: number = 0;
  endOfComments: boolean = false;
  qColors = qColors;
  maxMediaLimit: number = 5;
  uploading: boolean = false;
  uploadProgress: number = 0;
  userCommentInteractionPanelHeight: number = 40;
  attachedFileContainerHeight: number = 90;
  templateType: CommentContainerTemplate = CommentContainerTemplate.section;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private feedService: FeedService,
    public authService: AuthService,
    private snackBarService: SnackBarService,
    private cd: ChangeDetectorRef,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.parentType === PostSourceType.singlePost) {
      this.isCommenting = true;
    }
    this.route.queryParams.subscribe((params) => {
      if (params.feed) {
        this.feed = JSON.parse(params.feed) as Post;
      }
      this.templateType = CommentContainerTemplate.page;
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
    setTimeout(() => {
      console.log("page height: ", this.commentContainerPage.getMeasuredHeight());
    }, 100);
  }

  getComments() {
    this.isCommentLoading = true;
    this.feedService.getComments(this.feed.postActionId, this.page).subscribe(
      (res: QPage<CommentAction>) => {
        this.isCommentLoading = false;
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

  postComment() {
    if (this.comment.valid) {
      this.isCommentLoading = true;
      const commentRequestData = {
        postId: String(this.feed.postActionId),
        parentCommentId: this.commentReply ? this.commentReply.parentCommentId || this.commentReply.commentId : 0,
        commentObject: this.comment.value
      };
      if (this.comment.valid) {
        if (this.attachedFileList.length > 0) {
          const formData = [];
          this.attachedFileList.forEach((attachedFile: MediaSrc) => {
            let file = attachedFile.src;
            formData.push({ name: 'files', filename: file });
          });
          formData.push({ name: "postId", value: commentRequestData.postId });
          formData.push({ name: "parentCommentId", value: commentRequestData.parentCommentId });
          formData.push({ name: "commentObject", value: commentRequestData.commentObject });
          let task: bghttp.Task = this.feedService.postComment(this.feed.postActionId, formData);

          task.on("progress", (e) => {
            // this.uploading = true;
            // this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
            // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
          });

          task.on("error", (error) => {
            // @todo: show error message from server if any
            this.errorHandler(error);
          });

          task.on("complete", (e: any) => {
            // console.log("completed", e);
          });

          task.on("responded", (e) => {
            // console.log("responded", JSON.parse(e.data));
            try {
              this.commentMadeSuccessful(JSON.parse(e.data));
            } catch (e) {
              this.snackBarService.showSomethingWentWrong();
            }
          });
        } else {
          this.feedService.postNormalComment(this.feed.postActionId, commentRequestData).subscribe(
            (commentAction: CommentAction) => {
              this.commentMadeSuccessful(commentAction);
            }, err => {
              this.errorHandler(err);
            }
          );
        }
      }
    }
  }

  errorHandler(error): void {
    this.isCommentLoading = false;
    this.uploading = false;
    this.uploadProgress = 0;
    console.log("errorHandler", error);
    this.snackBarService.showHTTPError(error);
  }

  commentMadeSuccessful(commentAction: CommentAction) {
    if (this.commentReply && (this.commentReply.parentCommentId || this.commentReply.parentCommentId)) {
      this.feed.commentActionList.forEach(c => {
        if (c.commentActionId === this.commentReply.commentId
          || c.commentActionId === this.commentReply.parentCommentId) {
          if (!c.childCommentDTOSet) {
            c.childCommentDTOSet = [];
          }
          c.childCommentDTOSet.unshift(commentAction);
        }
      });
    } else {
      this.feed.commentActionList.unshift(commentAction);
    }
    ++this.feed.postActionMeta.totalComments;
    this.snackBarService.show({ snackText: "Comment has been made!" });
    this.isCommentLoading = false;
    this.commentReply = null;
    this.comment.setValue('');
    this.commentInputRef.nativeElement.dismissSoftInput();
    this.clearAttachedFileList();
  }

  onCommentTextFieldTap(args) {
    console.log("onCommentTextFieldTap");
    // this.commentInputRef.nativeElement.focus();
  }

  isCommentValid(): boolean {
    return this.comment.valid || (this.attachedFileList.length > 0 && this.comment.valid);
  }

  replyTo(comment: CommentAction, parentComment: CommentAction) {
    this.commentReply = new CommentReply();
    this.commentReply.commentId = comment.commentActionId;
    this.commentReply.parentCommentId = parentComment?.commentActionId;
    this.commentReply.username = comment.userActorDTO?.username;
    this.commentInputRef.nativeElement.focus();
  }

  removeReplying() {
    this.commentReply = null;
    this.commentInputRef.nativeElement.focus();
  }

  finalizedAttachedFileListListener(mediaSrcList: ObservableArray<MediaSrc>) {
    this.attachedFileList = mediaSrcList;
    // this.attachedFileList = []
    // mediaSrcList.forEach((mediaSrc: MediaSrc) => {
    //   this.attachedFileList.push(mediaSrc);
    // });
  }

  chooseFile(): void {
    if (this.attachedFileListComponent?.selectionInProgress()) {
      this.attachedFileListComponent.animateTrashButton();
      return;
    }
    if (this.maxMediaLimit <= this.attachedFileList.length) {
      return this.showMaximumLimitForMedia();
    }
    let extensions = [];

    if (app.ios) {
      extensions = ['kUTTypePDF', 'kUTTypeText']; // you can get more types from here: https://developer.apple.com/documentation/mobilecoreservices/uttype
    } else {
      extensions = ['jpeg', 'png', 'txt', 'pdf', 'doc', 'docx', 'csv', 'xls', 'xlsb', 'xlsx'];
    }

    let options: FilePickerOptions = {
      android: {
        extensions: extensions,
        maxNumberFiles: this.maxMediaLimit - this.attachedFileList.length,
      },
      ios: {
        extensions: extensions,
        multipleSelection: true
      }
    };

    let mediafilepicker = new Mediafilepicker();

    mediafilepicker.openFilePicker(options);

    mediafilepicker.on("getFiles", (res) => {
      let results = res.object.get('results');
      console.dir(results);

      let keys = Object.keys(results);

      keys.forEach((key) => {
        let mediaSrc = { type: results[key].type, src: results[key].file };
        if (results[key].file) {
          if (this.isFileAlreadyAdded(mediaSrc)) {
            this.snackBarService.show({ snackText: "File already attached!" });
          } else {
            this.attachedFileList.push(mediaSrc);
            this.attachedFileListComponent.pushFile(mediaSrc);
          }
          this.cd.detectChanges();
        }
      });
      mediafilepicker.removeEventListener("getFiles");
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

  isFileAlreadyAdded(mediaSrc: MediaSrc) {
    let exists = false;
    if (!this.attachedFileList.length) {
      return exists;
    }
    this.attachedFileList.forEach((attachedFile: MediaSrc) => {
      if (attachedFile.src === mediaSrc.src) {
        exists = true;
      }
    });
    return exists;
    // return new Promise((resolve) => {

    // })
  }

  showMaximumLimitForMedia(): void {
    this.snackBarService.show({ snackText: "Maximum limit reached for attaching media" });
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

  clearAttachedFileList() {
    this.attachedFileList = new ObservableArray<MediaSrc>();
    this.attachedFileListComponent.clearAttachedFileList();
  }

  deleteComment($event) {
    this.feed.commentActionList = this.feed.commentActionList.filter((comment: CommentAction) =>
      $event !== comment.commentActionId
    );
  }
}
