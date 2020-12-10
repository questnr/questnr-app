import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HashTag } from '~/shared/models/hashtag.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-hash-tag-list',
  templateUrl: './hash-tag-list.component.html',
  styleUrls: ['./hash-tag-list.component.scss']
})
export class HashTagListComponent implements OnInit {
  qColors = qColors;
  @Input() title: string;
  @Input() hashTagList: HashTag[] = [];
  @Output() onHashTagTap = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setHashTagListData(hashTagList: HashTag[], title: string): void {
    if (this.title != title) {
      this.title = title;
      console.log("setHashTagList", hashTagList.length);
      this.hashTagList = hashTagList;
    }
  }

  onOpenHashTag(hashTag: HashTag): void {
    this.onHashTagTap.emit(hashTag);
  }
}
