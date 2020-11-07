import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from './material.module';
import { HorizontalProfileSkeletonComponent } from './skeleton/horizontal-profile-skeleton/horizontal-profile-skeleton.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    HorizontalProfileSkeletonComponent
  ],
  providers: [
  ],
  exports: [
    HorizontalProfileSkeletonComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SkeletonModule { }
