import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { AttachedFileModule } from '~/attached-file-list/attached-file.module';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { PostMenuOptionComponent } from './components/post-menu-option/post-menu-option.component';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { CreatePostComponent } from './containers/create-post/create-post.component';
import { FeedTextComponent } from './containers/feed-text/feed-text.component';
import { HorizontalProfileComponent } from './containers/horizontal-profile/horizontal-profile.component';
import { MediaContainerComponent } from './containers/media-container/media-container.component';
import { PostInteractionPanelComponent } from './containers/post-interaction-panel/post-interaction-panel.component';
import { ProfileIconComponent } from './containers/profile-icon/profile-icon.component';
import { SimplePostComponent } from './containers/simple-post/simple-post.component';
import { SimpleQuestionComponent } from './containers/simple-question/simple-question.component';
import { TimeStringComponent } from './containers/time-string/time-string.component';
import { UsernameComponent } from './containers/username/username.component';
import { MaterialModule } from './material.module';
import { SkeletonModule } from './skeleton.module';
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
    CommentItemComponent
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
    CommentItemComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
