import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MaterialModule } from '~/shared/material.module';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    AuthService,
    [AuthGuard]
  ],
  exports: [
    LoginComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AuthModule { }
