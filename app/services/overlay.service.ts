import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

export enum OverlayReasonType {
    unset,
    postMenu,
    communityMenu
}

@Injectable({
    providedIn: "root"
})
export class OverlayService {
    reasonType: OverlayReasonType;
    requests$: BehaviorSubject<boolean>;
    isOverlaying$: Observable<boolean>;

    constructor(
    ) {
        this.requests$ = new BehaviorSubject(false);
        this.isOverlaying$ = this.requests$.pipe(
            map(requests => requests)
        );
    }

    public onOverlayStart(reasonType: OverlayReasonType) {
        this.reasonType = reasonType;
        setTimeout(() => this.requests$.next(true), 10);
    }

    public onOverlayEnd() {
        this.reset();
        setTimeout(() => this.requests$.next(false), 10);
    }

    private reset(): void {
        this.reasonType = OverlayReasonType.unset;
    }
}