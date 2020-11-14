import { Component, Input, OnInit } from '@angular/core';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss']
})
export class HrComponent implements OnInit {
  @Input() height = "1px";
  @Input() color: string = qColors.$hrBackground;

  constructor() { }

  ngOnInit() {
  }
}
