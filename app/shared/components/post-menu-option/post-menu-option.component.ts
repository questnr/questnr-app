import { Component, Input, OnInit } from '@angular/core';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-post-menu-option',
  templateUrl: './post-menu-option.component.html',
  styleUrls: ['./post-menu-option.component.scss']
})
export class PostMenuOptionComponent implements OnInit {
  @Input() border: boolean = false;
  @Input() icon: string;
  @Input() text: string;
  qColors = qColors;

  constructor() { }

  ngOnInit() {
  }

}
