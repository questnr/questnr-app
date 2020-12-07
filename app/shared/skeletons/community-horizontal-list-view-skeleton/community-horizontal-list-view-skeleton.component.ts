import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qn-community-horizontal-list-view-skeleton',
  templateUrl: './community-horizontal-list-view-skeleton.component.html',
  styleUrls: ['./community-horizontal-list-view-skeleton.component.scss']
})
export class CommunityHorizontalListViewSkeletonComponent implements OnInit {
  @Input() height: number = 80;
  @Input() showJoinButton: boolean = true;
  @Input() rows: number = 5;
  listItems;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setListItems(this.rows && this.rows < 6 ? this.rows : 5);
  }

  setListItems(rows: number) {
    this.rows = rows < 6 ? rows : 5;
    this.listItems = Array(this.rows);
  }

  templateSelector(item, index, items) {
    return 'communityView';
  }
}
