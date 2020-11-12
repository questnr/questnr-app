import { Component } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import * as orientation from 'nativescript-orientation';
import { Video } from 'nativescript-videoplayer';
import { LoaderService } from './services/loader.service';
const tnsfx = require('nativescript-effects');
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("VideoPlayer", () => Video);

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
