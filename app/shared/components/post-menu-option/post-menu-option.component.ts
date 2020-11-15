import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qn-post-menu-option',
  templateUrl: './post-menu-option.component.html',
  styleUrls: ['./post-menu-option.component.scss']
})
export class PostMenuOptionComponent implements OnInit {
  @Input() border: boolean = false;
  @Input() icon: string;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
