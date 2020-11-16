import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '~/services/auth.service';
import { FeedService } from '~/services/feeds.service';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { CommentAction } from '~/shared/models/comment-action.model';
import { Post } from '~/shared/models/post-action.model';

@Component({
  selector: 'qn-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {
  isLoading = false;
  isReplying = false;
  @Input() comment: CommentAction;
  @Input() parentComment: CommentAction;
  @Input() post: Post;
  @Output() reply = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Input() fontSize: string;
  mobileView: boolean = false;
  loggedInUserId: any;
  defaultUserSrc: string = StaticMediaSrc.userFile;
  userPath: string = GlobalConstants.userPath;

  constructor(private feedService: FeedService,
    public authService: AuthService) {
    this.loggedInUserId = authService.getStoredUserProfile().id;
  }

  ngOnInit(): void {
  }

  likeComment(id) {
    this.isLoading = true;
    if (this.comment.commentActionMeta.liked) {
      this.dislikedComment();
      this.feedService.dislikeComment(id).subscribe(
        (res: any) => {
          this.isLoading = false;
        }, err => { this.likedComment(); }
      );
    } else {
      this.likedComment();
      this.feedService.likeComment(id).subscribe(
        (res: any) => {
          if (res.likeCommentActionId) {
            return;
          } else { this.dislikedComment(); }
        }, err => { this.dislikedComment(); }
      );
    }
  }
  replyTo(username, commentId, parentCommentId) {
    this.reply.emit({ username, commentId, parentCommentId });
  }

  likedComment() {
    this.isLoading = false;
    this.comment.commentActionMeta.liked = true;
  }
  dislikedComment() {
    this.isLoading = false;
    this.comment.commentActionMeta.liked = false;
  }

  allowDelete() {
    return this.post.userDTO.userId == this.loggedInUserId || this.comment.userActorDTO.userId == this.loggedInUserId;
  }

  deleteComment() {
    this.feedService.deleteComment(this.post.postActionId, this.comment.commentActionId).subscribe((res: any) => {
      this.deleteEvent.emit(this.comment.commentActionId);
    });
  }
}
