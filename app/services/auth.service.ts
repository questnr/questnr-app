import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getString, setString } from "@nativescript/core/application-settings";
import { map } from 'rxjs/operators';
import { environment } from "~/environments/environment";
import { LoginResponse } from "~/shared/models/login.model";
import { LocalUser, LoginUser } from "../shared/models/user.model";
import { JWTService } from "./jwt.service";

const _CURRENT_USER = "_CURRENT_USER";
const _CURRENT_TOKEN = "_CURRENT_TOKEN";

@Injectable()
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private jwtService: JWTService) {
  }

  public isUserLoggedIn(): boolean {
    let loggedIn = !!this.user;

    return loggedIn;
  }

  getLocalUserProfile(accessToken): LocalUser {
    const decodedData = this.jwtService.parseJwt(accessToken);
    var current_time = Date.now() / 1000;
    if (decodedData.exp < current_time) {
      this.logout();
    }
    // console.log("decodedData", decodedData);
    return decodedData;
  }

  public login(user: LoginUser) {
    return this.http.post<LoginResponse>(this.baseUrl + 'login', user)
      .pipe(map((loginResponse: LoginResponse) => {
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.accessToken = loginResponse.accessToken;
          this.user = JSON.stringify(this.getLocalUserProfile(loginResponse.accessToken));
        }
        return loginResponse;
      }));
  }

  logout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user = "";
        resolve();
      }, 1000);
    });
  }

  private get user(): string {
    return getString(_CURRENT_USER);
  }

  private set user(theToken: string) {
    setString(_CURRENT_USER, theToken);
  }

  private get accessToken(): string {
    return getString(_CURRENT_TOKEN);
  }

  private set accessToken(theToken: string) {
    setString(_CURRENT_TOKEN, theToken);
  }
}