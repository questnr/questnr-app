import { Component, OnInit } from '@angular/core';
import { EventData } from '@nativescript-community/ui-image';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { GridLayout } from '@nativescript/core';
import { CardView } from '@nstudio/nativescript-cardview';
import { Video } from '@nstudio/nativescript-exoplayer';
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import * as orientation from 'nativescript-orientation';
import { AuthService } from './services/auth.service';
import { CommunityMenuService } from './services/community-menu.service';
import { LoaderService } from './services/loader.service';
import { OverlayReasonType, OverlayService } from './services/overlay.service';
import { PostMenuService } from './services/post-menu.service';
import { UserInteractionService } from './services/user-interaction.service';
import { qColors } from './_variables';

const tnsfx = require('nativescript-effects');
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("VideoPlayer", () => Video);
registerElement("PullToRefresh", () => PullToRefresh);
registerElement('CardView', () => CardView);

@Component({
  selector: 'qn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  qColors = qColors;

  constructor(public loaderService: LoaderService,
    public postMenuService: PostMenuService,
    public communityMenuService: CommunityMenuService,
    public userInteractionService: UserInteractionService,
    public overlayService: OverlayService,
    private authService: AuthService) {
    // Set orientation to portrait
    orientation.setOrientation("portrait");
    // Disable rotation
    orientation.disableRotation();
  }

  ngOnInit(): void {
    // To navigate to community page
    // setTimeout(() => {
    //   this.routerExtensions.navigate(['/', GlobalConstants.communityPath,
    //     // 'questnr--8300581547822330027'])
    //     'electronjs--5368833300105140974'])
    //   // 'javascript--5159400168648600117'])
    // }, 1000);
    this.authService.saveRemoveUser();
  }

  onMainLayoutLoaded(args) {
    let page = args.object as GridLayout;
    this.postMenuService.isShowing$.subscribe((showMenu) => {
      // if (showMenu) {
      //   page.borderRadius = 10;
      //   page.backgroundColor = qColors.$black;
      //   page.animate({
      //     duration: 1000,
      //     // scale: { x: 0.95, y: 0.95 },
      //     opacity: 0.6,
      //     curve: new CubicBezierAnimationCurve(.54, .35, .19, .97)
      //   });
      // } else {
      //   console.log("Hide")
      //   page.animate({
      //     duration: 1000,
      //     // scale: { x: 1, y: 1 },
      //     opacity: 1,
      //     curve: new CubicBezierAnimationCurve(.54, .35, .19, .97)
      //   }).then(() => {
      //     page.borderRadius = 0;
      //   });
      // }
    });
  }

  onMainLayoutTap(args: EventData) {
    if (this.overlayService.reasonType === OverlayReasonType.postMenu) {
      this.postMenuService.onRequestEnd();
    } else if (this.overlayService.reasonType === OverlayReasonType.communityMenu) {
      this.communityMenuService.onRequestEnd();
    }
  }
}
