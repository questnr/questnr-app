import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from '../material.module';
import { CommentSkeletonComponent } from './comment-skeleton/comment-skeleton.component';
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
    HorizontalQuestionViewSkeletonComponent
  ],
  providers: [
  ],
  exports: [
    HorizontalProfileSkeletonComponent,
    PostSkeletonComponent,
    CommentSkeletonComponent,
    HorizontalQuestionViewSkeletonComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SkeletonModule { }
