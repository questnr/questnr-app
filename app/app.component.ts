import { Component } from '@angular/core';
import * as orientation from 'nativescript-orientation';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'qn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public loaderService: LoaderService) {
    // Set orientation to portrait
    orientation.setOrientation("portrait");
    // Disable rotation
    orientation.disableRotation();
  }
}
