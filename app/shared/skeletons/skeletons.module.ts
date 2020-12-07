import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from '../material.module';
import { CommentSkeletonComponent } from './comment-skeleton/comment-skeleton.component';
import { CommunityCardViewSkeletonComponent } from './community-card-view-skeleton/community-card-view-skeleton.component';
import { CommunityHorizontalListViewSkeletonComponent } from './community-horizontal-list-view-skeleton/community-horizontal-list-view-skeleton.component';
import { HorizontalProfileSkeletonComponent } from './horizontal-profile-skeleton/horizontal-profile-skeleton.component';
import { HorizontalQuestionViewSkeletonComponent } from './horizontal-question-view-skeleton/horizontal-question-view-skeleton.component';
import { PostSkeletonComponent } from './post-skeleton/post-skeleton.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    HorizontalProfileSkeletonComponent,
    PostSkeletonComponent,
    CommentSkeletonComponent,
    HorizontalQuestionViewSkeletonComponent,
    CommunityCardViewSkeletonComponent,
    CommunityHorizontalListViewSkeletonComponent
  ],
  providers: [
  ],
  exports: [
    HorizontalProfileSkeletonComponent,
    PostSkeletonComponent,
    CommentSkeletonComponent,
    HorizontalQuestionViewSkeletonComponent,
    CommunityCardViewSkeletonComponent,
    CommunityHorizontalListViewSkeletonComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SkeletonModule { }
