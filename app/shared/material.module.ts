import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
  NativeScriptHttpClientModule,
  NativeScriptRouterModule
} from '@nativescript/angular';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule
  ],
  declarations: [
  ],
  providers: [
  ],
  exports: [
    NativeScriptFormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class MaterialModule { }
