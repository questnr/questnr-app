import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { FeedsService } from '~/services/feeds.service';

@Component({
  selector: 'qn-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  constructor(private params: ModalDialogParams,
    public authService: AuthService,
    private feedsService: FeedsService,
    private commonService: CommonService) {

  }

  ngOnInit() { }

  close() {
    this.params.closeCallback();
  }
}
