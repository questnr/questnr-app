import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from '~/shared/constants';
import { Post } from '~/shared/models/post-action.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-question-horizontal-view',
  templateUrl: './question-horizontal-view.component.html',
  styleUrls: ['./question-horizontal-view.component.scss']
})
export class QuestionHorizontalViewComponent implements OnInit, AfterViewInit {
  qColors = qColors;
  @Input() question: Post;
  @Output() clickEmitter = new EventEmitter();
  questionPath: string = GlobalConstants.postQuestionPath;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  handleClick($event): void {
    this.clickEmitter.emit();
  }
}
