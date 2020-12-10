import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { AttachedFileModule } from '~/attached-file-list/attached-file.module';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { CommunityActivityComponent } from './components/community-activity/community-activity.component';
import { CommunityCardViewComponent } from './components/community-card-view/community-card-view.component';
import { CommunityHorizontalListViewComponent } from './components/community-horizontal-list-view/community-horizontal-list-view.component';
import { CommunityRelationActionButtonComponent } from './components/community-relation-action-button/community-relation-action-button.component';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';
import { FormStepHeaderComponent } from './components/form-step-header/form-step-header.component';
import { HorizontalOwnerProfileComponent } from './components/horizontal-owner-profile/horizontal-owner-profile.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PostMenuOptionComponent } from './components/post-menu-option/post-menu-option.component';
import { QuestionHorizontalViewComponent } from './components/question-horizontal-view/question-horizontal-view.component';
import { QuestionListCardComponent } from './components/question-list-card/question-list-card.component';
import { UserActivityBarComponent } from './components/user-activity/user-activity-bar/user-activity-bar.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';
import { UserDescriptionCardComponent } from './components/user-description-card/user-description-card.component';
import { UserRelationActionButtonComponent } from './components/user-relation-action-button/user-relation-action-button.component';
import { VerticalLineComponent } from './components/vertical-line/vertical-line.component';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { CommentContainerComponent } from './containers/comment-container/comment-container.component';
import { CommunityMembersComponent } from './containers/community-members/community-members.component';
import { CreatePostComponent } from './containers/create-post/create-post.component';
import { FeedTextComponent } from './containers/feed-text/feed-text.component';
import { HashTagListComponent } from './containers/hash-tag-list/hash-tag-list.component';
import { HorizontalProfileComponent } from './containers/horizontal-profile/horizontal-profile.component';
import { JoinedCommunityComponent } from './containers/joined-community/joined-community.component';
import { MediaContainerComponent } from './containers/media-container/media-container.component';
import { OwnedCommunityComponent } from './containers/owned-community/owned-community.component';
import { PostInteractionPanelComponent } from './containers/post-interaction-panel/post-interaction-panel.component';
import { ProfileIconComponent } from './containers/profile-icon/profile-icon.component';
import { SimplePostComponent } from './containers/simple-post/simple-post.component';
import { SimpleQuestionComponent } from './containers/simple-question/simple-question.component';
import { SuggestedCommunityComponent } from './containers/suggested-community/suggested-community.component';
import { TimeStringComponent } from './containers/time-string/time-string.component';
import { TrendingCommunityComponent } from './containers/trending-community/trending-community.component';
import { UsernameComponent } from './containers/username/username.component';
import { MaterialModule } from './material.module';
import { SkeletonModule } from './skeletons/skeletons.module';
import { CircularProgressBarComponent } from './util/circular-progress-bar/circular-progress-bar.component';
import { HrComponent } from './util/hr/hr.component';
import { SpaceComponent } from './util/space/space.component';
import { QNRVideoComponent } from './util/video/q-n-r-video.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SkeletonModule,
    AttachedFileModule
  ],
  declarations: [
    CircularProgressBarComponent,
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent,
    HrComponent,
    SpaceComponent,
    CreatePostComponent,
    SimplePostComponent,
    FeedTextComponent,
    UsernameComponent,
    TimeStringComponent,
    MediaContainerComponent,
    QNRVideoComponent,
    SimpleQuestionComponent,
    PostInteractionPanelComponent,
    PostMenuOptionComponent,
    CommentItemComponent,
    CommentContainerComponent,
    CreateCommentComponent,
    CommunityMembersComponent,
    CommunityRelationActionButtonComponent,
    HorizontalOwnerProfileComponent,
    LoaderComponent,
    CommunityActivityComponent,
    VerticalLineComponent,
    QuestionListCardComponent,
    QuestionHorizontalViewComponent,
    UserDescriptionCardComponent,
    UserActivityComponent,
    UserActivityBarComponent,
    CommunityCardViewComponent,
    CommunityHorizontalListViewComponent,
    JoinedCommunityComponent,
    OwnedCommunityComponent,
    SuggestedCommunityComponent,
    TrendingCommunityComponent,
    UserRelationActionButtonComponent,
    FormStepHeaderComponent,
    HashTagListComponent
  ],
  providers: [
  ],
  exports: [
    SkeletonModule,
    AttachedFileModule,
    ActionBarComponent,
    CircularProgressBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent,
    HrComponent,
    SpaceComponent,
    CreatePostComponent,
    SimplePostComponent,
    FeedTextComponent,
    UsernameComponent,
    TimeStringComponent,
    MediaContainerComponent,
    QNRVideoComponent,
    SimpleQuestionComponent,
    PostInteractionPanelComponent,
    PostMenuOptionComponent,
    CommentItemComponent,
    CommentContainerComponent,
    CreateCommentComponent,
    CommunityMembersComponent,
    CommunityRelationActionButtonComponent,
    HorizontalOwnerProfileComponent,
    LoaderComponent,
    CommunityActivityComponent,
    VerticalLineComponent,
    QuestionListCardComponent,
    QuestionHorizontalViewComponent,
    UserDescriptionCardComponent,
    UserActivityComponent,
    UserActivityBarComponent,
    CommunityCardViewComponent,
    CommunityHorizontalListViewComponent,
    JoinedCommunityComponent,
    OwnedCommunityComponent,
    SuggestedCommunityComponent,
    TrendingCommunityComponent,
    UserRelationActionButtonComponent,
    FormStepHeaderComponent,
    HashTagListComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
