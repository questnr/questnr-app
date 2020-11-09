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

const _CURRENT_USER = "_CURRENT_USER";
const _CURRENT_TOKEN = "_CURRENT_TOKEN";

const staticLoginReponse = {
  "loginSuccess": true,
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicmlqZXNobGFra2FkMjIiLCJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX1VTRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImNyZWF0ZWQiOjE2MDQ5NDIxMDI0MzIsIm5hbWUiOiJicmlqZXNobGFra2FkMjIiLCJlbWFpbElkIjoiZHVtbXkxQGR1bW15LnF1ZXN0bnIuY29tIiwiaWQiOjEsImV4cCI6MTYwNTU0NjkwMiwiaWF0IjoxNjA0OTQyMTAyLCJzbHVnIjoiYnJpamVzaGxha2thZDIyLTMwMTk4MjUwMzMifQ.fU8JHooaDOD_NqudiwlYQUXG16nbfZtqm5tU-90c_U362p7cGq8AncgMoUKXP188y0HjnvjbI--YkKyJ4aswGA",
  "userName": "brijeshlakkad22",
  "errorMessage": null,
  "communitySuggestion": false,
  "firstAttempt": true
};

const staticLoginReponse2 = {
  "loginSuccess": true,
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJicmlqZXNobGFra2FkIiwicm9sZSI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn0seyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJjcmVhdGVkIjoxNjA0Njg0MDU1NTIwLCJuYW1lIjoiQnJpamVzaCBMYWtrYWQiLCJlbWFpbElkIjoiYnJpamVzaGxha2thZDIyQGdtYWlsLmNvbSIsImlkIjoxLCJleHAiOjE2MDUyODg4NTUsImlhdCI6MTYwNDY4NDA1NSwic2x1ZyI6ImJyaWplc2gtbGFra2FkLTA0ODc1MTA2NzYifQ.nJCw6qNrEPn8CnLOEt4YZRcrpuFYM_t9hs6ipnEozyxBiRCJ2rI6yejVww8Y4mRgNKdD_XjCsHR-ypwAlv9xLg",
  "userName": "brijeshlakkad",
  "errorMessage": null,
  "communitySuggestion": false,
  "firstAttempt": true
};

@Injectable()
export class AuthService {
  private baseUrl = environment.baseUrl;
  private remoteUser: User;
  private avatar: AvatarDTO;

  constructor(private http: HttpClient,
    private jwtService: JWTService,
    private loaderService: LoaderService,
    private routerExtension: RouterExtensions) {
    // @todo: only for testing purpose
    this.accessToken = staticLoginReponse.accessToken;
    this.user = JSON.stringify(staticLoginReponse.accessToken);

    // this.getLoggedInUserDetails().subscribe((user) => {
    //   console.log("getLoggedInUserDetails", user);
    // });
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
          this.accessToken = loginResponse.accessToken;
          this.user = JSON.stringify(this.getLocalUserProfile(loginResponse.accessToken));
          this.getLoggedInUserDetails().subscribe((user) => {
            console.log("getLoggedInUserDetails", user);
          });
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
    let localUser = this.getLocalUserProfile(this.accessToken);
    return this.getUserDetails(localUser.id).pipe(map((user: User) => {
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

  public getUser(): User {
    return this.remoteUser;
  }

  public getAvatar(): AvatarDTO {
    return this.avatar;
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
        this.routerExtension.navigate(['/login']);
        this.loaderService.onRequestEnd();
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

  private get accessToken(): string {
    return getString(_CURRENT_TOKEN);
  }

  private set accessToken(theToken: string) {
    setString(_CURRENT_TOKEN, theToken);
  }
}