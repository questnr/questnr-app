import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { AuthService } from '~/services/auth.service';
import { SnackBarService } from '~/services/snackbar.service';
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
  @Output() onPostCreated = new EventEmitter();
  avatar: AvatarDTO;

  constructor(private authSerivce: AuthService,
    public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private modalService: ModalDialogService,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.avatar = this.authSerivce.getAvatar();
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
      context: {}
    };
    this.modalService.showModal(CreateQuestionModalComponent, options).then((newPost: Post) => {
      // console.log("createQuestion", newPost);
      this.onPostCreated.emit(newPost);
    });
  }

  createQuestnr() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {}
    };
    this.modalService.showModal(CreatePostModalComponent, options).then((newPost: Post) => {
      // console.log("createQuestnr", newPost);
      this.onPostCreated.emit(newPost);
    });
  }
}