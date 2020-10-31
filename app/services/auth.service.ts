import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { getString, setString } from "@nativescript/core/application-settings";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from "~/environments/environment";
import { AvatarDTO } from "~/shared/models/common.model";
import { LoginResponse } from "~/shared/models/login.model";
import { LocalUser, LoginUser, User } from "../shared/models/user.model";
import { JWTService } from "./jwt.service";
import { LoaderService } from "./loader.service";

const _CURRENT_LOGIN = "_CURRENT_LOGIN";
const _CURRENT_USER = "_CURRENT_USER";
const _CURRENT_TOKEN = "_CURRENT_TOKEN";

@Injectable()
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient,
    private jwtService: JWTService,
    private loaderService: LoaderService,
    private routerExtension: RouterExtensions) {
  }
  checkUsernameExists(val: string) {
    return this.http.post(this.baseUrl + 'check-username', { username: val });
  }

  checkEmailExists(val: string) {
    return this.http.post(this.baseUrl + 'check-email', { email: val });
  }

  public login(user: LoginUser) {
    return this.http.post<LoginResponse>(this.baseUrl + 'login', user)
      .pipe(map((loginResponse: LoginResponse) => {
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.loginResponse = JSON.stringify(loginResponse);
          this.accessToken = loginResponse.accessToken;
          this.user = JSON.stringify(this.getLocalUserProfile(loginResponse.accessToken));
        }
        return loginResponse;
      }));
  }

  loginWithGoogle(data) {
    return this.http.get(this.baseUrl + 'oauth2/google/login/token', { params: data });
  }

  loginWithFacebook(data) {
    return this.http.get(this.baseUrl + 'oauth2/facebook/login/token', { params: data });
  }

  public signUp(user) {
    return this.http.post<LoginResponse>(this.baseUrl + 'sign-up', user)
      .pipe(map((loginResponse: LoginResponse) => {
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.loginResponse = JSON.stringify(loginResponse);
          this.accessToken = loginResponse.accessToken;
          this.user = JSON.stringify(this.getLocalUserProfile(loginResponse.accessToken));
        }
        return loginResponse;
      }));
  }

  getUserAvatar(): Observable<AvatarDTO> {
    return this.http.get<AvatarDTO>(this.baseUrl + 'user/avatar');
  }

  getUserDetails(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'user/' + id);
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

  logout() {
    this.loaderService.onRequestStart();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user = "";
        this.accessToken = "";
        this.loginResponse = "";
        this.loaderService.onRequestEnd();
        this.routerExtension.navigate(['/login']);
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

  getAccessToken(): string {
    return this.accessToken;
  }

  private get loginResponse(): string {
    return getString(_CURRENT_LOGIN);
  }

  private set loginResponse(loginResponseVal: string) {
    setString(_CURRENT_LOGIN, loginResponseVal);
  }

  getLoginResponse(): string {
    return this.loginResponse;
  }

  private get accessToken(): string {
    return getString(_CURRENT_TOKEN);
  }

  private set accessToken(theToken: string) {
    setString(_CURRENT_TOKEN, theToken);
  }
}