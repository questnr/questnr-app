import { Component, ViewContainerRef } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoading = false;

  constructor(public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  isTablet() {
    return this.utilityService.isTablet();
  }
}