import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'app/environments/environment';

@Injectable()
export class OTPVerificationService {
  baseUrl = environment.baseUrl;
  constructor(public http: HttpClient) { }

  sendOTP(email: string) {
    if (!email) return of();
    return this.http.post(this.baseUrl + 'send-otp', { email });
  }

  resendOTP(email: string) {
    if (!email) return of();
    return this.http.post(this.baseUrl + 'resend-otp', { email });
  }

  verifyOTP(email: string, otp) {
    if (!email || !otp) return of();
    return this.http.post(this.baseUrl + 'verify-otp', { email, otp });
  }
}
