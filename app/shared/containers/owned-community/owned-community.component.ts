import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { CommunityHorizontalListViewComponent } from '~/shared/components/community-horizontal-list-view/community-horizontal-list-view.component';
import { CommunityListMatCardType } from '~/shared/models/community-list.model';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Component({
  selector: 'qn-owned-community',
  templateUrl: './owned-community.component.html',
  styleUrls: ['./owned-community.component.scss']
})
export class OwnedCommunityComponent implements OnInit {
  ownsCommunities: number;
  user: User;
  userId: number;
  isOwner: boolean = false;
  CommunityListTypeClass = CommunityListType;
  CommunityListMatCardTypeClass = CommunityListMatCardType;
  @ViewChild("ownedCommunityBox") ownedCommunityBox: CommunityHorizontalListViewComponent;

  constructor(public apiService: ApiService,
    public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  setCommunityCount(ownsCommunities: number) {
    this.ownsCommunities = ownsCommunities;
    this.ownedCommunityBox.startLoading(this.ownsCommunities);
  }

  setUser(user: User) {
    this.user = user;
    this.fetchOwnedCommunityList();
  }

  fetchOwnedCommunityList(): void {
    this.userId = this.user?.userId;
    if (this.authService.isThisLoggedInUser(this.userId)) {
      this.isOwner = true;
    }
    this.apiService.getUserOwnedCommunity(this.userId, 0).subscribe((res: QPage<Community>) => {
      // console.log("OWNED COMMUNITES", res);
      if (res.content.length) {
        this.ownedCommunityBox.setData(res.content, this.isOwner);
      } else {
        this.ownedCommunityBox.setData([], this.isOwner);
      }
    }, err => {
    });
  }
}
