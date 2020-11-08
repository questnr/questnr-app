import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qn-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
  @Input() space = 1;

  constructor() { }

  ngOnInit() {
  }

}
