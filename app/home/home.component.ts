import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoading = false;

  // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
  constructor(private authSerivce: AuthService,
    private routerExtension: RouterExtensions,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  logout() {
    this.isLoading = true;
    this.authSerivce.logout()
      .then(() => {
        this.routerExtension.navigate(['/login']);
        this.isLoading = false;
      });
  }

  isTablet() {
    return this.utilityService.isTablet();
  }
}
