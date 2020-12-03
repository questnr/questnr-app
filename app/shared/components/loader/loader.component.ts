import { Component, Input, OnInit } from '@angular/core';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() radius: number = 30;
  @Input() color: string = qColors.$black;

  constructor() { }

  ngOnInit() {
  }

}
