import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MenuState } from "~/shared/models/menu.model";
import { Post } from "~/shared/models/post-action.model";
import { OverlayReasonType, OverlayService } from "./overlay.service";
import { UserInteractionService } from "./user-interaction.service";

@Injectable({
    providedIn: "root"
})
export class PostMenuService {
    postRequests$: BehaviorSubject<Post> = new BehaviorSubject(null);
    postEditRequest$: BehaviorSubject<Post> = new BehaviorSubject(null);
    postDeleteRequest$: BehaviorSubject<number> = new BehaviorSubject(null);
    prevShowingMenu: MenuState = MenuState.unset;
    currentlyShowingMenu: MenuState = MenuState.unset;
    isShowing$: Observable<boolean>;

    constructor(private userInteractionService: UserInteractionService,
        private overlayService: OverlayService) {
        this.postRequests$ = new BehaviorSubject(null);
        this.postEditRequest$ = new BehaviorSubject(null);
        this.postDeleteRequest$ = new BehaviorSubject(null);
        this.isShowing$ = this.postRequests$.pipe(
            map(requests => {
                this.prevShowingMenu = this.currentlyShowingMenu;
                if (requests != null) {
                    this.overlayService.onOverlayStart(OverlayReasonType.postMenu);
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

    public onRequestPostEdit(post: Post) {
        this.postEditRequest$.next(post);
    }

    public onRequestPostDeletion(postActionId: number) {
        this.postDeleteRequest$.next(postActionId);
    }

    public onRequestStart(post: Post) {
        setTimeout(() => this.postRequests$.next(post), 10);
    }

    public onRequestEnd() {
        if (this.currentlyShowingMenu === MenuState.showing)
            setTimeout(() => this.postRequests$.next(null), 10);
    }
}