import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableArray } from '@nativescript/core';
import { LoadOnDemandListViewEventData, RadListView } from 'nativescript-ui-listview';
import { ApiService } from '~/services/api.service';
import { CommunityMembersService } from '~/services/community-members.service';
import { CommunityService } from '~/services/community.service';
import { InviteUserService } from '~/services/invite-user.service';
import { UserListService } from '~/services/user-list.service';
import { UserProfileService } from '~/services/user-profile.service';
import { GlobalConstants } from '~/shared/constants';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'qn-community-list-page',
  templateUrl: './community-list-page.component.html',
  styleUrls: ['./community-list-page.component.scss']
})
export class CommunityListPageComponent implements OnInit {
  params: any;
  @ViewChild('elementOnHTML') elementOnHTML: ElementRef;
  community: Community;
  user: User;
  postActionId: number;
  type: CommunityListType;

  listTitle: string;
  isLoading: boolean = false;
  isInviteList: boolean = false;
  isCommunityRequest: boolean = false;
  communityList: ObservableArray<User>;
  searchResultList: User;
  searchResult = false;
  noResultFound = false;
  endOfResult: boolean = false;
  page: number = 0;
  pageSize: string = "4";
  hasTotalPages: number;
  scrollCached;
  isCommunityOwnerActionsAllowed: boolean = false;
  currentPath: string = GlobalConstants.userPath;
  fetchDeligateFunction: Function;
  listView: RadListView;

  @ViewChild('listContainer') listContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public userProfileCardService: UserProfileService,
    // tslint:disable-next-line:max-line-length
    public userListService: UserListService,
    public apiService: ApiService,
    public communityMembersService: CommunityMembersService,
    public communityService: CommunityService,
    private inviteUserService: InviteUserService,
    public viewContainerRef: ViewContainerRef) {
    // this.route.paramMap.subscribe((params: ParamMap) => {      });
    this.route.queryParams.subscribe((params: any) => {
      this.params = params;
      this.type = params.type as CommunityListType;
      this.user = JSON.parse(params.user);
      this.communityList = new ObservableArray<User>();
      this.fetchData();
    })
  }

  ngOnInit(): void {
  }

  fetchData() {
    this.isLoading = true;
    if (this.type === CommunityListType.owned) {
      this.getUserOwnedCommunity();
      this.listTitle = "Owned Communities";
    } else if (this.type === CommunityListType.joined) {
      this.getJoinedCommunities();
      this.listTitle = "Joined Communities";
    } else if (this.type === CommunityListType.suggested) {
      this.listTitle = "Communities You Might Like";
    }
  }

  getUserOwnedCommunity() {
    this.apiService.getUserOwnedCommunity(this.user.userId, this.page)
      .subscribe((res: QPage<Community>) => {
        this.endOfResult = res.last;
        if (res.content.length) {
          this.afterDataFetched(res.totalPages);
          res.content.forEach(community => {
            this.communityList.push(community);
          });
        } else {
          this.endOfResult = true;
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.endOfResult = true;
      });
  }

  getJoinedCommunities() {
    this.apiService.getJoinedCommunities(this.user.userId, this.page).subscribe(
      (res: QPage<Community>) => {
        this.endOfResult = res.last;
        if (res.content.length) {
          this.afterDataFetched(res.totalPages);
          res.content.forEach(community => {
            this.communityList.push(community);
          });
        } else {
          this.endOfResult = true;
        }
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        this.endOfResult = true;
      }
    );
  }

  afterDataFetched(totalPages) {
    this.hasTotalPages = totalPages;
    if (this.hasTotalPages == this.page + 1) {
      this.endOfResult = true;
    }
    this.page++;
    this.isLoading = false;
  }

  removeMemberFromCommunity(processingUser: User) {
    // let closeSubject = this.confirmDialogService.openRemoveMemberConfirmDialog({
    //   user: processingUser,
    //   community: this.community
    // });

    // closeSubject.subscribe((result) => {
    //   if (result?.data) {
    //     this.userList = this.userList.filter((communityMember: User) => {
    //       return communityMember.userId !== processingUser.userId
    //     });
    //   }
    // });
  }

  onUserListViewLoaded(args): void {
  }

  public onLoadMoreItemsRequested(args: LoadOnDemandListViewEventData) {
    const that = new WeakRef(this);
    this.listView = args.object;
    if (!this.endOfResult) {
      setTimeout(() => {
        that.get().fetchDeligateFunction();
        this.listView.notifyLoadOnDemandFinished();
      }, 1500);
    } else {
      args.returnValue = false;
      this.listView.notifyLoadOnDemandFinished(true);
    }
  }


  templateSelector(item, index, items) {
    return 'userView';
  }

  // onLoadOnDemandLoaded(args) {
  //   console.log("onLoadOnDemandLoaded");
  //   setTimeout(() => {
  //     this.listView.nativeView.collectionView.visibleCells[0].activityIndicator.color = qColors.$white;
  //     this.listView.nativeView.collectionView.visibleCells[0].activityIndicator.backgroundColor = qColors.$heading;
  //   });
  // }
}
