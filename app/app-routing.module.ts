import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AuthGuard } from './auth/auth-guard.service';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CommentPageComponent } from './comment-page/comment-page.component';
import { FeedComponent } from './home/feed/feed.component';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './home/user-page/user-page.component';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { GlobalConstants } from './shared/constants';

const routes: Routes = [
  {
    path: "", redirectTo: "/" +
      GlobalConstants.homePath + `/(feedTab:${GlobalConstants.feedPath}//userPageTab:${GlobalConstants.userPath})`, pathMatch: "full"
  },
  { path: GlobalConstants.search, component: SearchOverlayComponent },
  { path: GlobalConstants.login, component: LoginComponent },
  { path: GlobalConstants.signUp, component: SignupComponent },
  { path: GlobalConstants.forgotPassword, component: ForgotPasswordComponent },
  {
    path: GlobalConstants.homePath, component: HomeComponent,
    children: [
      {
        path: GlobalConstants.feedPath,
        component: FeedComponent,
        outlet: 'feedTab'
      },
      {
        path: GlobalConstants.userPath,
        component: UserPageComponent,
        outlet: 'userPageTab'
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: GlobalConstants.feedCommentPath + "/:postId",
    // path: [
    //   ':postId',
    //   GlobalConstants.feedCommentPath
    // ].join("/"),
    component: CommentPageComponent
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes, {
    // enableTracing: true // <-- debugging purposes only
  })],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
