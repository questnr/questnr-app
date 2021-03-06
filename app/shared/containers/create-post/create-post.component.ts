import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { AuthService } from '~/services/auth.service';
import { PostMenuService } from '~/services/post-menu.service';
import { UtilityService } from '~/services/utility.service';
import { CreatePostModalComponent } from '~/shared/modals/create-post-modal/create-post-modal.component';
import { CreateQuestionModalComponent } from '~/shared/modals/create-question-modal/create-question-modal.component';
import { AvatarDTO } from '~/shared/models/common.model';
import { Post } from '~/shared/models/post-action.model';

@Component({
  selector: 'qn-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  @Input() isCommunityPost: boolean = false;
  @Input() communityId: number;
  @Output() onPostCreated = new EventEmitter();
  @Output() onPostEdited = new EventEmitter();
  avatar: AvatarDTO;

  constructor(private authSerivce: AuthService,
    public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private modalService: ModalDialogService,
    private postMenuService: PostMenuService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.avatar = this.authSerivce.getAvatar();
    this.postMenuService.postEditRequest$.subscribe((postToBeEdited: Post) => {
      if (postToBeEdited && postToBeEdited.postActionId
        && this.authService.isThisLoggedInUser(postToBeEdited.userDTO?.userId)) {
        this.editPost(postToBeEdited);
      }
    });
  }

  logout() {
    this.authSerivce.logout();
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  createQuestion() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {
        isCommunityPost: this.isCommunityPost,
        communityId: this.communityId
      }
    };
    this.modalService.showModal(CreateQuestionModalComponent, options).then((newPost: Post) => {
      // console.log("createQuestion", newPost);
      this.onPostCreated.emit(newPost);
    });
  }

  createPost() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {
        isCommunityPost: this.isCommunityPost,
        communityId: this.communityId
      }
    };
    this.modalService.showModal(CreatePostModalComponent, options).then((newPost: Post) => {
      // console.log("createQuestnr", newPost);
      this.onPostCreated.emit(newPost);
    });
  }

  private editPost(postToBeEdited: Post): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {
        isEditing: true,
        post: postToBeEdited
      }
    };
    this.modalService.showModal(CreatePostModalComponent, options).then((editedPost: Post) => {
      // console.log("Edited Post", editedPost);
      this.onPostEdited.emit(editedPost);
    });
  }
}
