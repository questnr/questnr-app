import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class UserInteractionService {
    requests$: BehaviorSubject<boolean>;
    isUserInteractionEnabled$: Observable<boolean>;

    constructor() {
        this.requests$ = new BehaviorSubject(true);
        this.isUserInteractionEnabled$ = this.requests$.pipe(
            map(requests => requests)
        );
    }

    public onUserInteractionDisabled() {
        setTimeout(() => this.requests$.next(false), 10);
    }

    public onUserInteractionEnabled() {
        setTimeout(() => this.requests$.next(true), 10);
    }
}