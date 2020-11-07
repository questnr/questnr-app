import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { SearchBar } from '@nativescript/core';
import { AuthService } from '~/services/auth.service';
import { GlobalConstants } from '~/shared/constants';

declare var android: any;

@Component({
  selector: 'qn-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {
  @Input() pageViewContainerRef: ViewContainerRef;
  searchBar: SearchBar;

  constructor(private authSerivce: AuthService,
    private routerExtension: RouterExtensions) { }

  ngOnInit(): void {
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
          if (hasFocus) {
            this.showSearchModal();
          } else {

          }
        }
      }));
    }
  }

  showSearchModal() {
    this.routerExtension.navigate(['/', GlobalConstants.search]);
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
