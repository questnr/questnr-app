import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    ReactiveFormsModule
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
