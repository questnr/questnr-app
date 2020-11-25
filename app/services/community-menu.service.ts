import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Community } from "~/shared/models/community.model";
import { MenuState } from "~/shared/models/menu.model";
import { OverlayReasonType, OverlayService } from "./overlay.service";
import { UserInteractionService } from "./user-interaction.service";

@Injectable({
    providedIn: "root"
})
export class CommunityMenuService {
    communityRequests$: BehaviorSubject<Community>;
    communityEditRequest$: BehaviorSubject<Community>;
    // communityDeleteRequest$: BehaviorSubject<number>;
    prevShowingMenu: MenuState = MenuState.unset;
    currentlyShowingMenu: MenuState = MenuState.unset;
    isShowing$: Observable<boolean>;

    constructor(private userInteractionService: UserInteractionService,
        private overlayService: OverlayService) {
        this.communityRequests$ = new BehaviorSubject(null);
        this.communityEditRequest$ = new BehaviorSubject(null);
        // this.communityDeleteRequest$ = new BehaviorSubject(null);
        this.isShowing$ = this.communityRequests$.pipe(
            map(requests => {
                this.prevShowingMenu = this.currentlyShowingMenu;
                if (requests != null) {
                    this.overlayService.onOverlayStart(OverlayReasonType.communityMenu);
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

    public onRequestCommunityEdit(community: Community) {
        this.communityEditRequest$.next(community);
    }

    // public onRequestPostDeletion(postActionId: number) {
    //     this.postDeleteRequest$.next(postActionId);
    // }

    public onRequestStart(community: Community) {
        setTimeout(() => this.communityRequests$.next(community), 10);
    }

    public onRequestEnd() {
        if (this.currentlyShowingMenu === MenuState.showing)
            setTimeout(() => this.communityRequests$.next(null), 10);
    }
}