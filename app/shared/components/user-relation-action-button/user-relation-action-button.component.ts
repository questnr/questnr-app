import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackBar } from '@nstudio/nativescript-snackbar';
import { AuthService } from '~/services/auth.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserProfileService } from '~/services/user-profile.service';
import { RelationType } from '~/shared/models/relation-type';
import { User } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-user-relation-action-button',
  templateUrl: './user-relation-action-button.component.html',
  styleUrls: ['./user-relation-action-button.component.scss']
})
export class UserRelationActionButtonComponent implements OnInit {
  qColors = qColors;
  @Input() relation: RelationType;
  @Input() user: User;
  @Input() communityType: string;
  @Input() qHeight: number = 50;
  @Input() size: string = 'medium';
  @Output() actionEvent = new EventEmitter();
  relationTypeClass = RelationType;
  isLoading: boolean = true;

  constructor(private userProfileService: UserProfileService,
    private authService: AuthService,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.setData(this.user, this.relation, true);
  }

  setData(user: User, relation: RelationType, fromConstructor: boolean = false): void {
    this.user = user;
    this.relation = relation;
    if (this.user && this.relation) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  onFollow(): void {
    this.userProfileService.followMe(this.user.userId).subscribe((res: any) => {
      console.log(res);
      this.relation = RelationType.FOLLOWED;
    }, error => {
      // console.log(error.error.errorMessage);
    });
  }
  onUnfollow(): void {
    let title = "Do you want to unfollow " + this.user.username + "?";
    let result;
    if (result?.data == true) {
      const snackBarRef = this.snackBarService.show({ snackText: 'Unfollowing...' });
      const ownerId = this.authService.getStoredUserProfile().id;
      this.userProfileService.unfollowMe(ownerId, this.user.userId).subscribe((res: any) => {
        // console.log(res);
        this.relation = RelationType.NONE;
        this.snackBarService.show({ snackText: "Unfollowed " + this.user.username });
      }, error => {
        this.snackBarService.showHTTPError(error);
      });
    }
  }
}
