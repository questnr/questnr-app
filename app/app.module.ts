import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import * as applicationModule from '@nativescript/core/application';
import { NativeScriptModule } from '@nativescript/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { InterceptorService } from './interceptor.service';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { ApiService } from './services/api.service';
import { CommonService } from './services/common.service';
import { JWTService } from './services/jwt.service';
import { LoaderService } from './services/loader.service';
import { OTPVerificationService } from './services/otp-verification.service';
import { SnackBarService } from './services/snackbar.service';
import { UtilityService } from './services/utility.service';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import * as imageModule from '@nativescript-community/ui-image';
import * as app from "@nativescript/core/application";
import { FeedsService } from './services/feeds.service';
import { Fontawesome } from 'nativescript-fontawesome';
import { SkeletonModule } from './shared/skeleton.module';
import { AppModalModule } from './shared/app-modal.module';

Fontawesome.init();

if (applicationModule.android) {
  applicationModule.on(applicationModule.launchEvent, () => {
    imageModule.initialize();
  });

  // In very very rare occasions the native Android imageModule library may experience strange memory leak issues
  app.on(app.exitEvent, (args) => {
    imageModule.shutDown();
  });
}

@NgModule({
  declarations: [
    AppComponent,
    SearchOverlayComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    AuthModule,
    MaterialModule,
    SharedModule,
    SkeletonModule,
    AppModalModule,
    HomeModule
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
    ApiService,
    FeedsService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

