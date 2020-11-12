import { Component, OnInit, Input } from '@angular/core';
import { MetaData } from '~/shared/models/common.model';

@Component({
  selector: 'qn-time-string',
  templateUrl: './time-string.component.html',
  styleUrls: ['./time-string.component.scss']
})
export class TimeStringComponent implements OnInit {
  @Input() metaData: MetaData;

  constructor() { }

  ngOnInit(): void {
  }

  timeString(): string {
    let value = this.metaData.timeString == 'now' ? 'just now' : this.metaData.timeString + ' ago';
    if (this.metaData.edited)
      return value + " / edited";
    return value;
  }
}
