import { Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExplorePageComponent } from './explore-page/explore-page.component';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentTabIndex: number = 0;
  // params: any;
  // explorePageComponent: ExplorePageComponent;

  constructor(public viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      // this.params = params;
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

  // (activate)='onExplorePageLoaded($event)'
  // onExplorePageLoaded(explorePageComponent: ExplorePageComponent) {
  //   this.explorePageComponent = explorePageComponent;
  // }
}