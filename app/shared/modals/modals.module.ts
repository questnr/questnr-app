import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from '../material.module';
import { CommunityMenuModalComponent } from './community-menu-modal/community-menu-modal.component';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { CreateQuestionModalComponent } from './create-question-modal/create-question-modal.component';
import { ModifyCommunityModalComponent } from './modify-community-modal/modify-community-modal.component';
import { PostMenuModalComponent } from './post-menu-modal/post-menu-modal.component';
import { ReportPostModalComponent } from './report-post-modal/report-post-modal.component';
import { SharedModule } from '../shared.module';
import { HomeModule } from '~/home/home.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SharedModule,
    HomeModule
  ],
  declarations: [
    CreatePostModalComponent,
    CreateQuestionModalComponent,
    PostMenuModalComponent,
    ReportPostModalComponent,
    CommunityMenuModalComponent,
    ModifyCommunityModalComponent
  ],
  providers: [
  ],
  exports: [
    CreatePostModalComponent,
    CreateQuestionModalComponent,
    PostMenuModalComponent,
    ReportPostModalComponent,
    CommunityMenuModalComponent,
    ModifyCommunityModalComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModalModule { }
