import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { GlobalConstants } from "~/shared/constants";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

    canActivate() {
        if (this.authService.isUserLoggedIn()) {
            // @todo: remoteUser can be stored here if it is undefined
            return true;
        } else {
            this.routerExtensions.navigate(["/", GlobalConstants.login]);
            return false;
        }
    }
}