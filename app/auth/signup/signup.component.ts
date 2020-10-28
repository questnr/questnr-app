import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RouterExtensions } from "@nativescript/angular";
import { TextField } from "@nativescript/core";
import * as app from "@nativescript/core/application";
import { Device, isAndroid } from "@nativescript/core/platform";
import { alert } from "@nativescript/core/ui/dialogs";
import { Page } from "@nativescript/core/ui/page";
import { CommonService } from "~/services/common.service";
import { OTPVerificationService } from "~/services/otp-verification.service";
import { SnackBarService } from "~/services/snackbar.service";
import { GlobalConstants, REGEX } from "~/shared/constants";
import { LoginResponse } from "~/shared/models/login.model";
import { AuthService } from "../../services/auth.service";
import { UtilityService } from "../../services/utility.service";
import { OtpVerificationComponent } from "../otp-verification/otp-verification.component";

declare var android: any;

enum USER_FOCUS {
  prestine, touched, dirty
}

@Component({
  selector: "qn-signup",
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
  moduleId: module.id,
  templateUrl: "./signup.component.html"
})
export class SignupComponent implements OnInit {
  @ViewChild('passwordComp') passwordField: ElementRef;
  @ViewChild('emailComp') emailField: ElementRef;
  group: FormGroup;
  email = new FormControl('', { validators: [Validators.required, Validators.pattern(REGEX.EMAIL)] });
  username = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern(/^[_A-z0-9]*$/),
      Validators.minLength(3),
      Validators.maxLength(32),
    ],
  });
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(100)
  ]);
  isAuthenticating = false;

  public hideIcon = String.fromCharCode(0xf070);
  public showIcon = String.fromCharCode(0xf06e);
  public showHideIcon: any;
  private showPassword = false;

  emailError = "";
  usernameError = "";
  passError = "";
  loginError = "";

  emailHasFocus = USER_FOCUS.prestine;
  usernameHasFocus = USER_FOCUS.prestine;
  passHasFocus = USER_FOCUS.prestine;

  currentStep: number = 0;
  steps = {
    0: {
      title: "Create Account",
      error: ''
    },
    1: {
      title: "Verify OTP",
      error: ''
    },
    2: {
      title: "Create Account",
      error: ''
    }
  };

  maxSteps: number = 0;
  publicEntityId: number;
  enteredOTP: string;

  hasOTPBeenSent: boolean = true;
  isSendingOTP: boolean = false;
  isResendingOTP: boolean = false;
  isVerifying: boolean = false;
  canResend: boolean = true;
  timeToEnableResend: string;
  secondsAfterEnableResend: number = 120;
  changingSecondsAfterEnableResend: number = 120;

  currentStepLock: boolean = false;
  resendEnableTimer;

  otpVerificationRef: OtpVerificationComponent
  @ViewChild("otpVerification")
  set otpVerification(otpVerificationRef: OtpVerificationComponent) {
    this.otpVerificationRef = otpVerificationRef;
  }

  constructor(
    private authService: AuthService,
    private utilityService: UtilityService,
    private page: Page,
    private routerExtensions: RouterExtensions,
    private fb: FormBuilder,
    private otpVerificationService: OTPVerificationService,
    private snackbarService: SnackBarService,
    private commonService: CommonService
  ) {
    this.group = this.fb.group({
      emailId: this.email,
      username: this.username,
      password: this.password
    });
    this.maxSteps = Object.keys(this.steps).length;
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
    return this.emailHasFocus === USER_FOCUS.touched &&
      !!this.validateEmail();
  }

  public hasUsernameErrors() {
    return this.usernameHasFocus === USER_FOCUS.touched &&
      !!this.validateUsername();
  }

  public hasPasswordErrors() {
    return this.passHasFocus === USER_FOCUS.touched &&
      !!this.validatePassword();
  }

  getEmailError() {
    return this.emailError;
  }

  getUsernameError() {
    return this.usernameError;
  }

  getPasswordError() {
    return this.passError;
  }

  onEmailFocus() {
    this.emailHasFocus = USER_FOCUS.touched;
  }

  onUsernameFocus() {
    this.usernameHasFocus = USER_FOCUS.touched;
  }

  onPasswordFocus() {
    this.passHasFocus = USER_FOCUS.touched;
  }

  getPageTitle(): string {
    return this.steps[this.currentStep].title;
  }

  hasStepErrors() {
    return !!this.steps[this.currentStep].error;
  }

  getStepErrors() {
    return this.steps[this.currentStep].error;
  }

  authenticatingOnStart() {
    this.isAuthenticating = true;
  }

  authenticatingOnStop() {
    this.isAuthenticating = false;
  }

  hasAuthenticating() {
    return this.isAuthenticating;
  }

  isStepEnabled() {
    return !this.hasAuthenticating()
      && !this.hasStepErrors();
  }

  validateEmail(silent: boolean = false): string {
    let error;
    if (this.email.hasError("required")) {
      error = "Email cannot be blank";
    } else if (this.email.hasError("pattern")) {
      error = "Invalid Email.";
    } else {
      error = "";
    }
    if (!silent) {
      this.emailError = error;
    }
    return error;
  }

  validateUsername(silent: boolean = false): string {
    let error;
    if (this.username.hasError("required")) {
      error = "Username cannot be blank"
    } else if (this.username.hasError("minlength")) {
      error = "Username should contain at least 3 characters";
    } else if (this.username.hasError("maxlength")) {
      error = "Username can have max 32 characters";
    } else if (this.username.hasError("pattern")) {
      error = "Only upper case, lower case, numbers and underscore (_) are allowed";
    } else {
      error = "";
    }
    if (!silent) {
      this.usernameError = error;
    }
    return error;
  }

  validatePassword(silent: boolean = false): string {
    let error;
    if (this.password.hasError('required')) {
      error = "Password is required.";
    } else if (this.password.hasError('minlength')) {
      error = "Password should contain at least 6 characters";
    } else if (this.password.hasError('minlength')) {
      error = "Field can have max 100 characters";
    } else {
      error = "";
    }
    if (!silent) {
      this.passError = error;
    }
    return error;
  }

  ifCurrentStep(index: number): boolean {
    return index === this.currentStep;
  }
  isNextStepAvailable(pressedNext: boolean = false): boolean {
    if (this.isAuthenticating) return false;
    if (this.currentStep === 0 || pressedNext) {
      return !this.validateEmail(true);
    } else if (this.currentStep === 1 && this.otpVerificationRef) {
      return this.otpVerificationRef.validateOTP();
    } else if (this.currentStep === 2 || pressedNext) {
      return !this.validateUsername(true) && !this.validatePassword(true);
    } else {
      return false;
    }
  }
  updateStepError(errorMessage: string) {
    this.steps[this.currentStep].error = errorMessage;
  }
  resetStepError() {
    this.steps[this.currentStep].error = "";
  }
  submitStep() {
    if (this.hasAuthenticating() || !this.isNextStepAvailable(true)) return;
    this.resetStepError();
    this.authenticatingOnStart();
    if (this.currentStep === 0) {
      this.authService.checkEmailExists(this.email.value).subscribe((resp: any) => {
        this.sendOTP().then(() => {
          this.nextStep();
          this.authenticatingOnStop();
        }).catch(() => {
          this.startOver();
          this.authenticatingOnStop();
        })
      }, ((err: HttpErrorResponse) => {
        this.authenticatingOnStop();
        if (err && err.error) {
          this.updateStepError(err.error.errorMessage);
        }
      }));
    }
    if (this.currentStep === 1) {
      this.enteredOTP = this.otpVerificationRef.getOTP();
      this.verifyOTP(this.enteredOTP).then(() => {
        this.nextStep();
        this.authenticatingOnStop();
      }).catch(() => {
        this.authenticatingOnStop();
      });
    }
    if (this.currentStep === 2) {
      this.isNextStepAvailable(true);
      if (this.isValidForm()) {
        this.authService.checkUsernameExists(this.username.value).subscribe((resp: any) => {
          let obj = { ...this.group.value, otp: this.enteredOTP };
          if (typeof this.publicEntityId != 'undefined' && this.publicEntityId) {
            obj["publicEntityId"] = this.publicEntityId;
          }
          this.authService.signUp(obj).subscribe(
            (res: LoginResponse) => {
              this.authenticatingOnStop();
              if (res.loginSuccess) {
                this.signUpSuccess(res);
              } else {
                this.updateStepError(res.errorMessage);
              }
            }, (err) => {
              this.startOver();
              this.authenticatingOnStop();
              if (err?.error?.errorMessage)
                this.snackbarService.show({ snackText: err.error.errorMessage });
              else
                this.snackbarService.show({ snackText: 'something went wrong.' });
            });
        }, (err: HttpErrorResponse) => {
          this.authenticatingOnStop();
          if (err && err.error) {
            this.updateStepError(err.error.errorMessage);
          }
        });
      }
    }
  }

  nextStep() {
    if (this.currentStepLock) return;
    if (this.currentStep <= this.maxSteps - 1) {
      this.currentStepLock = true;
      this.currentStep++;
      this.currentStepLock = false;
    }
  }

  destroyAndStepBack() {
    if (this.currentStepLock) return;
    if (this.currentStep > 0) {
      this.currentStepLock = true;
      this.currentStep--;
      this.currentStepLock = false;
    }
  }

  startOver() {
    if (this.currentStepLock) return;
    this.currentStepLock = true;
    this.currentStep = 0;
    if (this.resendEnableTimer) {
      clearTimeout(this.resendEnableTimer);
    }
    this.canResend = true;
    this.isSendingOTP = false;
    this.hasOTPBeenSent = false;
    this.isResendingOTP = false;
    this.timeToEnableResend = "";
    this.currentStepLock = false;
  }

  sendOTP() {
    this.isSendingOTP = true;
    this.hasOTPBeenSent = false;
    return new Promise((resolve, reject) => {
      this.otpVerificationService.sendOTP(this.email.value).subscribe((res: any) => {
        this.snackbarService.show({ snackText: 'OTP has been sent successfully' });
        this.startResendEnableTimer();
        this.isSendingOTP = false;
        this.hasOTPBeenSent = true;
        resolve();
      }, (err: any) => {
        this.isSendingOTP = false;
        if (err?.error?.errorMessage)
          this.snackbarService.show({ snackText: err.error.errorMessage });
        else
          this.snackbarService.show({ snackText: 'something went wrong.' });
        reject();
      });
    });
  }

  getResendOTPText() {
    let resendText: string = "Resend OTP";
    if (!!this.timeToEnableResend)
      return resendText + " " + this.timeToEnableResend;
    return resendText;
  }

  startResendEnableTimer() {
    this.canResend = false;
    this.changingSecondsAfterEnableResend = this.secondsAfterEnableResend;
    this.resendEnableTimer = setInterval(() => {
      let minutes = Math.floor(this.changingSecondsAfterEnableResend / 60);
      let seconds = Math.floor(this.changingSecondsAfterEnableResend % 60);
      this.timeToEnableResend = this.commonService.appendZero(minutes) + ":" + this.commonService.appendZero(seconds);
      this.changingSecondsAfterEnableResend--;
      if (this.changingSecondsAfterEnableResend === 0) {
        clearInterval(this.resendEnableTimer);
        this.timeToEnableResend = undefined;
        this.canResend = true;
      }
    }, 1000);
  }

  resendOTP() {
    if (this.canResend) {
      this.isResendingOTP = true;
      this.otpVerificationService.resendOTP(this.email.value).subscribe((res: any) => {
        this.startResendEnableTimer();
        this.isResendingOTP = false;
        this.snackbarService.show({ snackText: 'OTP has been sent again successfully' });
      }, (err: any) => {
        this.isResendingOTP = false;
        if (err?.error?.errorMessage)
          this.snackbarService.show({ snackText: err.error.errorMessage });
        else
          this.snackbarService.showSomethingWentWrong();
      });
    }
  }

  verifyOTP(otp: string) {
    return new Promise((resolve, reject) => {
      if (otp?.length) {
        this.isVerifying = true;
        this.otpVerificationService.verifyOTP(this.email.value,
          otp).subscribe((res: any) => {
            this.isVerifying = false;
            if (res?.status) {
              this.snackbarService.show({ snackText: 'Email has been verified successfully' });
              resolve();
            } else if (res?.status === false) {
              this.snackbarService.show({ snackText: 'Please check your OTP' });
              reject();
            } else if (res?.errorMessage) {
              this.isVerifying = false;
              this.snackbarService.show({ snackText: res.errorMessage });
              reject();
              this.startOver();
            } else {
              this.isVerifying = false;
              this.snackbarService.showSomethingWentWrong();
              reject();
              this.startOver();
            }
          }, (err: any) => {
            this.isVerifying = false;
            this.snackbarService.showSomethingWentWrong();
            this.startOver();
            reject();
          });
      } else {
        this.snackbarService.showSomethingWentWrong();
        this.startOver();
        reject();
      }
    });
  }

  hasLoginErrors() {
    return !!this.loginError;
  }

  getLoginError() {
    return this.loginError;
  }

  private isValidForm() {
    let isValid = !!this.emailError || !!this.passError || !!this.usernameError;
    return !isValid;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
    this.showHideIcon = this.showPassword ? this.showIcon : this.hideIcon;
    let passField: TextField = this.passwordField.nativeElement;
    passField.secure = !passField.secure;
  }

  signUpSuccess(res: LoginResponse) {
    this.snackbarService.show({ snackText: "Your account has been created successfully" });
    this.routerExtensions.navigate(['/', GlobalConstants.feedPath]);
    // { state: { communitySuggestion: res.communitySuggestion ? true : false } });
  }

  redirectToSignIn() {
    this.routerExtensions.navigate(['/', GlobalConstants.login],
      { clearHistory: true });
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  forgotPassword() {
    this.routerExtensions.navigate(['/', GlobalConstants.forgotPassword]);
  }
}