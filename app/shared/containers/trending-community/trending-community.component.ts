import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { CommunityHorizontalListViewComponent } from '~/shared/components/community-horizontal-list-view/community-horizontal-list-view.component';
import { CommunityListMatCardType } from '~/shared/models/community-list.model';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Component({
  selector: 'qn-trending-community',
  templateUrl: './trending-community.component.html',
  styleUrls: ['./trending-community.component.scss']
})
export class TrendingCommunityComponent implements OnInit {
  user: User;
  CommunityListTypeClass = CommunityListType;
  CommunityListMatCardTypeClass = CommunityListMatCardType;
  trendingCommunityBoxRef: CommunityHorizontalListViewComponent;
  @ViewChild("trendingCommunityBox")
  set trendingCommunityBox(trendingCommunityBoxRef: CommunityHorizontalListViewComponent) {
    this.trendingCommunityBoxRef = trendingCommunityBoxRef;
    if (this.trendingCommunityBoxRef)
      this.trendingCommunityBoxRef.startLoading(0);
  }
  hasBeenDestroyed: boolean = false;

  constructor(public apiService: ApiService,
    public authService: AuthService) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.fetchTrendingCommunities();
  }

  fetchTrendingCommunities(): void {
    this.apiService.getTrendingCommunities().subscribe(
      (res: QPage<Community>) => {
        if (res.content.length) {
          this.trendingCommunityBoxRef.setData(res.content);
        } else {
          this.hasBeenDestroyed = true;
          this.trendingCommunityBoxRef.setData([]);
        }
      }, err => {
        this.hasBeenDestroyed = true;
      }
    );
  }
}
