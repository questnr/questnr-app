import { Component, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoading = false;

  constructor(private authSerivce: AuthService,
    public viewContainerRef: ViewContainerRef,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authSerivce.logout();
  }

  isTablet() {
    return this.utilityService.isTablet();
  }
}

// export function openModal(args) {
//   const mainView: Button = <Button>args.object;
//   const option: ShowModalOptions = {
//     context: { username: "test_username", password: "test" },
//     closeCallback: (username, password) => {
//       // Receive data from the modal view. e.g. username & password
//       alert(`Username: ${username} : Password: ${password}`);
//     },
//     fullscreen: true
//   };
//   mainView.showModal(modalViewModulets, option);
// }