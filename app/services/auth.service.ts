import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { getString, setString } from "@nativescript/core/application-settings";
import { Observable, of } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { environment } from "~/environments/environment";
import { AvatarDTO } from "~/shared/models/common.model";
import { LoginResponse } from "~/shared/models/login.model";
import { LocalUser, LoginUser, User } from "../shared/models/user.model";
import { JWTService } from "./jwt.service";
import { LoaderService } from "./loader.service";
import staticLoginReponse from './login.dev';

const _CURRENT_USER = "_CURRENT_USER";
const _CURRENT_TOKEN = "_CURRENT_TOKEN";

@Injectable()
export class AuthService {
  private baseUrl = environment.baseUrl;
  private remoteUser: User;
  private avatar: AvatarDTO;

  constructor(private http: HttpClient,
    private jwtService: JWTService,
    private loaderService: LoaderService,
    private routerExtension: RouterExtensions) {

    // if (!environment.production) {
    //   // @todo: only for testing purpose
    //   this.accessToken = staticLoginReponse.accessToken;
    //   this.user = JSON.stringify(staticLoginReponse.accessToken);
    // }
  }
  checkUsernameExists(val: string) {
    return this.http.post(this.baseUrl + 'check-username', { username: val });
  }

  checkEmailExists(val: string) {
    return this.http.post(this.baseUrl + 'check-email', { email: val });
  }

  public setUserLoginData(loginResponse: LoginResponse): void {
    this.accessToken = loginResponse.accessToken;
    this.user = JSON.stringify(this.getLocalUserProfile(loginResponse.accessToken));
  }

  public login(user: LoginUser) {
    return this.http.post<LoginResponse>(this.baseUrl + 'login', user)
      .pipe(map((loginResponse: LoginResponse) => {
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.setUserLoginData(loginResponse);
          this.getLoggedInUserDetails().subscribe((user) => {
            // console.log("getLoggedInUserDetails", user);
          });
        }
        return loginResponse;
      }));
  }

  public saveRemoveUser(): void {
    if (!this.remoteUser) {
      this.getLoggedInUserDetails().subscribe((user) => {
        // console.log("getLoggedInUserDetails", user);
      });
    }
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

  getLoggedInUserDetails(): Observable<User | void> {
    let localUser = this.getStoredUserProfile();
    return this.getUserDetails(localUser.id).pipe(map((user: User) => {
      console.log("getUserDetails");
      if (localUser.id == user.userId) {
        this.remoteUser = user;
        this.avatar = this.remoteUser.avatarDTO;
        return user;
      } else {
        this.logout();
        return of(null);
      }
    }), catchError((error: HttpErrorResponse) => {
      this.logout();
      return of(null);
    }));
  }

  public setUser(user: User) {
    if (!this.remoteUser || this.remoteUser?.userId === user.userId) {
      this.remoteUser = user;
    }
  }

  public getUser(): User {
    return this.remoteUser;
  }

  public getAvatar(): AvatarDTO {
    return this.avatar;
  }

  private getLocalUserProfile(accessToken): LocalUser {
    const decodedData = this.jwtService.parseJwt(accessToken);
    var current_time = Date.now() / 1000;
    if (decodedData.exp < current_time) {
      this.logout();
    }
    // console.log("decodedData", decodedData);
    return decodedData;
  }

  public getStoredUserProfile(): LocalUser {
    return this.getLocalUserProfile(this.accessToken);
  }

  logout() {
    this.loaderService.onRequestStart();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user = "";
        this.routerExtension.navigate(['/login']);
        this.loaderService.onRequestEnd();
        resolve();
      }, 1000);
    });
  }

  isThisLoggedInUser(userId: number): boolean {
    if (this.remoteUser?.userId) {
      return this.remoteUser.userId === userId;
    }
    try {
      return this.getStoredUserProfile().id === userId;
    } catch (e) {
      return false;
    }
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

  private get accessToken(): string {
    return getString(_CURRENT_TOKEN);
  }

  private set accessToken(theToken: string) {
    setString(_CURRENT_TOKEN, theToken);
  }
}