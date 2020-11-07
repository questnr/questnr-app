import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { AppModalModule } from './app-modal.module';
import { CircularProgressBarComponent } from './components/circular-progress-bar/circular-progress-bar.component';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { HorizontalProfileComponent } from './containers/horizontal-profile/horizontal-profile.component';
import { ProfileIconComponent } from './containers/profile-icon/profile-icon.component';
import { MaterialModule } from './material.module';
import { SkeletonModule } from './skeleton.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SkeletonModule,
    AppModalModule
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
    AppModalModule,
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
