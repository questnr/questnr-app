import { Component, Input, OnInit } from '@angular/core';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-vertical-line',
  templateUrl: './vertical-line.component.html',
  styleUrls: ['./vertical-line.component.scss']
})
export class VerticalLineComponent implements OnInit {
  @Input() width: number = 1;
  @Input() color: string = qColors.$gray;

  constructor() { }

  ngOnInit() {
  }

}
