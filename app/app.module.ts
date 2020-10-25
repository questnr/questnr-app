import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
import { UtilityService } from './services/utility.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    UtilityService,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }

