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
import { CommentPageComponent } from './comment-page/comment-page.component';
import { CommunityPageComponent } from './community-page/community-page.component';
import { HomeModule } from './home/home.module';
import { InterceptorService } from './interceptor.service';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { ApiService } from './services/api.service';
import { AskQuestionService } from './services/ask-question.service';
import { CommentSectionService } from './services/comment-section.service';
import { CommonService } from './services/common.service';
import { CommunityActivityService } from './services/community-activity.service';
import { CommunityMembersService } from './services/community-members.service';
import { CommunityMenuService } from './services/community-menu.service';
import { CommunitySuggestionGuideService } from './services/community-suggestion-guide.service';
import { CommunityService } from './services/community.service';
import { CreateCommunityService } from './services/create-community.service';
import { ExploreService } from './services/explore.service';
import { FeedService } from './services/feed.service';
import { InviteUserService } from './services/invite-user.service';
import { JWTService } from './services/jwt.service';
import { LoaderService } from './services/loader.service';
import { OTPVerificationService } from './services/otp-verification.service';
import { OverlayService } from './services/overlay.service';
import { PostMenuService } from './services/post-menu.service';
import { PostReportService } from './services/post-report.service';
import { QFileService } from './services/q-file.service';
import { SnackBarService } from './services/snackbar.service';
import { UserFollowerService } from './services/user-follower.service';
import { UserInteractionService } from './services/user-interaction.service';
import { UserListService } from './services/user-list.service';
import { UserProfileService } from './services/user-profile.service';
import { UtilityService } from './services/utility.service';
import { VideoService } from './services/video.service';
import { AppModalModule } from './shared/modals/modals.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { UserListPageComponent } from './user-list-page/user-list-page.component';

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
    SearchOverlayComponent,
    CommentPageComponent,
    CommunityPageComponent,
    UserListPageComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    AuthModule,
    MaterialModule,
    SharedModule,
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
    OverlayService,
    CommunityService,
    UserProfileService,
    PostReportService,
    CommentSectionService,
    ExploreService,
    CreateCommunityService,
    CommunitySuggestionGuideService,
    QFileService,
    CommunityActivityService,
    CommunityMembersService,
    UserListService,
    UserFollowerService,
    InviteUserService,
    CommunityMenuService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

