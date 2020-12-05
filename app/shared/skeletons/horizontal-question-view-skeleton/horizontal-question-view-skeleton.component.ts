import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qn-horizontal-question-view-skeleton',
  templateUrl: './horizontal-question-view-skeleton.component.html',
  styleUrls: ['./horizontal-question-view-skeleton.component.scss']
})
export class HorizontalQuestionViewSkeletonComponent implements OnInit {
  @Input() rows: number = 5;
  listItems;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setListItems(this.rows ? this.rows : 5);
  }

  setListItems(rows: number) {
    this.rows = rows;
    this.listItems = Array(this.rows);
  }
}
