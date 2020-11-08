import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { NgRippleModule } from 'nativescript-ripple/angular';
import { TNSImageModule } from '@nativescript-community/ui-image/angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    NgRippleModule,
    TNSImageModule,
    NativeScriptUIListViewModule
  ],
  declarations: [
  ],
  providers: [
  ],
  exports: [
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    NgRippleModule,
    TNSImageModule,
    NativeScriptUIListViewModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class MaterialModule { }
