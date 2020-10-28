import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
import { InterceptorService } from './interceptor.service';
import { CommonService } from './services/common.service';
import { JWTService } from './services/jwt.service';
import { LoaderService } from './services/loader.service';
import { OTPVerificationService } from './services/otp-verification.service';
import { SnackBarService } from './services/snackbar.service';
import { UtilityService } from './services/utility.service';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    AuthModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    CommonService,
    LoaderService,
    JWTService,
    OTPVerificationService,
    SnackBarService,
    UtilityService,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

