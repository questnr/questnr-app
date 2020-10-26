import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RouterExtensions } from "@nativescript/angular";
import { TextField } from "@nativescript/core";
import * as app from "@nativescript/core/application";
import { Device, isAndroid } from "@nativescript/core/platform";
import { alert } from "@nativescript/core/ui/dialogs";
import { Page } from "@nativescript/core/ui/page";
import { LoginResponse } from "~/shared/models/login.model";
import { AuthService } from "../../services/auth.service";
import { UtilityService } from "../../services/utility.service";
import { REGEX } from "../../shared/constants";

declare var android: any;

@Component({
  selector: "login",
  styleUrls: ['./login.component.scss'],
  moduleId: module.id,
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {

  @ViewChild('passwordComp') passwordField: ElementRef;
  @ViewChild('emailComp') emailField: ElementRef;
  group: FormGroup;
  email = new FormControl('brijeshlakkad22@gmail.com', { validators: [Validators.required, Validators.pattern(REGEX.EMAIL)] });
  password = new FormControl('123456bB', Validators.required);
  isAuthenticating = false;

  public hideIcon = String.fromCharCode(0xf070);
  public showIcon = String.fromCharCode(0xf06e);
  public showHideIcon: any;
  private showPassword = false;

  emailError = "";
  passError = "";
  loginError = "";

  emailHasFocus = false;
  passHasFocus = false;

  constructor(
    private authService: AuthService,
    private utilityService: UtilityService,
    private page: Page,
    private routerExtensions: RouterExtensions,
    private fb: FormBuilder
  ) {
    this.group = this.fb.group({
      emailId: this.email,
      password: this.password
    });
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundSpanUnderStatusBar = true;
    this.showHideIcon = this.hideIcon;

    if (isAndroid && Device.sdkVersion >= '21') {
      var View = android.view.View;
      var window = app.android.startActivity.getWindow();
      window.setStatusBarColor(0x000000);

      var decorView = window.getDecorView();
      decorView.setSystemUiVisibility(
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
  }

  // ngAfterViewChecked(): void {
  // let emailTextField: TextField = this.emailField.nativeElement;
  // console.log("emailTextField");
  // emailTextField.android.setGravity(17);
  // }

  public hasEmailErrors() {
    const hasErrorMsg = !!this.emailError;
    if (!hasErrorMsg)
      return false;

    const isValidEmail = this.email.valid;
    let hasError = hasErrorMsg || !isValidEmail;

    if (isValidEmail) {
      this.emailError = ""
      return false;
    }

    return hasError;
  }

  public hasPasswordErrors() {
    const hasErrorMsg = !!this.passError;
    if (!hasErrorMsg)
      return false;

    const isValidPassword = this.password.valid;
    let hasError = hasErrorMsg || !isValidPassword;

    if (isValidPassword) {
      this.passError = ""
      return false;
    }

    return hasError;
  }

  getEmailError() {
    return this.emailError;
  }

  getPasswordError() {
    return this.passError;
  }

  onEmailFocus() {
    this.emailHasFocus = true;
  }

  onPasswordFocus() {
    this.passHasFocus = true;

    this.updateErrors(false);
  }

  updateErrors(checkPass) {
    if (this.email.hasError("required")) {
      this.emailError = "Email cannot be blank"
    } else if (this.email.hasError("pattern")) {
      this.emailError = "Invalid Email.";
    } else {
      this.emailError = "";
    }

    if (checkPass) {
      let length = this.password.value.length;
      if (length == 0) {
        this.passError = "Password cannot be blank";
      } else {
        this.passError = "";
      }
    }
  }

  hasLoginErrors() {
    return !!this.loginError;
  }

  getLoginError() {
    return this.loginError;
  }

  private isValidForm() {
    let isValid = !!this.emailError || !!this.passError;
    return !isValid;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
    this.showHideIcon = this.showPassword ? this.showIcon : this.hideIcon;
    let passField: TextField = this.passwordField.nativeElement;
    passField.secure = !passField.secure;
  }

  login() {
    this.updateErrors(true);

    if (this.isValidForm()) {
      this.isAuthenticating = true;
      // Use the backend service to login
      this.authService.login(this.group.value).subscribe((loginResponse: LoginResponse) => {
        this.isAuthenticating = false;
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.routerExtensions.navigate(["/home"], { clearHistory: true });
        } else {
          this.loginError = loginResponse.errorMessage;
        }
      }, (error) => {
        this.isAuthenticating = false;
        this.loginError = error.message;
      });
    }
  }

  isSubmitEnabled() {
    return !this.isAuthenticating && this.email.valid && this.password.valid;
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  // You can configure your backend and present appropriate window for recovery.
  forgotPassword() {
    alert({
      title: "Forgot Password",
      message: "Configure your backend to add a forgot password. Check 'login-kinvey' branch to work with Kinvey backend.",
      okButtonText: "Close"
    }).then(function () {
      console.log("Dialog closed!");
    });
  }
}