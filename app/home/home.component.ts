import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

}