import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import * as bghttp from '@nativescript/background-http';
import { GridLayout, ImageSource, Page, StackLayout } from '@nativescript/core';
import * as platformModule from '@nativescript/core/platform';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { Point } from '@nativescript/core/ui/core/view';
import { ImageCropper } from 'nativescript-imagecropper';
import { ImagePickerOptions, Mediafilepicker } from 'nativescript-mediafilepicker';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommunitySuggestionGuideService } from '~/services/community-suggestion-guide.service';
import { CreateCommunityService } from '~/services/create-community.service';
import { QFileService } from '~/services/q-file.service';
import { SnackBarService } from '~/services/snackbar.service';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { Tag } from '~/shared/models/common.model';
import { Community } from '~/shared/models/community.model';
import { UserInterest } from '~/shared/models/user.model';
import { qColors } from '~/_variables';

enum USER_FOCUS {
  prestine, touched, dirty
}

@Component({
  selector: 'qn-create-community-page',
  templateUrl: './create-community-page.component.html',
  styleUrls: ['./create-community-page.component.scss']
})
export class CreateCommunityPageComponent implements OnInit, AfterViewInit {
  /**
   * Starts edit community
   */
  @Input() isEditing: boolean = false;
  @Input() communityToBeEdited: Community;
  @Output() onClose = new EventEmitter();
  /**
   * Ends edit community
   */
  createTitle: string = "Create Your Community";
  editTitle: string = "Edit Community";
  qColors = qColors;
  openView: boolean = false;
  defaultSrc: string = StaticMediaSrc.communityFile;
  showAvatarNotSet: boolean = false;
  src: any;
  communityDetailsForm: FormGroup;
  communityName = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]
  });
  communityDescription = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(200)
    ]
  });
  communityAvatarForm: FormGroup;
  avatar = new FormControl(null);
  communityTagsForm: FormGroup;
  communityTag = new FormControl('', Validators.pattern(/^[A-z0-9 ]*$/));
  tagsCount = new FormControl(0, {
    validators: [
      Validators.max(5),
      Validators.min(2)
    ]
  });
  tagList: Tag[] = [];
  nullError: boolean = false;
  bucketFullError: boolean = false;
  bucketEmptyError: boolean = false;
  tagMaxLengthError: boolean = false;
  tagExistsError: boolean = false;
  isFormDisabled = true;
  isCreatingCommunity: boolean = false;
  searchResults: UserInterest[];
  suggestedCommunityList: Community[];
  communityImage: ImageSource;
  container: any;

  header: StackLayout;
  headerPosition: Point;
  currentIndex: number = 0;
  stepTray = [];
  stepContainer: GridLayout;
  stepContent = [
    {
      title: 'Enter Community Details',
    },
    {
      title: 'Choose Community Avatar',
      canSkip: true
    },
    {
      title: 'Choose/Enter Community Tags',
      description: 'Add tags (up to 5) to allow users to search this community'
    }
  ];
  actionLock: boolean = false;
  tagViewContainer = {};
  communityAvatarPath: string;
  stepDetailsStackView: any;

  communityNameFocus: USER_FOCUS = USER_FOCUS.prestine;
  communityDescriptionFocus: USER_FOCUS = USER_FOCUS.prestine;
  communityTagInputFocus: USER_FOCUS = USER_FOCUS.prestine;

  communityNameField: any;
  communityDescriptionField: any;
  communityTagField: any;

  static FILE_EXTENSION = "jpeg";

  constructor(public fb: FormBuilder,
    public createCommunityService: CreateCommunityService,
    public snackBarService: SnackBarService,
    private qFileService: QFileService,
    private _communitySuggestionGuideService: CommunitySuggestionGuideService,
    public page: Page) {
  }

  ngOnInit(): void {
    this.communityDetailsForm = this.fb.group({
      communityName: this.communityName,
      communityDescription: this.communityDescription,
    });
    this.communityAvatarForm = this.fb.group({
      avatar: this.avatar
    })
    this.communityTagsForm = this.fb.group({
      communityTag: this.communityTag,
      tagsCount: this.tagsCount
    });
    this.communityTag.valueChanges
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .subscribe((queryField) => {
        if (!queryField || queryField.length < 1) {
          this.searchResults = [];
        } else {
          this._communitySuggestionGuideService.searchUserInterest(queryField)
            .subscribe((response: UserInterest[]) => {
              this.searchResults = response;
            })
        }
      });
    if (!this.page) {
      this.isEditing = false;
    }
    if (!this.isEditing) {
      this.header = this.page.getViewById('header');
      this.stepContainer = this.page.getViewById('form-container');

      let formStep1: any = this.page.getViewById('community-step-1');
      this.stepTray.push(formStep1);

      let formStep2: any = this.page.getViewById('community-step-2');
      formStep2.hide();
      this.stepTray.push(formStep2);

      let formStep3: any = this.page.getViewById('community-step-3');
      formStep3.hide();
      this.stepTray.push(formStep3);
    }
  }

  ngAfterViewInit(): void {
  }

  onStepDetailsLoaded(args): void {
    this.stepDetailsStackView = args.object;
  }

  // startOpeningAnimation(): void {
  //   this.openView = true;
  //   if (this.container) {
  //     this.onContainerAnimate();
  //   }
  // }

  onContainerLoaded(args) {
    this.container = args.object;
    this.container.hide();

    if (this.isEditing) {
      let gridView = this.container as GridLayout;
      this.header = gridView.getViewById('header');
      this.stepContainer = gridView.getViewById('form-container');

      let formStep1: any = gridView.getViewById('community-step-1');
      this.stepTray.push(formStep1);

      let formStep2: any = gridView.getViewById('community-step-2');
      formStep2.hide();
      this.stepTray.push(formStep2);

      let formStep3: any = gridView.getViewById('community-step-3');
      formStep3.hide();
      this.stepTray.push(formStep3);

      this.communityName.setValue(this.communityToBeEdited.communityName);
      this.communityDescription.setValue(this.communityToBeEdited.description);
    }

    this.container.animate({
      translate: { x: 0, y: platformModule.Screen.mainScreen.heightDIPs }
    }).then(() => {
      setTimeout(() => {
        this.focusStep(this.currentIndex, true);
      }, 2000);
      this.onContainerAnimate();
    });
  }

  onContainerAnimate() {
    this.container.show().then(() => {
      this.container.animate({
        translate: { x: 0, y: 0 },
        curve: new CubicBezierAnimationCurve(.64, .48, .16, 1.10)
      }, 1500);
    });
  }

  onCommunityNameFieldLoaded(args): void {
    this.communityNameField = args.object;
  }

  onCommunityDescriptionFieldLoaded(args): void {
    this.communityDescriptionField = args.object;
  }

  onCommunityTagFieldLoaded(args): void {
    this.communityTagField = args.object;
  }

  getStepTitle(): string {
    if (this.stepContent[this.currentIndex].hasOwnProperty('title')) {
      return this.stepContent[this.currentIndex].title;
    }
    return null;
  }

  getStepDescription(): string {
    if (this.stepContent[this.currentIndex].hasOwnProperty('description')) {
      return this.stepContent[this.currentIndex].description;
    }
    return null;
  }

  focusStep(index: number, force = false): void {
    if (this.currentIndex === index && !force) return;
    this.currentIndex = index;
    // console.log("focusStep", index);
    this.startBlinkingStepTitleAnimation();
    this.stepTray.forEach((formStep, formIndex: number) => {
      if (formIndex !== this.currentIndex) {
        this.hideStep(formStep);
      }
    });
    this.showStep(this.stepTray[this.currentIndex]);
  }

  startBlinkingStepTitleAnimation() {
    this.stepDetailsStackView.animate({
      opacity: 0.5,
      duration: 300
    }).then(() => {
      this.stepDetailsStackView.animate({
        opacity: 1,
        duration: 400
      })
    });
  }

  showStep(step: any) {
    step.show().then(() => {
      step.animate({
        translate: { x: 0, y: 0 },
        duration: 1000,
      }).then(() => {
        step.animate({
          scale: { x: 1, y: 1 },
          duration: 700
        });
      });
    });
  }

  hideStep(step: any) {
    step.animate({
      scale: { x: .85, y: .85 },
      duration: 700
    }).then(() => {
      step.animate({
        translate: { x: platformModule.Screen.mainScreen.widthDIPs, y: 0 },
        duration: 1000
      }).then(() => {
        step.hide();
      });
    });
  }

  backStep(): void {
    if (this.actionLock) return;
    this.acquireActionLock();
    setTimeout(() => {
      this.focusStep(this.currentIndex - 1);
      this.releaseActionLock();
    }, 600);
  }

  nextStep(): void {
    if (this.actionLock) return;
    this.acquireActionLock();
    setTimeout(() => {
      if (this.checkStepIsValid()) {
        this.focusStep(this.currentIndex + 1);
      }
      this.releaseActionLock();
    }, 600);
  }

  skipStep(): void {
    if (this.actionLock) return;
    this.acquireActionLock();
    setTimeout(() => {
      if (this.currentIndex == 1) {
        this.skipCommunityAvatar();
      }
      this.focusStep(this.currentIndex + 1);
      this.releaseActionLock();
    }, 600);
  }

  acquireActionLock(): void {
    this.actionLock = true;
  }

  releaseActionLock(): void {
    this.actionLock = false;
  }

  isBackStepAvailable(): boolean {
    return this.currentIndex - 1 >= 0;
  }

  isNextStepAvailable(): boolean {
    return this.currentIndex + 1 < this.stepTray.length;
  }

  isSkipStepAvailable(): boolean {
    return this.stepContent[this.currentIndex].hasOwnProperty('canSkip') &&
      this.stepContent[this.currentIndex].canSkip;
  }

  isFinalStep(): boolean {
    return this.currentIndex === this.stepContent.length - 1;
  }

  showErrorStatusOnFirstStep() {
    this.onCommunityNameFocus();
    this.onCommunityDescriptionFocus();
    this.communityDetailsForm.markAllAsTouched();
    if (!this.communityName.valid) {
      this.communityNameField.shake();
    }
    if (!this.communityDescription.valid) {
      this.communityDescriptionField.shake();
    }
  }

  checkStepIsValid(): boolean {
    if (this.currentIndex === 0) {
      if (this.communityDetailsForm.valid) {
        return true;
      } else {
        this.showErrorStatusOnFirstStep();
        // let vibrator = new Vibrate();
        // vibrator.vibrate(200);
        return false;
      }
    } else if (this.currentIndex === 1) {
      return this.checkCommunityAvatar();
    }
    return false;
  }

  onCommunityNameFocus(): void {
    this.communityNameFocus = USER_FOCUS.touched;
  }

  hasCommunityNameErrors(): boolean {
    return this.communityNameFocus === USER_FOCUS.touched &&
      !this.communityName.valid;
  }

  onCommunityDescriptionFocus(): void {
    this.communityDescriptionFocus = USER_FOCUS.touched;
  }

  hasCommunityDescriptionErrors(): boolean {
    return this.communityDescriptionFocus === USER_FOCUS.touched &&
      !this.communityDescription.valid;
  }

  onCommunityTagInputFocus(): void {
    this.communityTagInputFocus = USER_FOCUS.touched;
  }

  hasCommunityTagInputErrors(): boolean {
    // real time errors
    return (this.communityTagInputFocus === USER_FOCUS.touched ||
      this.communityTagInputFocus === USER_FOCUS.dirty) &&
      !this.communityTag.valid;
  }

  hasCommunityTagListErrors(): boolean {
    // on pressing the submit button
    return this.communityTagInputFocus === USER_FOCUS.dirty &&
      !this.tagsCount.valid;
  }

  isCommunityTagFormValid(): boolean {
    return this.communityTag.valid && this.tagsCount.valid;
  }

  onTapCommunityAvatar(args): void {
    let pictureOptions: ImagePickerOptions = {
      android: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 1,
        isNeedFolderList: true
      }, ios: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 1,
      }
    };

    let mediafilepicker = new Mediafilepicker();
    mediafilepicker.openImagePicker(pictureOptions);

    mediafilepicker.on("getFiles", (res) => {
      let results = res.object.get('results');
      console.dir(results);

      let keys = Object.keys(results);

      keys.forEach((key) => {
        if (results[key].type === 'image') {
          console.log("Image found!");
          if (results[key].file) {
            ImageSource.fromFile(results[key].file).then((imageSource) => {
              this.openImageCropper(imageSource);
            })
          }
        }
      });
    });

    // for iOS iCloud downloading status
    mediafilepicker.on("exportStatus", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on("error", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on("cancel", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });
  }

  openImageCropper(imageSource: ImageSource): void {
    var imageCropper = new ImageCropper();
    imageCropper.show(imageSource, {}, {
      setAspectRatioOptions: {
        defaultIndex: 0,
        aspectRatios: [
          {
            aspectRatioTitle: 'Community Avatar',
            aspectRatioX: 12,
            aspectRatioY: 4
          },
        ]
      }
    }).then((args) => {
      console.dir(args);
      if (args.image !== null) {
        this.communityImage = args.image;
        let timeStamp = Math.floor(new Date().getTime());
        this.communityAvatarPath = this.qFileService.createPostFile(String(timeStamp) + `.${CreateCommunityPageComponent.FILE_EXTENSION}`);
        if (CreateCommunityPageComponent.FILE_EXTENSION === 'jpeg') {
          imageSource.saveToFile(this.communityAvatarPath, "jpeg");
        } else {
          imageSource.saveToFile(this.communityAvatarPath, "png");
        }
      }
    }).catch(function (e) {
      console.dir(e);
    });
  }

  submit() {
    if (this.communityDetailsForm.valid
      && this.tagsCount.value < 5 && this.tagsCount.value >= 2) {
      this.isCreatingCommunity = true;
      let communityTags = "";
      this.tagList.forEach((tag: Tag, index: number) => {
        if (index == 0)
          communityTags += tag.value;
        else
          communityTags += "," + tag.value;
      });
      const formData = [];
      formData.push({ name: "communityName", value: this.communityName.value });
      formData.push({ name: "description", value: this.communityDescription.value });
      formData.push({ name: "communityTags", value: communityTags });
      if (this.communityAvatarPath != null) {
        formData.push({ name: 'avatarFile', filename: this.communityAvatarPath });
      }
      console.log("formData", formData);
      let task: bghttp.Task = this.createCommunityService.createCommunity(formData);
      task.on("progress", (e) => {
        // this.uploading = true;
        // this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
        // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
      });

      task.on("error", (error) => {
        this.errorHandler(error);
      });

      task.on("complete", (e: any) => {
        // console.log("completed", e);
      });

      task.on("responded", (e) => {
        // console.log("responded", JSON.parse(e.data));
        try {
          this.onCommunityCreated(JSON.parse(e.data));
        } catch (e) {
          this.snackBarService.showSomethingWentWrong();
        }
      });
    } else if (!this.isCommunityTagFormValid()) {
      this.communityTagInputFocus = USER_FOCUS.dirty;
      if (!this.communityTag.valid) {
        this.communityTagField.shake();
      }
    }
  }

  modify(): void {
    if (this.communityDetailsForm.valid) {
      this.isCreatingCommunity = true;
      this.createCommunityService.updateDescription(this.communityDescription.value,
        this.communityToBeEdited.communityId).subscribe((community: Community) => {
          // console.log("community", community);
          this.isCreatingCommunity = false;
          this.onClose.emit(community);
          this.snackBarService.show({ snackText: "Community description has been updated!" });
        }, error => {
          this.close();
          this.snackBarService.showHTTPError(error);
        });
    } else {
      this.showErrorStatusOnFirstStep();
    }
  }

  errorHandler(error): void {
    // console.log("error", error);
    this.isCreatingCommunity = false;
    this.snackBarService.show({ snackText: "Community name might exists or something went wrong." });
  }

  onCommunityCreated(community: Community): void {
    this.isCreatingCommunity = false;
    this.resetForm();
    // this.routerExtensions.navigate(["/", GlobalConstants.communityPath, community.slug]);
    this.snackBarService.show({ snackText: 'community created successfully' });
  }

  skipCommunityAvatar() {
    this.showAvatarNotSet = false;
    this.communityImage = null;
    this.communityAvatarPath = null;
    this.avatar.setValue(null);
  }

  resetForm(): void {
    this.currentIndex = 0;

    this.communityNameFocus = USER_FOCUS.prestine;
    this.communityDescriptionFocus = USER_FOCUS.prestine;
    this.communityTagInputFocus = USER_FOCUS.prestine;

    this.communityName.setValue('');
    this.communityDescription.setValue('');
    this.communityTag.setValue('');

    this.resetTagErrors();
    // resets community avatar
    this.skipCommunityAvatar();
  }

  checkCommunityAvatar(): boolean {
    if (!this.communityImage) {
      this.showAvatarNotSet = true;
      return false;
    } else {
      this.showAvatarNotSet = false;
      return true;
    }
  }

  nextCommunityTags() {
    this.resetTagErrors();
    if (this.tagList.length < 2) {
      this.nullError = true;
    } else {
      this.submit();
    }
  }

  resetTagErrors() {
    this.nullError = false;
    this.tagExistsError = false;
    this.bucketFullError = false;
    this.bucketEmptyError = false;
    this.tagMaxLengthError = false;
  }

  hasTagInTagList(value: string) {
    let doesNotHave = false;
    this.tagList.forEach((tag: Tag) => {
      if (tag.value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
        doesNotHave = true;
      }
    });
    return doesNotHave;
  }

  addTagToBucket(value: string, isInput: boolean) {
    this.resetTagErrors();
    if (!(value && value.length > 0)) return;
    value = value.trim();
    if (this.hasTagInTagList(value)) {
      this.tagExistsError = true;
      return;
    }
    if (this.tagList.length >= 5) {
      this.bucketFullError = true;
    }
    else {
      this.searchResults = [];
      if (value.length > 30 && isInput) {
        this.tagMaxLengthError = true;
      } else if (this.communityTag.valid || !isInput) {
        this.tagsCount.setValue(Number(this.tagsCount.value) + 1);
        if (isInput) {
          this.communityTag.setValue("");
        }
        this.tagList.push(new Tag(value.toLocaleUpperCase()));
      }
    }
  }

  removeTagFromBucket(index: number) {
    if (this.tagList.length <= 0) {
      this.bucketEmptyError = true;
    } else {
      let stack: any = <StackLayout>this.page.getViewById(this.getStackId(index));
      if (stack) {
        stack.animate({
          scale: { x: .5, y: .5 },
          duration: 600,
        }).then(() => {
          stack.fadeOut(300).then(() => {
            this.removeTag(index);
          });
        });
      } else {
        this.removeTag(index);
      }
    }
  }

  removeTag(index: number): void {
    this.tagsCount.setValue(Number(this.tagsCount.value) - 1);
    if (index != -1)
      this.tagList.splice(index, 1);
    // this.tagList = this.tagList.filter(function (val, index, arr) { return val.value != tag.value; });
  }

  getStackId(index: number) {
    return 'community-tag-' + index;
  }

  onCommunityAvatarFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  close(): void {
    this.onClose.emit();
  }
}
