import { Component, Input, OnInit } from '@angular/core';
import { StackLayout } from '@nativescript/core';
import { QSize } from '~/shared/models/common.model';

@Component({
  selector: 'qn-form-step-header',
  templateUrl: './form-step-header.component.html',
  styleUrls: ['./form-step-header.component.scss']
})
export class FormStepHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() size: QSize = QSize.medium;
  stepDetailsStackView: StackLayout;
  qSizeClass = QSize;

  constructor() { }

  ngOnInit() {
  }

  onStepDetailsLoaded(args) {
    this.stepDetailsStackView = args.object;
  }

  startBlinkingStepTitleAnimation() {
    this.stepDetailsStackView.animate({
      opacity: 0.5,
      duration: 300
    }).then(() => {
      this.stepDetailsStackView.animate({
        opacity: 1,
        duration: 400
      })
    });
  }
}
