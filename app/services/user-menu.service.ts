import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AvatarDTO } from "~/shared/models/common.model";
import { MenuState } from "~/shared/models/menu.model";
import { User } from "~/shared/models/user.model";
import { OverlayReasonType, OverlayService } from "./overlay.service";
import { UserInteractionService } from "./user-interaction.service";

@Injectable({
    providedIn: "root"
})
export class UserMenuService {
    userRequest$: BehaviorSubject<User>;
    userAvatarRefreshRequest$: BehaviorSubject<AvatarDTO>;
    userBannerRefreshRequest$: BehaviorSubject<AvatarDTO>;
    prevShowingMenu: MenuState = MenuState.unset;
    currentlyShowingMenu: MenuState = MenuState.unset;
    isShowing$: Observable<boolean>;

    constructor(private userInteractionService: UserInteractionService,
        private overlayService: OverlayService) {
        this.userRequest$ = new BehaviorSubject(null);
        this.userAvatarRefreshRequest$ = new BehaviorSubject(null);
        this.userBannerRefreshRequest$ = new BehaviorSubject(null);
        this.isShowing$ = this.userRequest$.pipe(
            map(requests => {
                this.prevShowingMenu = this.currentlyShowingMenu;
                if (requests != null) {
                    this.overlayService.onOverlayStart(OverlayReasonType.userMenu);
                    this.userInteractionService.onUserInteractionDisabled();
                    this.currentlyShowingMenu = MenuState.showing;
                } else {
                    this.overlayService.onOverlayEnd();
                    this.userInteractionService.onUserInteractionEnabled();
                    this.currentlyShowingMenu = MenuState.hidden;
                }
                return requests != null;
            })
        );
    }

    public onRequestUserAvatarRefresh(avatar: AvatarDTO) {
        this.userAvatarRefreshRequest$.next(avatar);
    }

    public onRequestUserBannerRefresh(avatar: AvatarDTO) {
        this.userBannerRefreshRequest$.next(avatar);
    }

    public onRequestStart(user: User) {
        setTimeout(() => this.userRequest$.next(user), 10);
    }

    public onRequestEnd() {
        if (this.currentlyShowingMenu === MenuState.showing)
            setTimeout(() => this.userRequest$.next(null), 10);
    }
}