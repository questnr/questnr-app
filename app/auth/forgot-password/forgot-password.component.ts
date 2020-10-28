import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from '@nativescript/angular';
import { ForgotPasswordService } from '~/services/forgot-password.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UtilityService } from '~/services/utility.service';
import { GlobalConstants, REGEX } from '~/shared/constants';

@Component({
  selector: 'qn-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss',
    '../signup/signup.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  group: FormGroup;
  emailError: string = '';
  email = new FormControl('', { validators: [Validators.required, Validators.pattern(REGEX.EMAIL)] });
  isLoading: boolean = false;
  emailHasFocus: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private utilityService: UtilityService,
    private snackbarService: SnackBarService,
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    this.group = this.formBuilder.group({
      email: this.email
    });
  }

  getEmailError() {
    return this.emailError;
  }

  onEmailFocus() {
    this.emailHasFocus = true;
  }

  public hasEmailErrors() {
    return this.emailHasFocus === true &&
      !!this.validateEmail();
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

  isSubmitEnabled(): boolean {
    return !this.isLoading && this.email.valid;
  }

  sendResetLink() {
    if (this.group.valid) {
      this.isLoading = true;
      this.forgotPasswordService.sendResetLink(this.group.get("email").value).subscribe((res: any) => {
        this.isLoading = false;
        if (res?.success) {
          this.snackbarService.show({ snackText: 'Please check your email address for password reset link.' });
        }
        else if (res?.errorMessage) {
          this.snackbarService.show({ snackText: res.errorMessage });
        }
      });
    }
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  redirectToLoginPage() {
    this.routerExtensions.navigate(["/", GlobalConstants.login],
      { clearHistory: true });
  }
}
