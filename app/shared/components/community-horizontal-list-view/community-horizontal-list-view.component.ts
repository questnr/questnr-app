import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { GlobalConstants } from '~/shared/constants';
import { CommunityListMatCardType } from '~/shared/models/community-list.model';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { User } from '~/shared/models/user.model';
import { CommunityHorizontalListViewSkeletonComponent } from '~/shared/skeletons/community-horizontal-list-view-skeleton/community-horizontal-list-view-skeleton.component';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-horizontal-list-view',
  templateUrl: './community-horizontal-list-view.component.html',
  styleUrls: ['./community-horizontal-list-view.component.scss']
})
export class CommunityHorizontalListViewComponent implements OnInit {
  qColors = qColors;
  communityList: Community[];
  userId: number;
  @Input() totalCommunityCount: number = 0;
  @Input() user: User;
  @Input() communityListType: CommunityListType;
  @Input() showJoinButton: boolean = true;
  isOwner: boolean = false;
  communityBoxTitle: string;
  CommunityListMatCardTypeClass = CommunityListMatCardType;
  loadingCommunities: boolean = true;
  communityPath: string = GlobalConstants.communityPath;
  communityListViewLoaderCompRef: CommunityHorizontalListViewSkeletonComponent;
  @ViewChild("communityListViewLoaderComp")
  set communityListViewLoaderComp(communityListViewLoaderCompRef: CommunityHorizontalListViewSkeletonComponent) {
    this.communityListViewLoaderCompRef = communityListViewLoaderCompRef;
  }

  constructor(public apiService: ApiService,
    public authService: AuthService,
    private routerExtensions: RouterExtensions) {
  }

  ngOnInit(): void {
    this.loadingCommunities = true;
  }

  ngAfterViewInit(): void {
    if (this.communityListType == CommunityListType.joined) {
      this.communityBoxTitle = "Joined Communities";
    } else if (this.communityListType == CommunityListType.owned) {
      this.communityBoxTitle = "Owned Communities";
    } else if (this.communityListType == CommunityListType.suggested) {
      this.communityBoxTitle = "Communities You Might Like";
      this.showJoinButton = false;
    }
  }

  startLoading(totalCommunityCount) {
    this.totalCommunityCount = totalCommunityCount;
    this.communityListViewLoaderCompRef?.setListItems(this.totalCommunityCount);
    this.loadingCommunities = true;
  }

  setData(communityList: Community[], isOwner: boolean = false) {
    this.isOwner = isOwner;
    this.communityList = communityList;
    this.loadingCommunities = false;
  }

  stopLoading() {
    this.loadingCommunities = false;
  }

  templateSelector(item, index, items) {
    return 'communityView';
  }

  onOpenCommunityListPage(args) {
    this.routerExtensions.navigate(['/',
      GlobalConstants.communityListPath,
      this.communityListType
    ],
      {
        queryParams: {
          user: JSON.stringify(this.user),
          type: this.communityListType
        },
        animated: true,
        transition: {
          name: "slideLeft",
          duration: 400,
          curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
        }
      });
  }
}
