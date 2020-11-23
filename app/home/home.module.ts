import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MaterialModule } from '~/shared/material.module';
import { SharedModule } from '~/shared/shared.module';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { ExplorePageComponent } from './explore-page/explore-page.component';
import { FeedComponent } from './feed/feed.component';
import { HomeComponent } from './home.component';
import { UserPageComponent } from './user-page/user-page.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    FeedComponent,
    UserPageComponent,
    ExplorePageComponent,
    CreateCommunityPageComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
