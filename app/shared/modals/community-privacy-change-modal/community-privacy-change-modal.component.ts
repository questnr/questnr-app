import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { CommunityService } from '~/services/community.service';
import { SnackBarService } from '~/services/snackbar.service';
import { Community, CommunityPrivacy } from '~/shared/models/community.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-community-privacy-change-modal',
  templateUrl: './community-privacy-change-modal.component.html',
  styleUrls: ['./community-privacy-change-modal.component.scss']
})
export class CommunityPrivacyChangeModalComponent implements OnInit {
  qColors = qColors;
  isLoading: boolean = false
  communityPrivacyClass = CommunityPrivacy;
  community: Community;

  communityPublicRules: string[] = [
    'All the pending community join requests will be approved automatically.',
    'All the community members and community posts will be visible to the public.',
    'Any Questnr user will be able to join the community without admin\'s approval.'
  ];

  communityPrivateRules: string[] = [
    'All the requests has to be approved by the admin manually.',
    'Community members and community posts will be visible only to the joined community members.',
    'The community will not be displayed in the trending community section.'
  ];

  constructor(private params: ModalDialogParams,
    private communityService: CommunityService,
    private snackBarService: SnackBarService) {
  }

  ngOnInit() {
    this.community = this.params.context.community;
  }

  toggleCommunityPrivacy(updatedPrivacy: CommunityPrivacy) {
    this.isLoading = true;
    this.communityService.toggleCommunityPrivacy(this.community.communityId, updatedPrivacy).subscribe((community: Community) => {
      this.community = community;
      this.snackBarService.show({ snackText: 'Community privacy updated' });
      this.params.closeCallback(community);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.snackBarService.showHTTPError(error.error.errorMessage);
      this.params.closeCallback();
    });
  }

  close(): void {
    this.params.closeCallback();
  }
}
