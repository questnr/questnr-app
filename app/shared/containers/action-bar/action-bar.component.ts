import { Component, Input, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { SearchBar } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { AuthService } from '~/services/auth.service';
import { QRouterService } from '~/services/q-router.service';
import { GlobalConstants } from '~/shared/constants';

declare var android: any;

@Component({
  selector: 'qn-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {
  @Input() pageViewContainerRef: ViewContainerRef;
  @Input() isChildPage: boolean = false;
  @Input() title: string;
  searchBar: SearchBar;

  constructor(private authSerivce: AuthService,
    private routerExtenstions: RouterExtensions,
    private qRouterService: QRouterService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  onLogoTap(args): void {
    this.qRouterService.goToHome();
  }

  onNavBtnTap(args): void {
    this.routerExtenstions.backToPreviousPage();
  }
  logout() {
    this.authSerivce.logout();
  }

  onSearchLayoutLoaded(event) {
    // @todo: ios
    if (event.object.android) {
      event.object.android.setFocusableInTouchMode(true);
    }
  }

  onSearchBarLoaded(event) {
    this.searchBar = event.object as SearchBar;
    // @todo: ios
    if (this.searchBar.android) {
      event.object.android.clearFocus();
      // Change Focus listener
      this.searchBar.android.setOnQueryTextFocusChangeListener(new android.view.View.OnFocusChangeListener({
        onFocusChange: (v: any, hasFocus: boolean) => {
          this.ngZone.run(() => {
            if (hasFocus) {
              this.showSearchModal();
            }
          });
        }
      }));
    }
  }

  showSearchModal() {
    this.routerExtenstions.navigate(
      ['/',
        GlobalConstants.search,
      ], {
      animated: true,
      transition: {
        duration: 400,
        curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
      }
    });
  }

  onSubmit(args) {
    console.log(`Searching for ${this.searchBar.text}`);
  }

  onTextChanged(args) {
    console.log(`Input changed! New value: ${this.searchBar.text}`);
  }

  onClear(args) {
    console.log(`Clear event raised`);
  }
}
