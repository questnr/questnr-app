import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qn-feed-text',
  templateUrl: './feed-text.component.html',
  styleUrls: ['./feed-text.component.scss']
})
export class FeedTextComponent implements OnInit {
  @Input() text: string;
  @Input() maxLength: number = 300;
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
      if (this.hashTagsData != {}) {
        this.hashTagPosList = Object.keys(this.hashTagsData);
      }
      if (this.text.length > this.maxLength && this.readMore) {
        this.readMoreText();
      } else {
        this.textToShow = this.text;
        this.hasMoreText = false;
      }
    }
  }
  // calculateNewLinePositions(text: string) {
  //   for (let pos = text.indexOf("\n"); pos != -1; pos = text.indexOf("\n", pos + 1)) {
  //     this.newLinePositionList.push(pos);
  //   }
  // }


  readMoreText(): void {
    if ((this.countReadMoreTimes + 1) * this.maxLength > this.text.length) {
      this.appendText(this.textToShow.length, this.text.length);
      this.hasMoreText = false;
    } else {
      this.appendText(this.textToShow.length, (this.countReadMoreTimes + 1) * this.maxLength);
      this.hasMoreText = true;
    }
  }

  appendText(startPos: number, endPos: number): void {
    for (let i = 0; i < this.hashTagPosList.length; i++) {
      if (endPos > Number(this.hashTagPosList[i])
        && endPos < (Number(this.hashTagPosList[i]) + Number(this.hashTagsData[this.hashTagPosList[i]]))) {
        endPos = (Number(this.hashTagPosList[i]) + Number(this.hashTagsData[this.hashTagPosList[i]]));
      }
    }
    this.textToShow += this.text.substring(startPos, endPos);
    this.countReadMoreTimes++;
  }
}
