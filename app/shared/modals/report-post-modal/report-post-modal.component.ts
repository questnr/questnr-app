import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { CheckBox } from '@nstudio/nativescript-checkbox';
import { PostReportService } from '~/services/post-report.service';
import { SnackBarService } from '~/services/snackbar.service';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-report-post-modal',
  templateUrl: './report-post-modal.component.html',
  styleUrls: ['./report-post-modal.component.scss']
})
export class ReportPostModalComponent implements OnInit, AfterViewInit {
  reportOptions: string[] = [
    'spam',
    'inappropriate',
    'other'
  ];
  formGroup: FormGroup;
  reportText = new FormControl('');
  postActionId: number;
  qColors = qColors;
  selectedOptionIndex: number;
  // @ViewChildren(CheckBox) checkBoxList: QueryList<CheckBox>;
  checkBoxList = {};
  errorMessage: string;

  constructor(private params: ModalDialogParams,
    private fb: FormBuilder,
    private postReportService: PostReportService,
    private snackBarService: SnackBarService) {
    this.formGroup = this.fb.group({
      reportText: this.reportText
    });
  }

  ngOnInit() {
    this.postActionId = this.params.context.postActionId;
  }

  ngAfterViewInit() {
    // console.log("checkBoxList", this.checkBoxList.length);
  }

  onCheckboxLoaded(args, index) {
    this.checkBoxList[index] = args.object as CheckBox;
  }

  onSelectOption(args, optionIndex: number): void {
    let value = args.value;
    let keys = Object.keys(this.checkBoxList);
    keys.forEach((key) => {
      if (this.checkBoxList[key].checked
        && value
        && Number(key) !== optionIndex) {
        this.checkBoxList[key].toggle();
      }
    });
  }

  getSelectedOption(): string {
    let selectedOption;
    let keys = Object.keys(this.checkBoxList);
    keys.forEach((key) => {
      if (this.checkBoxList[key].checked) {
        selectedOption = this.reportOptions[key];
      }
    });
    return selectedOption;
  }

  reportThisPost() {
    let selectedOption = this.getSelectedOption();
    console.log("selectedOption", selectedOption);
    if (this.formGroup.valid && selectedOption) {
      this.errorMessage = "";
      this.postReportService.reportPost(this.postActionId,
        selectedOption,
        this.formGroup.get('reportText').value).subscribe((res: any) => {
          this.snackBarService.show({ snackText: "Post has been reported!" });
          this.close();
        }, (err: any) => {
          if (err && err.errorMessage) {
            this.snackBarService.show({ snackText: err.errorMessage });
          } else {
            this.snackBarService.showSomethingWentWrong();
          }
          this.close();
        });
    } else {
      this.errorMessage = "Please select one of the options";
    }
  }

  close(): void {
    this.params.closeCallback();
  }
}
