import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { TextField } from '@nativescript/core';
import { UtilityService } from '~/services/utility.service';

@Component({
  selector: 'qn-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  otp = [];
  otpLength: number = 6;
  inputList: number[] = Array(this.otpLength).fill(0);
  textFields = [];
  hasError: boolean = false;
  textFieldControls = new FormArray([]);
  textBoxWidth: number = 40;

  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.inputList.map((i, j) => {
      this.textFieldControls[j] = new FormControl('');
    });
  }

  isTablet() {
    return this.utilityService.isTablet();
  }

  getTextBoxWidth(): number {
    if (this.isTablet()) {
      return this.utilityService.getTabletRelavant(this.textBoxWidth);
    }
    return this.textBoxWidth;
  }

  getTextBoxHeight(): number {
    let multiplier = 1.3;
    if (this.isTablet()) {
      return this.utilityService.getTabletRelavant(this.textBoxWidth * multiplier);
    }
    return this.textBoxWidth * multiplier;
  }

  onLoaded(args) {
    let textField = <TextField>args.object;
    this.textFields.push(textField);
  }

  onChangeText(argstf, index): void {
    let value = (<TextField>argstf.object).text;
    if (value.length) {
      if (index < this.textFields.length - 1) {
        this.textFields[index + 1].focus();
      }
      if (index === this.textFields.length - 1) {
        // this.textFields[index].blur();
      }
      this.otp[index] = value;
    }
    // else {
    //   if (index !== 0)
    //     this.textFields[index - 1].focus();
    // }
  }

  validateOTP(): boolean {
    return this.otp.length === this.otpLength;
  }

  getOTP(): string {
    return this.otp.join('');
  }
}