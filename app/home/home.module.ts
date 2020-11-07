import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MaterialModule } from '~/shared/material.module';
import { SharedModule } from '~/shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    HomeComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
