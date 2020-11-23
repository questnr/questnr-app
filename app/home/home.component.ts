import { Component, ViewContainerRef } from '@angular/core';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTabIndex: number = 0;
  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  onSelectedIndexChanged(args) {
    this.currentTabIndex = args.newIndex;
  }

  // (activate)='onCreateCommunityTabActivate($event)'
  // onCreateCommunityTabActivate(createCommunityComponent: CreateCommunityPageComponent) {
  //   createCommunityComponent.startOpeningAnimation();
  // }
}