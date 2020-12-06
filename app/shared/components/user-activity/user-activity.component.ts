import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { UserActivityService } from '~/services/user-activity.service';
import { UserFollowersService } from '~/services/user-followers.service';
import { GlobalConstants } from '~/shared/constants';
import { CommunityListType } from '~/shared/models/community.model';
import { UserListType } from '~/shared/models/user-list.model';
import { User, UserInfo } from '~/shared/models/user.model';
import { qColors, qRadius } from '~/_variables';
import { UserActivityBarComponent } from './user-activity-bar/user-activity-bar.component';

@Component({
  selector: 'qn-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  qRadius = qRadius;
  qColors = qColors;
  @Input() userInfo: UserInfo;
  @Input() user: User;
  @Input() actAlone: boolean = false;
  @Output() onScrollToPostEvent = new EventEmitter();
  isLoading: boolean = true;
  communityListTypeClass = CommunityListType;
  userListTypeClass = UserListType;
  isLeftVisible: boolean = false;
  activityBarCompRef: UserActivityBarComponent;
  @ViewChild('activityBarComp')
  set activityBarComp(activityBarCompRef: UserActivityBarComponent) {
    this.activityBarCompRef = activityBarCompRef;
    if (this.activityBarCompRef)
      this.onArrowTap(true);
  }

  constructor(public route: ActivatedRoute,
    public userActivityService: UserActivityService,
    public followersService: UserFollowersService,
    private routerExtensions: RouterExtensions) {
  }

  ngOnInit(): void {
    if (this.actAlone && this.user) {
      this.getUserInfo();
    }
  }

  getUserInfo() {
    this.isLoading = true;
    this.userActivityService.getUserInfo(this.user.slug).subscribe((res: UserInfo) => {
      this.userInfo = res;
      this.isLoading = false;
    }, error => {
      console.log(error.error.errorMessage);
    });
  }

  setData(user: User, userInfo: UserInfo) {
    this.user = user;
    this.userInfo = userInfo;
    this.isLoading = false;
  }

  setUserInfo(userInfo: UserInfo): void {
    this.userInfo = userInfo;
    this.isLoading = false;
  }

  openUserListPage(type: UserListType): void {
    this.routerExtensions.navigate(['/',
      GlobalConstants.userListPath,
      type
    ],
      {
        queryParams: {
          user: JSON.stringify(this.user),
          type: type
        },
        animated: true,
        transition: {
          name: "slideLeft",
          duration: 400,
          curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
        }
      });
  }

  openCommunityListPage(communityListType: CommunityListType): void {

  }

  onArrowTap(isLeftVisible: boolean) {
    this.isLeftVisible = isLeftVisible;
    this.activityBarCompRef.setActivePane(this.isLeftVisible ? 'left' : 'right')
  }

  scrollToPosts() {
    this.onScrollToPostEvent.emit();
  }
}
