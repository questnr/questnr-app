import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MaterialModule } from '~/shared/material.module';
import { AttachedFileListComponent } from './attached-file-list.component';
import { AttachedFileComponent } from './attached-file/attached-file.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    AttachedFileComponent,
    AttachedFileListComponent
  ],
  exports: [
    AttachedFileComponent,
    AttachedFileListComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AttachedFileModule { }
