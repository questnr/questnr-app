import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { Subscription } from 'rxjs';
import { AuthService } from '~/services/auth.service';
import { SnackBarService } from '~/services/snackbar.service';
import { GlobalConstants } from '~/shared/constants';
import { CardHeaderType } from '~/shared/models/card-header.model';
import { Community } from '~/shared/models/community.model';
import { Post } from '~/shared/models/post-action.model';
import { UserQuestionListModalType } from '~/shared/models/user-question.model';
import { User } from '~/shared/models/user.model';
import { qColors, qRadius } from '~/_variables';

@Component({
  selector: 'qn-question-list-card',
  templateUrl: './question-list-card.component.html',
  styleUrls: ['./question-list-card.component.scss']
})
export class QuestionListCardComponent implements OnInit {
  qColors = qColors;
  qRadius = qRadius;
  user: User;
  community: Community;
  title: string = "Questions";
  totalQuestions: number;
  @Input() type: UserQuestionListModalType = UserQuestionListModalType.user;
  isLoading: boolean = true;
  isOwner: boolean = false;
  mobileView: boolean = false;
  questionList: Post[] = [];
  page: number = 0;
  // questionLoaderRef: QuestionSkeletonComponent;
  // @ViewChild("questionLoader")
  // set questionLoader(questionLoaderRef: UserQuestionLoaderComponent) {
  //   this.questionLoaderRef = questionLoaderRef;
  // }
  cardHeaderTypeClass = CardHeaderType;
  userQuestionSubscriber: Subscription;
  pageSize: number = 4;
  fetchingFunc: Function;
  uniqueId: number;
  isAllowedIntoCommunity: boolean = false;

  constructor(private loginService: AuthService,
    private routerExtensions: RouterExtensions,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.userQuestionSubscriber) {
      this.userQuestionSubscriber.unsubscribe();
    }
  }

  setTotalQuestion(totalQuestions: number) {
    this.totalQuestions = totalQuestions;
  }

  setUserData(user: User): void {
    this.user = user;
    this.type = UserQuestionListModalType.user;
    this.isOwner = this.loginService.isThisLoggedInUser(this.user.userId);
    this.title = "User's Questions";
    if (this.isOwner) {
      this.title = "Your Questions";
    }
  }

  setCommunityData(community: Community, isAllowedIntoCommunity: boolean): void {
    this.community = community;
    this.type = UserQuestionListModalType.community;
    this.title = "Community's Questions";
    if (isAllowedIntoCommunity) {
      this.isAllowedIntoCommunity = isAllowedIntoCommunity;
      this.isOwner = this.loginService.isThisLoggedInUser(this.community?.ownerUserDTO?.userId);
      if (this.isOwner) {
        this.title = "Your Community's Questions";
      }
    } else {
      this.isLoading = false;
    }
  }

  onOpenQuestionList(args) {
    if (this.isAllowedIntoCommunity) {
      if (this.totalQuestions > 0) {
        this.routerExtensions.navigate(['/',
          GlobalConstants.questionListPath,
          this.type
        ],
          {
            queryParams: {
              community: JSON.stringify(this.community),
              user: JSON.stringify(this.user),
              type: this.type,
              isOwner: this.isOwner,
              totalCounts: this.totalQuestions,
              title: this.title
            },
            animated: true,
            transition: {
              name: "slideLeft",
              duration: 400,
              curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
            }
          });
      } else {
        this.snackBarService.show({ snackText: "Community has not asked any questions." });
      }
    } else {
      this.snackBarService.show({ snackText: "Community Questions are only available for its members." });
    }
  }
}
