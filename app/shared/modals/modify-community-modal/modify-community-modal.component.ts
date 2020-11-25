import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
  selector: 'qn-modify-community-modal',
  templateUrl: './modify-community-modal.component.html',
  styleUrls: ['./modify-community-modal.component.scss']
})
export class ModifyCommunityModalComponent implements OnInit {

  constructor(public params: ModalDialogParams) { }

  ngOnInit() {
  }

  onClose(): void {
    this.params.closeCallback();
  }
}
