import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { MaterialModule } from './material.module';
import { HorizontalProfileSkeletonComponent } from './skeletons/horizontal-profile-skeleton/horizontal-profile-skeleton.component';
import { PostSkeletonComponent } from './skeletons/post-skeleton/post-skeleton.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    HorizontalProfileSkeletonComponent,
    PostSkeletonComponent
  ],
  providers: [
  ],
  exports: [
    HorizontalProfileSkeletonComponent,
    PostSkeletonComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SkeletonModule { }
