import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadOnDemandListViewEventData, RadListView } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { UserQuestionService } from '~/services/user-question.service';
import { Community } from '~/shared/models/community.model';
import { QPage } from '~/shared/models/page.model';
import { Post } from '~/shared/models/post-action.model';
import { UserQuestionListModalType } from '~/shared/models/user-question.model';
import { User } from '~/shared/models/user.model';
@Component({
  selector: 'qn-question-list-page',
  templateUrl: './question-list-page.component.html',
  styleUrls: ['./question-list-page.component.scss']
})
export class QuestionListPageComponent implements OnInit {
  user: User;
  community: Community;
  title: string;
  type: UserQuestionListModalType = UserQuestionListModalType.user;
  loading: boolean = true;
  questionList: Post[] = [];
  totalCounts: number;
  isOwner: boolean = false;
  mobileView: boolean = false;
  endOfResult = false;
  page: number = 0;
  hasTotalPage: number;
  scrollCached: boolean = null;
  userQuestionSubscriber: Subscription;
  @ViewChild("listContainer") listContainer: ElementRef;
  // questionLoaderRef: UserQuestionLoaderComponent
  // @ViewChild("questionLoader")
  // set questionLoader(questionLoaderRef: UserQuestionLoaderComponent) {
  //   this.questionLoaderRef = questionLoaderRef;
  // }
  fetchingFunc: Function;
  uniqueId: number;
  params;
  listView: RadListView;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute,
    private userQuestionService: UserQuestionService) {
    this.route.queryParams.subscribe((params: any) => {
      this.params = params;
      this.title = params.title;
      this.totalCounts = params.totalCounts;
      this.isOwner = params.isOwner;
      this.type = params.type;
      if (this.type === UserQuestionListModalType.user) {
        this.user = JSON.parse(params.user);
        this.uniqueId = this.user?.userId;
        if (this.uniqueId) {
          this.fetchingFunc = (...args) => {
            if (args.length === 2)
              return this.userQuestionService.getUserQuestions(args[0], args[1]);
          };
        }
      } else if (this.type === UserQuestionListModalType.community) {
        this.community = JSON.parse(params.community);
        this.uniqueId = this.community?.communityId;
        if (this.uniqueId) {
          this.fetchingFunc = (...args) => {
            if (args.length === 2)
              return this.userQuestionService.getCommunityQuestions(args[0], args[1]);
          };
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.questionLoaderRef.setListItems(this.totalCounts < 5 ? this.totalCounts : 4);
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.userQuestionSubscriber) {
      this.userQuestionSubscriber.unsubscribe();
    }
  }

  fetchData() {
    this.loading = true;
    if (!this.fetchingFunc) return;
    this.userQuestionSubscriber = this.fetchingFunc(
      this.uniqueId, String(this.page)).subscribe((questionPage: QPage<Post>) => {
        if (questionPage.content.length) {
          this.hasTotalPage = questionPage.totalPages;
          this.page++;
          this.endOfResult = questionPage.last;
          this.loading = false;
          questionPage.content.forEach(question => {
            this.questionList.push(question);
          });
        } else {
          this.loading = false;
          this.endOfResult = true;
        }
      }, error => {
        this.loading = false;
      });
  }

  public onLoadMoreItemsRequested(args: LoadOnDemandListViewEventData) {
    const that = new WeakRef(this);
    this.listView = args.object;
    if (!this.endOfResult) {
      setTimeout(() => {
        that.get().fetchData();
        this.listView.notifyLoadOnDemandFinished();
      }, 1500);
    } else {
      args.returnValue = false;
      this.listView.notifyLoadOnDemandFinished(true);
    }
  }

  templateSelector(item, index, items) {
    return 'userView';
  }
}
