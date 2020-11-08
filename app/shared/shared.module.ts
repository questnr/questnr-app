import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { CircularProgressBarComponent } from './components/circular-progress-bar/circular-progress-bar.component';
import { HrComponent } from './components/hr/hr.component';
import { SpaceComponent } from './components/space/space.component';
import { ActionBarComponent } from './containers/action-bar/action-bar.component';
import { HorizontalProfileComponent } from './containers/horizontal-profile/horizontal-profile.component';
import { ProfileIconComponent } from './containers/profile-icon/profile-icon.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    CircularProgressBarComponent,
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent,
    HrComponent,
    SpaceComponent
  ],
  providers: [
  ],
  exports: [
    // CircularProgressBarComponent
    ActionBarComponent,
    HorizontalProfileComponent,
    ProfileIconComponent,
    HrComponent,
    SpaceComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
