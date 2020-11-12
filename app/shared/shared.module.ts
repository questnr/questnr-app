import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { CreatePostComponent } from './containers/create-post/create-post.component';
import { FeedTextComponent } from './containers/feed-text/feed-text.component';
import { HorizontalProfileComponent } from './containers/horizontal-profile/horizontal-profile.component';
import { MediaContainerComponent } from './containers/media-container/media-container.component';
import { ProfileIconComponent } from './containers/profile-icon/profile-icon.component';
import { SimplePostComponent } from './containers/simple-post/simple-post.component';
import { TimeStringComponent } from './containers/time-string/time-string.component';
import { UsernameComponent } from './containers/username/username.component';
import { MaterialModule } from './material.module';
import { CircularProgressBarComponent } from './util/circular-progress-bar/circular-progress-bar.component';
import { HrComponent } from './util/hr/hr.component';
import { SpaceComponent } from './util/space/space.component';
import { QNRVideoComponent } from './util/video/q-n-r-video.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
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
    QNRVideoComponent
  ],
  providers: [
  ],
  exports: [
    // CircularProgressBarComponent
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
    QNRVideoComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
