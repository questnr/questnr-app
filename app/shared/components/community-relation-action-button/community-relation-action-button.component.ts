import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialogs } from '@nativescript/core';
import { AuthService } from '~/services/auth.service';
import { CommunityService } from '~/services/community.service';
import { SnackBarService } from '~/services/snackbar.service';
import { CommunityPrivacy } from '~/shared/models/community.model';
import { RelationType } from '~/shared/models/relation-type';
@Component({
  selector: 'qn-community-relation-action-button',
  templateUrl: './community-relation-action-button.component.html',
  styleUrls: ['./community-relation-action-button.component.scss']
})
export class CommunityRelationActionButtonComponent implements OnInit {
  @Input() relation: RelationType;
  @Input() communityId: number;
  @Input() communityName: string;
  @Input() mobileView: boolean = false;
  @Input() communityType: string;
  @Output() actionEvent = new EventEmitter();
  CommunityPrivacy = CommunityPrivacy;

  constructor(private communityService: CommunityService,
    private authService: AuthService,
    public snackBarService: SnackBarService) { }

  ngOnInit(): void {
  }


  followThisCommunty() {
    this.communityService.followCommunity(this.communityId).subscribe((res: any) => {
      this.relation = res.relationShipType;
      this.sendAction(this.relation);
    }, error => {
      // console.log('failed to join this community', error.error.errorMessage);
      this.snackBarService.show({ snackText: error.error.errorMessage });
    });
  }

  unfollowThisCommunity() {
    let title = "Do you want to unfollow " + this.communityName + "?";
    Dialogs.confirm({
      title: title,
      okButtonText: "Unfollow",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result) {
        this.snackBarService.show({ snackText: 'Unfollowing...' });
        const userId = this.authService.getStoredUserProfile().id;
        this.communityService.unfollowCommunityService(this.communityId, userId).subscribe((res: any) => {
          this.relation = RelationType.NONE;
          this.sendAction(this.relation);
          this.snackBarService.show({ snackText: "Unfollowed " + this.communityName });
        }, error => {
          this.snackBarService.showHTTPError(error.error.errorMessage);
        });
      }
    });
  }

  sendAction(relation: RelationType) {
    this.actionEvent.emit(relation);
  }
  deleteUsersOwnPendingCommunityJoinRequests() {
    this.communityService.deleteUsersOwnPendingCommunityJoinRequests(this.communityId).subscribe((res: any) => {
      this.relation = RelationType.NONE;
      this.snackBarService.show({ snackText: 'Request cancelled' });
    }, error => {
      this.snackBarService.showHTTPError(error);
    });
  }
}
