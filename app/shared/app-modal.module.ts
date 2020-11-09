import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from './material.module';
import { CreatePostModalComponent } from './modals/create-post-modal/create-post-modal.component';
import { CreateQuestionModalComponent } from './modals/create-question-modal/create-question-modal.component';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    CreatePostModalComponent,
    CreateQuestionModalComponent
  ],
  providers: [
  ],
  exports: [
    CreatePostModalComponent,
    CreateQuestionModalComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModalModule { }
