import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

    canActivate() {
        if (this.authService.isUserLoggedIn()) {
            return true;
        } else {
            this.routerExtensions.navigate(["/login"]);
            return false;
        }
    }
}