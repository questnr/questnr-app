import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AuthGuard } from './auth/auth-guard.service';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { GlobalConstants } from './shared/constants';
import { CommentContainerComponent } from './comment-container/comment-container.component';

const routes: Routes = [
  { path: "", redirectTo: "/" + GlobalConstants.feedPath, pathMatch: "full" },
  { path: GlobalConstants.search, component: SearchOverlayComponent },
  { path: GlobalConstants.login, component: LoginComponent },
  { path: GlobalConstants.signUp, component: SignupComponent },
  { path: GlobalConstants.forgotPassword, component: ForgotPasswordComponent },
  { path: GlobalConstants.feedPath, component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: [
      GlobalConstants.feedPath,
      ':postId',
      GlobalConstants.feedCommentPath
    ].join("/"), component: CommentContainerComponent, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
