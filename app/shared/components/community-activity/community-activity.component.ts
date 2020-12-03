import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Page, StackLayout } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { CommunityActivityService } from '~/services/community-activity.service';
import { UserFollowersService } from '~/services/user-followers.service';
import { GlobalConstants } from '~/shared/constants';
import { Community, CommunityActivityPositionType, CommunityProfileMeta } from '~/shared/models/community.model';
import { UserListData, UserListType } from '~/shared/models/user-list.model';
import { qColors, qRadius } from '~/_variables';

@Component({
  selector: 'qn-community-activity',
  templateUrl: './community-activity.component.html',
  styleUrls: ['./community-activity.component.scss']
})
export class CommunityActivityComponent implements OnInit {
  qRadius = qRadius;
  qColors = qColors;
  @Input() community: Community;
  @Input() communityInfo: CommunityProfileMeta;
  @Input() actAlone: boolean = true;
  @Input() positioning: CommunityActivityPositionType = CommunityActivityPositionType.communityPage;
  @Output() onScrollToPostEvent = new EventEmitter();
  communityActivityPositionTypeClass = CommunityActivityPositionType;
  communitySlug: string;
  isLeftVisible: boolean = true;
  isLoading: boolean = false;

  constructor(public route: ActivatedRoute,
    public _communityActivityService: CommunityActivityService,
    public followersService: UserFollowersService,
    private routerExtensions: RouterExtensions,
    public page: Page) {
  }

  ngOnInit(): void {
    if (!this.communityInfo && this.actAlone)
      this.getCommunityInfo();
    else
      this.isLoading = true;
  }

  setCommunity(community: Community) {
    this.community = community;
  }

  setCommunityInfo(communityInfo: CommunityProfileMeta) {
    if (!this.actAlone) {
      this.communityInfo = communityInfo;
      this.isLoading = false;
    }
  }

  getCommunityInfo() {
    // console.log('entered');
    this.isLoading = true;
    this._communityActivityService.getCommunityMetaInfo(this.community?.slug).subscribe((res: CommunityProfileMeta) => {
      this.isLoading = false;
      this.communityInfo = res;
      // console.log("communityInfo", res);
    }, error => {
      // console.log(error.error.errorMessage);
    });
  }

  openCommunityMembersDialog(args) {
    this.routerExtensions.navigate(['/',
      GlobalConstants.userListPath,
      UserListType.members
    ],
      {
        queryParams: {
          community: JSON.stringify(this.community),
          type: UserListType.members
        },
        animated: true,
        transition: {
          name: "slideLeft",
          duration: 400,
          curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
        }
      })
  }

  scrollToPosts(args){
    this.onScrollToPostEvent.emit()
  }
}
