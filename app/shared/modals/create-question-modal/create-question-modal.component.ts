import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import { Page, TextView } from '@nativescript/core';
import { AskQuestionService } from '~/services/ask-question.service';
import { SnackBarService } from '~/services/snackbar.service';
import { Post } from '~/shared/models/post-action.model';

@Component({
  selector: 'qn-create-question-modal',
  templateUrl: './create-question-modal.component.html',
  styleUrls: ['./create-question-modal.component.scss']
})
export class CreateQuestionModalComponent implements OnInit {
  isLoading: boolean = false;
  uploading: boolean = false;
  uploadProgress: number = 0;
  questionTextViewRef: TextView;
  questionForm: FormGroup;
  questionText: FormControl = new FormControl('',
    [
      Validators.required,
      Validators.minLength(3)
    ]);
  agreeText = new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25)
    ]);
  disagreeText = new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25)
    ]);

  constructor(private params: ModalDialogParams,
    private fb: FormBuilder,
    private askQuestionService: AskQuestionService,
    private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.questionForm = this.fb.group({
      questionText: this.questionText,
      agreeText: this.agreeText,
      disagreeText: this.disagreeText
    });
  }

  onPageLoaded(args): void {
    let page = args.object as Page;
  }

  onQuestionTextViewLoaded(args) {
    this.questionTextViewRef = args.object as TextView;
    this.questionTextViewRef.focus();
  }


  isQuestionInvalid(): boolean {
    return !this.questionForm.valid;
  }

  postQuestion() {
    this.isLoading = true;
    const agreeText = this.agreeText.value;
    const disagreeText = this.disagreeText.value;
    const questionText = this.questionText.value;
    const questionObj = {
      agreeText, disagreeText, text: questionText
    };
    if (this.params.context.isCommunityQuestion) {
      this.askQuestionService.postQuestionInCommunity(this.params.context.communityId, questionObj).subscribe((post: Post) => {
        if (post) {
          this.isLoading = false;
          this.uploadCompleted(post);
        } else {
          this.errorHandler(null);
        }
      }, (error) => {
        this.errorHandler(error);
      });
    }
    else {
      this.askQuestionService.postQuestion(questionObj).subscribe((post: Post) => {
        if (post) {
          this.isLoading = false;
          this.uploadCompleted(post);
        } else {
          this.errorHandler(null);
        }
      }, (error) => {
        this.errorHandler(error);
      });
    }
  }

  errorHandler(error): void {
    // console.log("errorHandler", error);
    this.close();
    if (error?.error?.errorMessage) {
      this.snackBarService.show({ snackText: error?.error?.errorMessage });
    } else {
      this.snackBarService.showSomethingWentWrong();
    }
  }

  uploadCompleted(createdPost) {
    this.reset();
    this.snackBarService.show({ snackText: "Your question has been created!" });
    this.params.closeCallback(createdPost);
  }

  reset(): void {
    this.questionText.setValue('');
    this.agreeText.setValue('');
    this.disagreeText.setValue('');
  }

  close(): void {
    this.params.closeCallback();
  }
}
