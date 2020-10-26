import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'qn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public loaderService: LoaderService) {
  }
}
