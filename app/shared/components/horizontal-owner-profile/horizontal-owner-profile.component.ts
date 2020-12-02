import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { GlobalConstants } from '~/shared/constants';
import { User } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-horizontal-owner-profile',
  templateUrl: './horizontal-owner-profile.component.html',
  styleUrls: ['./horizontal-owner-profile.component.scss']
})
export class HorizontalOwnerProfileComponent implements OnInit {
  qColors = qColors;
  @Input() user: User;
  userPath: string = GlobalConstants.userPath;
  isProfileOpen: boolean = false;
  userDetailsComp: any;
  caretObj: any;

  constructor(private routerExtensions: RouterExtensions) {
  }

  ngOnInit(): void {
  }

  onUserDetailsLoaded(args): void {
    this.userDetailsComp = args.object;
    this.hideUserDetails();
  }

  showUserDetails(): void {
    this.userDetailsComp.show().then(() => {
      this.userDetailsComp.animate({
        translate: { x: 0, y: 0 },
        duration: 800,
        curve: new CubicBezierAnimationCurve(.54, .35, .15, .95)
      });
    });
  }

  hideUserDetails(): void {
    this.userDetailsComp.animate({
      translate: { x: 0, y: -30 },
      duration: 600,
      curve: new CubicBezierAnimationCurve(.15, .53, .78, .8)
    }).then(() => {
      this.userDetailsComp.hide();
    });
  }

  onCaretLoaded(args): void {
    this.caretObj = args.object;
  }

  onSlideProfile(args): void {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) {
      this.caretObj.animate({
        rotate: 180,
        duration: 600,
        curve: new CubicBezierAnimationCurve(.15, .53, .78, .8)
      });
      this.showUserDetails();
    } else {
      this.caretObj.animate({
        rotate: 0,
        duration: 600,
        curve: new CubicBezierAnimationCurve(.15, .53, .78, .8)
      });
      this.hideUserDetails();
    }
  }

  setUser(user: User) {
    this.user = user;
  }

  openUserProfile() {
    if (this.user?.slug) {
      this.routerExtensions.navigate(['/', GlobalConstants.userPath, this.user.slug],
        {
          animated: true,
          transition: {
            name: "slideLeft",
            duration: 400,
            curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
          }
        });
    }
  }
}
