import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'qn-horizontal-profile-skeleton',
  templateUrl: './horizontal-profile-skeleton.component.html',
  styleUrls: ['./horizontal-profile-skeleton.component.scss']
})
export class HorizontalProfileSkeletonComponent implements OnInit {
  @Input() items: number = 1;
  @Input() height: number = 30;
  itemList: number[] = [];

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
    this.itemList = Array(this.items).fill(0);
  }

  ngAfterViewInit(): void {
  }
}
