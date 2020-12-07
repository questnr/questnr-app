import { Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTabIndex: number = 0;
  constructor(public viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.currentTabIndex = params?.tabIndex ? params.tabIndex : 0;
    });
  }

  ngOnInit() {
  }

  onSelectedIndexChanged(args) {
    // console.log("onSelectedIndexChanged");
  }

  // (activate)='onCreateCommunityTabActivate($event)'
  // onCreateCommunityTabActivate(createCommunityComponent: CreateCommunityPageComponent) {
  //   createCommunityComponent.startOpeningAnimation();
  // }
}