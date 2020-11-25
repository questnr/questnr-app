import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventData } from '@nativescript-community/ui-image';
import { ObservableArray, ScrollView } from '@nativescript/core';
import { LoadOnDemandListViewEventData, RadListView } from 'nativescript-ui-listview';
import { CommunityMembersService } from '~/services/community-members.service';
import { CommunityService } from '~/services/community.service';
import { InviteUserService } from '~/services/invite-user.service';
import { UserFollowerService } from '~/services/user-follower.service';
import { UserListService } from '~/services/user-list.service';
import { UserProfileService } from '~/services/user-profile.service';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { Community } from '~/shared/models/community.model';
import { LikeAction } from '~/shared/models/like-action.model';
import { QPage } from '~/shared/models/page.model';
import { UserListType } from '~/shared/models/user-list.model';
import { User } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'qn-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss']
})
export class UserListPageComponent implements OnInit {
  params: any;
  @ViewChild('elementOnHTML') elementOnHTML: ElementRef;
  community: Community;
  user: User;
  postActionId: number;
  type: UserListType;

  listTitle: string;
  isLoading: boolean = false;
  isInviteList: boolean = false;
  isCommunityRequest: boolean = false;
  userList: ObservableArray<User>;
  searchResultList: User;
  searchResult = false;
  noResultFound = false;
  endOfResult: boolean = false;
  page: number = 0;
  pageSize: string = "4";
  hasTotalPage: number;
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
    public followersService: UserFollowerService,
    public communityMembersService: CommunityMembersService,
    public communityService: CommunityService,
    private inviteUserService: InviteUserService,
    public viewContainerRef: ViewContainerRef) {
    // this.route.paramMap.subscribe((params: ParamMap) => {      });
    this.route.queryParams.subscribe((params: any) => {
      this.params = params;
      this.type = params.type as UserListType;
      this.userList = new ObservableArray<User>();
      this.fetchData();
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.listContainer.nativeElement.addEventListener('scroll', this.onScroll, true);
    // let timer = setInterval(() => {
    //   if (!this.isLoading) {
    //     clearInterval(timer);
    //     if (this.hasTotalPage > this.page) {
    //       this.isLoading = true;
    //       // ++this.page;
    //       this.fetchData();
    //     }
    //   }
    // }, 1000);
  }

  // onScroll(event: EventData): void {
  //   if (!this.scrollCached) {
  //     setTimeout(() => {
  //       const scrollView = <ScrollView>event.object,
  //         verticalOffset = scrollView.verticalOffset,
  //         scrollableHeight = scrollView.scrollableHeight,
  //         height = scrollView.getActualSize().height,
  //         visibleRange = verticalOffset + height;
  //       if (visibleRange >= scrollableHeight - 300) {
  //         if (this.userList.length >= 0 && !this.endOfResult) {
  //           // console.log('check network call');
  //           if (!this.isLoading && this.hasTotalPage > this.page) {
  //             this.fetchData();
  //           }
  //         }
  //       }
  //       this.scrollCached = null;
  //     }, 100);
  //   }
  //   this.scrollCached = event;
  // }

  ngOnDestroy() {
  }

  fetchData() {
    this.isLoading = true;
    if (this.type === UserListType.following) {
      this.listTitle = 'Following To';
      this.user = JSON.parse(this.params.user) as User;
      this.fetchDeligateFunction = this.getFollowingUser;
      this.getFollowingUser();
    } else if (this.type === UserListType.followers) {
      this.listTitle = 'Followers';
      this.user = JSON.parse(this.params.user) as User;
      this.fetchDeligateFunction = this.getUserFollowers;
      this.getUserFollowers();
    } else if (this.type === UserListType.like) {
      this.listTitle = 'User Likes';
      this.postActionId = Number(this.params.postActionId);
      this.fetchDeligateFunction = this.getUserLikedList;
      this.getUserLikedList();
    } else if (this.type === UserListType.members) {
      this.listTitle = 'Members';
      this.community = JSON.parse(this.params.community) as Community;
      if (this.communityService.isOwner(this.community)) {
        this.isCommunityOwnerActionsAllowed = true;
      } else {
        this.isCommunityOwnerActionsAllowed = false;
      }
      this.fetchDeligateFunction = this.getCommunityMembers;
      this.getCommunityMembers();
    } else if (this.type === UserListType.requests) {
      this.listTitle = 'Requests';
      this.community = JSON.parse(this.params.community) as Community;
      this.isCommunityRequest = true;
      this.fetchDeligateFunction = this.getCommunityJoinRequests;
      this.getCommunityJoinRequests();
    } else if (this.type === UserListType.inviteUserList) {
      this.listTitle = 'Users';
      // To show invite button
      this.isInviteList = true;
      this.community = JSON.parse(this.params.community) as Community;
      // console.log('this', this.data);
      this.fetchDeligateFunction = this.getInviteUserList;
      this.getInviteUserList();
    }
  }

  getUserImage(src) {
    if (src == null) {
      return StaticMediaSrc.userFile;
    } else {
      return src;
    }
  }

  follow(id) {
    this.userProfileCardService.followMe(id).subscribe((res: any) => {
      // console.log(res);
    }, error => {
      // console.log(error.error.errorMessage);
    });
  }

  searchUserList(searchString) {
    this.noResultFound = false;
    this.isLoading = true;
    // tslint:disable-next-line:triple-equals
    if (searchString != '') {
      setTimeout(() => {
        this.userListService.searchUser(searchString).subscribe((res: any) => {
          // console.log('serach resuult for :' + searchString + 'is===', res);
          this.searchResultList = res.content;
          this.searchResult = true;
          if (res.content.length === 0) {
            this.noResultFound = true;
          } else {
            this.noResultFound = false;
          }
          this.isLoading = false;
        }, error => {
          // console.log(error.error.errorMessage);
          this.searchResult = false;
          this.isLoading = false;
          this.noResultFound = true;
        });
      }, 2000);
    } else {
      this.isLoading = false;
      this.searchResult = false;
    }
  }

  getUserFollowers() {
    if (!this.user.userId) {
      return;
    }
    this.followersService.getUserFollowers(this.user.userId, this.page).subscribe((data: QPage<User>) => {
      // console.log('getUserFollowers', res);
      if (data.last) {
        this.endOfResult = true;
      }
      if (data.content.length) {
        this.afterDataFetched(data.totalPages);
        data.content.forEach(user => {
          this.userList.push(user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
      // console.log('follower content', this.userList);
    }, error => {
      // console.log(error.error.errorMessage);
      this.isLoading = false;
    });
  }

  getFollowingUser() {
    if (!this.user.userId) {
      return;
    }
    this.followersService.getFollowedBy(this.user.userId, this.page).subscribe((data: QPage<User>) => {
      // console.log('getFollowingUser', res);
      if (data.last) {
        this.endOfResult = true;
      }
      if (data.content.length) {
        this.afterDataFetched(data.totalPages);
        data.content.forEach(user => {
          this.userList.push(user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
      // console.log('follower content', this.userList);
    }, error => {
      // console.log(error.error.errorMessage);
      this.isLoading = false;
    });
  }

  getUserLikedList() {
    if (!this.postActionId) {
      return;
    }
    this.followersService.getUserLikedList(this.postActionId, this.page).subscribe((data: QPage<LikeAction>) => {
      // console.log('liked content', res);
      if (data.last) {
        this.endOfResult = true;
      }
      if (data.content.length) {
        this.afterDataFetched(data.totalPages);
        data.content.forEach(userLikedData => {
          this.userList.push(userLikedData.user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
      // console.log('follower content', this.userList);
    }, error => {
      // console.log(error.error.errorMessage);
      this.isLoading = false;
    });
  }


  getCommunityMembers() {
    if (!this.community.slug) {
      return;
    }
    this.communityMembersService.getCommunityMembers(this.community.slug, this.page, this.pageSize).subscribe((data: QPage<User>) => {
      if (data.last) {
        this.endOfResult = true;
      }
      if (data.content.length) {
        this.afterDataFetched(data.totalPages);
        data.content.forEach(user => {
          this.userList.push(user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  getCommunityJoinRequests() {
    if (!this.community.communityId) {
      return;
    }
    this.communityService.getCommunityJoinRequests(this.community.communityId, this.page).subscribe((res: any) => {
      if (res.content.length) {
        this.afterDataFetched(res.totalPages);
        res.content.forEach(user => {
          this.userList.push(user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
    });
  }

  getInviteUserList() {
    if (!this.community.communityId) {
      return;
    }
    this.inviteUserService.getInviteUserList(this.community.communityId, this.page).subscribe((res: any) => {
      // console.log('getUserFollowers', res);
      if (res.content.length) {
        this.afterDataFetched(res.totalPages);
        res.content.forEach(user => {
          this.userList.push(user);
        });
      } else {
        this.isLoading = false;
        this.endOfResult = true;
      }
      // console.log('follower content', this.userList);
    }, error => {
      // console.log(error.error.errorMessage);
      this.isLoading = false;
    });
  }

  afterDataFetched(totalPages) {
    this.hasTotalPage = totalPages;
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
