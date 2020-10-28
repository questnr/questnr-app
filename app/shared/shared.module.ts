import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { CircularProgressBarComponent } from './circular-progress-bar/circular-progress-bar.component';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    CircularProgressBarComponent
  ],
  providers: [
  ],
  exports: [
    // CircularProgressBarComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
