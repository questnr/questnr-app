import { Component, OnInit, Input } from '@angular/core';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-feed-text',
  templateUrl: './feed-text.component.html',
  styleUrls: ['./feed-text.component.scss']
})
export class FeedTextComponent implements OnInit {
  qColors = qColors;
  @Input() text: string;
  @Input() maxLength: number = 200;
  @Input() hashTagsData = {};
  // "read more" functionality to be use
  @Input() readMore: boolean = true;
  endPart: string = "...";
  countReadMoreTimes: number = 0;
  textToShow: string = "";
  hasMoreText: boolean = false;
  hashTagPosList: string[];
  newLinePositionList: number[];

  constructor() { }

  ngOnInit(): void {
    if (this.text && this.text.length > 0) {
      if (Object.keys(this.hashTagsData).length) {
        this.hashTagPosList = Object.keys(this.hashTagsData);
      }
      if (this.text.length > this.maxLength && this.readMore) {
        this.readLessText();
      } else {
        this.readMore = false;
        this.readMoreText();
      }
    }
  }
  // calculateNewLinePositions(text: string) {
  //   for (let pos = text.indexOf("\n"); pos != -1; pos = text.indexOf("\n", pos + 1)) {
  //     this.newLinePositionList.push(pos);
  //   }
  // }

  toggleText(): void {
    if (this.hasMoreText) {
      this.readMoreText();
    } else {
      this.readLessText();
    }
  }

  readMoreText(): void {
    this.textToShow = this.text;
    this.hasMoreText = false;
  }

  readLessText(): void {
    this.textToShow = this.text.substring(0, this.maxLength);
    this.hasMoreText = true;
  }
}
