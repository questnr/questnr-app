import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { CircularProgressBarComponent } from './circular-progress-bar/circular-progress-bar.component';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { HorizontalProfileComponent } from './components/horizontal-profile/horizontal-profile.component';
import { ProfileIconComponent } from './components/profile-icon/profile-icon.component';
import { MaterialModule } from './material.module';
import { SkeletonModule } from './skeleton.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SkeletonModule
  ],
  declarations: [
    CircularProgressBarComponent,
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent
  ],
  providers: [
  ],
  exports: [
    // CircularProgressBarComponent
    SkeletonModule,
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
