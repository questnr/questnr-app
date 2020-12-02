import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { HomeModule } from '~/home/home.module';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared.module';
import { CommunityMenuModalComponent } from './community-menu-modal/community-menu-modal.component';
import { CommunityPrivacyChangeModalComponent } from './community-privacy-change-modal/community-privacy-change-modal.component';
import { CreatePostModalComponent } from './create-post-modal/create-post-modal.component';
import { CreateQuestionModalComponent } from './create-question-modal/create-question-modal.component';
import { ModifyCommunityModalComponent } from './modify-community-modal/modify-community-modal.component';
import { PostMenuModalComponent } from './post-menu-modal/post-menu-modal.component';
import { ReportPostModalComponent } from './report-post-modal/report-post-modal.component';

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
    ModifyCommunityModalComponent,
    CommunityPrivacyChangeModalComponent
  ],
  providers: [
  ],
  exports: [
    CreatePostModalComponent,
    CreateQuestionModalComponent,
    PostMenuModalComponent,
    ReportPostModalComponent,
    CommunityMenuModalComponent,
    ModifyCommunityModalComponent,
    CommunityPrivacyChangeModalComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModalModule { }
