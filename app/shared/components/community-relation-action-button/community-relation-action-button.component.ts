import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialogs } from '@nativescript/core';
import { AuthService } from '~/services/auth.service';
import { CommunityService } from '~/services/community.service';
import { SnackBarService } from '~/services/snackbar.service';
import { Community, CommunityPrivacy } from '~/shared/models/community.model';
import { RelationType } from '~/shared/models/relation-type';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-relation-action-button',
  templateUrl: './community-relation-action-button.component.html',
  styleUrls: ['./community-relation-action-button.component.scss']
})
export class CommunityRelationActionButtonComponent implements OnInit {
  qColors = qColors;
  @Input() relation: RelationType;
  @Input() community: Community;
  @Input() communityType: string;
  @Input() qHeight: number = 50;
  @Output() actionEvent = new EventEmitter();
  communityPrivacyClass = CommunityPrivacy;
  relationTypeClass = RelationType;
  isLoading: boolean = true;

  constructor(private communityService: CommunityService,
    private authService: AuthService,
    public snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.setData(this.community, this.relation, true);
  }

  setData(community: Community, relation: RelationType, fromConstructor: boolean = false): void {
    this.community = community;
    this.relation = relation;
    if (this.community && this.relation) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  followThisCommunty() {
    this.communityService.followCommunity(this.community.communityId).subscribe((res: any) => {
      this.relation = res.relationShipType;
      this.sendAction(this.relation);
      this.snackBarService.show({ snackText: `You have joined ${this.community.communityName}!` });
    }, error => {
      // console.log('failed to join this community', error.error.errorMessage);
      this.snackBarService.showHTTPError(error);
    });
  }

  unfollowThisCommunity() {
    let title = "Do you want to unfollow " + this.community.communityName + "?";
    Dialogs.confirm({
      title: title,
      okButtonText: "Unfollow",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result) {
        this.isLoading = true;
        this.snackBarService.show({ snackText: 'Unfollowing...' });
        const userId = this.authService.getStoredUserProfile().id;
        this.communityService.unfollowCommunityService(this.community.communityId, userId).subscribe((res: any) => {
          this.relation = RelationType.NONE;
          this.sendAction(this.relation);
          this.snackBarService.show({ snackText: "Unfollowed " + this.community.communityName });
          this.isLoading = false;
        }, error => {
          this.snackBarService.showHTTPError(error);
          this.isLoading = false;
        });
      }
    });
  }

  sendAction(relation: RelationType) {
    this.actionEvent.emit(relation);
  }
  deleteUsersOwnPendingCommunityJoinRequests() {
    this.communityService.deleteUsersOwnPendingCommunityJoinRequests(this.community.communityId).subscribe((res: any) => {
      this.relation = RelationType.NONE;
      this.snackBarService.show({ snackText: 'Request has been cancelled!' });
    }, error => {
      this.snackBarService.showHTTPError(error);
    });
  }
}
