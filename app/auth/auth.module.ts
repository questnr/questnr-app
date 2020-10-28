import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MaterialModule } from '~/shared/material.module';
import { SharedModule } from '~/shared/shared.module';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    OtpVerificationComponent
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
