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

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    NgRippleModule,
    TNSImageModule
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
    TNSImageModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class MaterialModule { }
