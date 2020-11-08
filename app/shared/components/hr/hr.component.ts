import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qn-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss']
})
export class HrComponent implements OnInit {
  @Input() height = "1px";

  constructor() { }

  ngOnInit() {
  }
}
