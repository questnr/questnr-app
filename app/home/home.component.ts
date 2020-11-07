import { Component, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { CreatePostComponent } from '~/shared/modals/create-post/create-post.component';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoading = false;

  constructor(private authSerivce: AuthService,
    public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService,
    private modalService: ModalDialogService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authSerivce.logout();
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  createQuestnr() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: true,
      context: {}
    };
    this.modalService.showModal(CreatePostComponent, options);
  }
}