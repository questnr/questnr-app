import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
