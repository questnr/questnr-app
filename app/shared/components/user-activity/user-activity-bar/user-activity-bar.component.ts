import { AfterViewInit, Component, Input } from '@angular/core';
import { Animation, GridLayout } from '@nativescript/core';
type PaneType = 'left' | 'right';

@Component({
  selector: 'qn-activity-bar',
  templateUrl: './user-activity-bar.component.html',
  styleUrls: ['./user-activity-bar.component.scss']
})
export class UserActivityBarComponent implements AfterViewInit {
  @Input() activePane: PaneType = 'left';
  isVisible: boolean = true;
  activityBarView: GridLayout;

  constructor() { }

  ngAfterViewInit(): void {
  }

  setActivePane(activePane: PaneType): void {
    this.activePane = activePane;
    if (this.activePane === 'left') {
      let leftPane: any = this.activityBarView.getViewById('left-pane');
      let rightPane: any = this.activityBarView.getViewById('right-pane');
      let parentWidth = this.activityBarView.getActualSize().width;
      var definitions = new Array();
      definitions.push({ target: leftPane, translate: { x: 0, y: 0 }, duration: 300 });
      definitions.push({ target: rightPane, translate: { x: parentWidth, y: 0 }, duration: 300 });
      var animationSet = new Animation(definitions);
      animationSet.play().then(function () {
      }).catch(function (e) {
        console.log(e.message);
      });
    } else if (this.activePane === 'right') {
      let leftPane: any = this.activityBarView.getViewById('left-pane');
      let rightPane: any = this.activityBarView.getViewById('right-pane');
      let parentWidth = this.activityBarView.getActualSize().width;
      var definitions = new Array();
      definitions.push({ target: leftPane, translate: { x: -parentWidth, y: 0 }, duration: 300 });
      definitions.push({ target: rightPane, translate: { x: 0, y: 0 }, duration: 300 });
      var animationSet = new Animation(definitions);
      animationSet.play().then(function () {
      }).catch(function (e) {
        console.log(e.message);
      });
    }
  }

  onActivityBarViewLoaded(args): void {
    this.activityBarView = args.object;
  }
}
