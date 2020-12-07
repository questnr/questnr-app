import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api.service';
import { AuthService } from '~/services/auth.service';
import { CommunityHorizontalListViewComponent } from '~/shared/components/community-horizontal-list-view/community-horizontal-list-view.component';
import { CommunityListMatCardType } from '~/shared/models/community-list.model';
import { Community, CommunityListType } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { User } from '~/shared/models/user.model';

@Component({
  selector: 'qn-suggested-community',
  templateUrl: './suggested-community.component.html',
  styleUrls: ['./suggested-community.component.scss']
})
export class SuggestedCommunityComponent implements OnInit {
  user: User;
  userId: number;
  CommunityListTypeClass = CommunityListType;
  CommunityListMatCardTypeClass = CommunityListMatCardType;
  suggestedCommunityBoxRef: CommunityHorizontalListViewComponent;
  @ViewChild("suggestedCommunityBox")
  set suggestedCommunityBox(suggestedCommunityBoxRef: CommunityHorizontalListViewComponent) {
    this.suggestedCommunityBoxRef = suggestedCommunityBoxRef;
    this.suggestedCommunityBoxRef.startLoading(0);
  }
  hasBeenDestroyed: boolean = false;

  constructor(public apiService: ApiService,
    public authService: AuthService) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.fetchSuggestedCommunityList();
  }

  fetchSuggestedCommunityList(): void {
    this.apiService.getSuggestedCommunities().subscribe(
      (res: QPage<Community>) => {
        if (res.content.length) {
          this.suggestedCommunityBoxRef.setData(res.content);
        } else {
          this.hasBeenDestroyed = true;
          this.suggestedCommunityBoxRef.setData([]);
        }
      }, err => {
        this.hasBeenDestroyed = true;
      }
    );
  }
}
