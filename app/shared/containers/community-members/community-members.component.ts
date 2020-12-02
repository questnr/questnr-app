import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { ObservableArray } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { RadListView } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { AuthService } from '~/services/auth.service';
import { CommunityMembersService } from '~/services/community-members.service';
import { CommunityService } from '~/services/community.service';
import { GlobalConstants } from '~/shared/constants';
import { Community, CommunityPrivacy, CommunityProfileMeta, CommunityUsersListViewType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { RelationType } from '~/shared/models/relation-type';
import { UserListType } from '~/shared/models/user-list.model';
import { User } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-members',
  templateUrl: './community-members.component.html',
  styleUrls: ['./community-members.component.scss']
})
export class CommunityMembersComponent implements OnInit {
  qColors = qColors;
  @Input() community: Community;
  @Output() onPendingRequestCount = new EventEmitter();
  isLoading: boolean = false;
  fetchCommunityMembersSubscriber: Subscription;
  isAllowedIntoCommunity: boolean;
  communityMemberList: ObservableArray<User>;
  relationshipType: RelationType;
  userListTypeClass = UserListType;
  communityUsersListViewTypeClass = CommunityUsersListViewType;
  isOwner: boolean = false;
  numberOfMembers: number;
  loggedInUserId;
  pendingRequests: number = 0;
  pageSize = "8";
  maxMember: number = 8;
  isEnd: boolean = false;

  constructor(private authService: AuthService,
    private communityService: CommunityService,
    public communityMembersService: CommunityMembersService,
    private routerExtensions: RouterExtensions) {
    this.loggedInUserId = this.authService.getStoredUserProfile().id;
  }

  ngOnInit() {
    if (this.community) {
      this.setCommunity(this.community);
    }
  }

  setCommunity(community): void {
    this.community = community;
    this.isAllowedIntoCommunity = this.communityService.isAllowedIntoCommunity(this.community);
    if (this.isAllowedIntoCommunity) {
      this.communityMemberList = new ObservableArray<User>();
      this.getCommunityMembers();
      // this.getCommunityMetaInfo(this.communitySlug);
    } else {
      this.restartCommunityMembersList();
      this.getCommunityMetaInfo();
    }
    this.isOwner = this.communityService.isOwner(this.community);
    this.getCommunityJoinRequestsCount();
  }

  restartCommunityMembersList() {
    this.communityMemberList = new ObservableArray<User>();
    if (this.fetchCommunityMembersSubscriber) {
      this.fetchCommunityMembersSubscriber.unsubscribe();
    }
  }

  getCommunityMembers() {
    this.isLoading = true;
    this.fetchCommunityMembersSubscriber =
      this.communityMembersService.getCommunityMembers(this.community.slug, 0, this.pageSize)
        .subscribe((data: QPage<User>) => {
          this.isLoading = false;
          data.content.forEach((user: User) => {
            this.communityMemberList.push(user);
          });
          this.numberOfMembers = data.totalElements;
          this.isEnd = data.last;
          // console.log("getCommunityMembers", data);
        }, error => {
          // console.log('something went wrong while fetching community Members.');
          this.isLoading = false;
        });
  }

  getCommunityMetaInfo() {
    this.communityService.getCommunityMetaInfoWithParams(this.community.slug, 'followers')
      .subscribe((data: CommunityProfileMeta) => {
        this.numberOfMembers = data.followers;
      });
  }
  getCommunityJoinRequestsCount() {
    if (this.community.communityPrivacy == CommunityPrivacy.pri
      && this.isOwner)
      this.communityService.getCommunityMetaInfoWithParams(this.community.slug, 'totalRequests')
        .subscribe((data: CommunityProfileMeta) => {
          this.pendingRequests = data.totalRequests;
        });
    this.onPendingRequestCount.emit(this.pendingRequests);
  }

  onMemberListViewLoaded(args): void {
    let radListView = args.object as RadListView;
    // radListView.androidListView.setPadding(0, 0, 0, 0);
  }

  openUserListView(args) {
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

  templateSelector(item, index, items) {
    return 'member';
  }
}
