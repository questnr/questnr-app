import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import * as imageModule from '@nativescript-community/ui-image';
import { NativeScriptModule } from '@nativescript/angular';
import * as app from "@nativescript/core/application";
import * as applicationModule from '@nativescript/core/application';
import { Fontawesome } from 'nativescript-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { InterceptorService } from './interceptor.service';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { ApiService } from './services/api.service';
import { AskQuestionService } from './services/ask-question.service';
import { CommonService } from './services/common.service';
import { FeedService } from './services/feeds.service';
import { JWTService } from './services/jwt.service';
import { LoaderService } from './services/loader.service';
import { OTPVerificationService } from './services/otp-verification.service';
import { PostMenuService } from './services/post-menu.service';
import { UserInteractionService } from './services/user-interaction.service';
import { SnackBarService } from './services/snackbar.service';
import { UtilityService } from './services/utility.service';
import { VideoService } from './services/video.service';
import { AppModalModule } from './shared/app-modal.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { SkeletonModule } from './shared/skeleton.module';
import { OverlayService } from './services/overlay.service';

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
    FeedService,
    AskQuestionService,
    VideoService,
    PostMenuService,
    UserInteractionService,
    OverlayService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

