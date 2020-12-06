import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { CommunityHorizontalListViewComponent } from '~/shared/components/community-horizontal-list-view/community-horizontal-list-view.component';
import { CommunityListMatCardType } from '~/shared/models/community-list.model';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Component({
  selector: 'qn-joined-community',
  templateUrl: './joined-community.component.html',
  styleUrls: ['./joined-community.component.scss']
})
export class JoinedCommunityComponent implements OnInit {
  followsCommunities: number;
  user: User;
  userId: number;
  isOwner: boolean = false;
  CommunityListTypeClass = CommunityListType;
  CommunityListMatCardTypeClass = CommunityListMatCardType;
  @ViewChild("joinedCommunityBox") joinedCommunityBox: CommunityHorizontalListViewComponent;

  constructor(public apiService: ApiService,
    public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  setCommunityCount(followsCommunities: number) {
    this.followsCommunities = followsCommunities;
    this.joinedCommunityBox.startLoading(this.followsCommunities);
  }

  setUser(user: User) {
    this.user = user;
    this.fetchJoinedCommunityList();
  }

  fetchJoinedCommunityList(): void {
    this.userId = this.user?.userId;
    if (this.authService.isThisLoggedInUser(this.userId)) {
      this.isOwner = true;
    }
    this.apiService.getJoinedCommunities(this.userId, 0).subscribe(
      (res: QPage<Community>) => {
        if (res.content.length) {
          this.joinedCommunityBox.setData(this.isOwner, res.content);
        } else {
          this.joinedCommunityBox.setData(this.isOwner, []);
        }
      }, err => {
        this.joinedCommunityBox.stopLoading();
      }
    );
  }
}
