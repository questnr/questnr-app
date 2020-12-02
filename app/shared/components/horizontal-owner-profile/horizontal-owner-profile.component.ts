import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { GlobalConstants } from '~/shared/constants';
import { User } from '~/shared/models/user.model';

@Component({
  selector: 'qn-horizontal-owner-profile',
  templateUrl: './horizontal-owner-profile.component.html',
  styleUrls: ['./horizontal-owner-profile.component.scss']
})
export class HorizontalOwnerProfileComponent implements OnInit {
  @Input() user: User;
  userPath: string = GlobalConstants.userPath;

  constructor(private routerExtensions: RouterExtensions) {
  }

  ngOnInit(): void {
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
