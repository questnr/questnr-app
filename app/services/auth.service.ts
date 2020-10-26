import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getString, setString } from "@nativescript/core/application-settings";
import { environment } from "~/environments/environment";
import { LoginResponse } from "~/shared/models/login.model";
import { LoginUser } from "../shared/models/user.model";

const _CURRENT_USER = "_CURRENT_USER";

@Injectable()
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {

  }

  public isUserLoggedIn(): boolean {
    let loggedIn = !!this.user;

    return loggedIn;
  }

  public login(user: LoginUser) {
    return this.http.post<LoginResponse>(this.baseUrl + 'login', user);
  }

  logout() {
    let that = this;
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        that.user = "";
        resolve();
      }, 1000)
    });
  }

  private get user(): string {
    return getString(_CURRENT_USER);
  }

  private set user(theToken: string) {
    setString(_CURRENT_USER, theToken);
  }
}