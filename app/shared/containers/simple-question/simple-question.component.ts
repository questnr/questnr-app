import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AskQuestionService } from '~/services/ask-question.service';
import { AuthService } from '~/services/auth.service';
import { PostMenuService } from '~/services/post-menu.service';
import { SnackBarService } from '~/services/snackbar.service';
import { GlobalConstants } from '~/shared/constants';
import { Message } from '~/shared/constants/messages';
import { KnowMoreLinkType } from '~/shared/models/know-more-type';
import { PollQuestionMeta, Post, QuestionParentType, QuestionAnswerType } from '~/shared/models/post-action.model';
import { qAnswerFillers, qColors } from '~/_variables';

@Component({
  selector: 'qn-simple-question',
  templateUrl: './simple-question.component.html',
  styleUrls: ['./simple-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleQuestionComponent implements OnInit {
  @Input() feed: Post;
  @Output() removePostEvent = new EventEmitter();
  @ViewChild('agree') agree: ElementRef;
  @ViewChild('disagree') disagree: ElementRef;
  @Input() questionParentType: QuestionParentType;
  @Output() respondingActionEvetnt = new EventEmitter();
  userPath = GlobalConstants.userPath;
  agreePercentage: string;
  disagreePercentage: string;
  isResponded: boolean = false;
  totalAnswered: number = 0;
  showUserHeader: boolean = true;
  isOwner: boolean = false;
  loading: boolean = false;
  message: string;
  shouldHideMessage: boolean = true;
  knowMoreTypeClass = KnowMoreLinkType;
  questionAnswerTypeClass = QuestionAnswerType;
  qColors = qColors;
  qAnswerFillers = qAnswerFillers;

  constructor(public askQuestionService: AskQuestionService,
    private renderer: Renderer2,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private postMenuService: PostMenuService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.questionParentType === QuestionParentType.feedPage) {
      this.shouldHideMessage = false;
    }
    if (!this.showUserHeader) {
      if (this.feed?.communityDTO) {
        this.showUserHeader = false;
      } else {
        this.showUserHeader = true;
      }
    }
    this.totalAnswered = this.feed.pollQuestionMeta.totalAnswered;
    if (this.feed.pollQuestionMeta.pollAnswer) {
      this.isResponded = true;
      this.progressIndicator(this.feed.pollQuestionMeta);
    }
    if (this.authService.isThisLoggedInUser(this.feed.userDTO.userId)) {
      if (!this.isResponded)
        this.progressIndicator(this.feed.pollQuestionMeta);
      this.isOwner = true;
    }
    // console.log("question", this.question)
  }

  openPostMenu(): void {
    this.postMenuService.onRequestStart(this.feed);
  }

  respondToQuestion(pollAnswer: QuestionAnswerType) {
    if (!this.authService.isUserLoggedIn()) {
      return this.respondingActionEvetnt.emit({ signInRequiredError: true });
    }
    if (this.isOwner) {
      return this.openSnackBar(Message.PPA101);
    }
    if (this.feed.postActionId != null && !this.feed.pollQuestionMeta.pollAnswer) {
      this.loading = true;
      this.askQuestionService.respondToQuestion(this.feed.postActionId, pollAnswer).subscribe((pollQuestionMeta: PollQuestionMeta) => {
        this.totalAnswered = pollQuestionMeta.totalAnswered;
        this.progressIndicator(pollQuestionMeta);
      }, (error: HttpErrorResponse) => {
        if (error?.error?.errorMessage) {
          this.openSnackBar(error?.error?.errorMessage);
        } else if (typeof error.error === "string") {
          this.openSnackBar(error?.error);
        }
      });
    }
  }

  removePost($event) {
    this.removePostEvent.emit($event);
  }

  progressIndicator(pollQuestionMeta: PollQuestionMeta) {
    this.loading = false;
    this.isResponded = true;
    this.agreePercentage = Math.round(pollQuestionMeta.agreePercentage) + '%';
    this.disagreePercentage = Math.round(pollQuestionMeta.disagreePercentage) + '%';
    this.cd.detectChanges();
    this.renderer.setStyle(this.agree.nativeElement, 'width', pollQuestionMeta.agreePercentage + '%');
    this.renderer.setStyle(this.disagree.nativeElement, 'width', pollQuestionMeta.disagreePercentage + '%');
    if (pollQuestionMeta.agreePercentage > pollQuestionMeta.disagreePercentage) {
      this.renderer.setStyle(this.disagree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$red}, #ff000078)`);
      this.renderer.setStyle(this.agree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$green}, #82b77685)`);
    } else if (pollQuestionMeta.disagreePercentage > pollQuestionMeta.agreePercentage) {
      this.renderer.setStyle(this.agree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$green}, #82b77685)`);
      this.renderer.setStyle(this.disagree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$red}, #ff000078)`);
    } else {
      this.renderer.setStyle(this.agree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$yellow}, #82b77685)`);
      this.renderer.setStyle(this.disagree.nativeElement, 'background', `linear-gradient(to right, ${qAnswerFillers.$yellow}, #82b77685)`);
    }
  }

  openSnackBar(errorMessage: string) {
    const onAction = () => {
      this.router.navigate(['/',
        GlobalConstants.helpPath,
        GlobalConstants.questnrPath,
        KnowMoreLinkType.postPollQuestion
      ]);
    }
    this.snackBarService.show({
      snackText: errorMessage
    });
  }

  getMessage() {
    if (this.loading) return;
    if (!this.isOwner) {
      return "Post owner can not see your answer!";
    }
    if (this.isOwner) {
      return "You can not answer your question!";
    }
  }

  shouldShowMessage(): boolean {
    return !this.shouldHideMessage
      && !this.loading
      && !this.isOwner
      && !this.isResponded;
  }

  handleHideNotResponded($event) {
    $event.preventDefault();
    this.shouldHideMessage = true;
  }
}
