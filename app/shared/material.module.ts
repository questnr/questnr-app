import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TNSImageModule } from '@nativescript-community/ui-image/angular';
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule
} from '@nativescript/angular';
import { NgShadowModule } from "@dsvishchov/nativescript-ngx-shadow";
import { NgRippleModule } from 'nativescript-ripple/angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    NgRippleModule,
    TNSImageModule,
    NativeScriptUIListViewModule,
    NgShadowModule,
    TNSCheckBoxModule
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
    NativeScriptUIListViewModule,
    NgShadowModule,
    TNSCheckBoxModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class MaterialModule { }
