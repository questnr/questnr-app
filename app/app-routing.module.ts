import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { AuthGuard } from './auth/auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { GlobalConstants } from './shared/constants';

const routes: Routes = [
  { path: "", redirectTo: "/" + GlobalConstants.feedPath, pathMatch: "full" },
  { path: GlobalConstants.login, component: LoginComponent },
  { path: GlobalConstants.signUp, component: SignupComponent },
  { path: GlobalConstants.feedPath, component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
