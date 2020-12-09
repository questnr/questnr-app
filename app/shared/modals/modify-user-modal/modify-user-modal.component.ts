import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import { ModalDialogParams } from '@nativescript/angular';
import { ImageSource, Page } from '@nativescript/core';
import { ImagePickerOptions, Mediafilepicker } from 'nativescript-mediafilepicker';
import { Menu } from 'nativescript-menu';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { ImageCropService } from '~/services/image-crop.service';
import { SnackBarService } from '~/services/snackbar.service';
import { UserProfilePageService } from '~/services/user-profile-page.service';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { LoginResponse } from '~/shared/models/login.model';
import { User } from '~/shared/models/user.model';
import { qColors } from '~/_variables';
import * as bghttp from '@nativescript/background-http';
import { AvatarDTO } from '~/shared/models/common.model';
import { UserMenuService } from '~/services/user-menu.service';

enum USER_FOCUS {
  prestine, touched, dirty
}

enum InputField {
  username = "username",
  firstName = "firstName",
  lastName = "lastName",
  dob = "dob",
  bio = "bio"
}

@Component({
  selector: 'qn-modify-user-modal',
  templateUrl: './modify-user-modal.component.html',
  styleUrls: ['./modify-user-modal.component.scss']
})
export class ModifyUserModalComponent implements OnInit {
  page: Page;
  inputFieldsClass = InputField;
  qColors = qColors;
  container: any;
  user: User;
  defaultBanner = StaticMediaSrc.communityFile;
  defaultSrc = StaticMediaSrc.userFile;
  userAvatarPath: string;
  userBannerPath: string;
  hasAvatarBeenModified: boolean = false;
  hasBannerBeenModified: boolean = false;

  inputFieldData: any = {
    [InputField.username]: { focus: USER_FOCUS.prestine },
    [InputField.firstName]: { focus: USER_FOCUS.prestine },
    [InputField.lastName]: { focus: USER_FOCUS.prestine },
    [InputField.dob]: { focus: USER_FOCUS.prestine },
    [InputField.bio]: { focus: USER_FOCUS.prestine },
  }

  userFormGroup: FormGroup;
  firstName = new FormControl('',
    [
      Validators.required,
      Validators.pattern(/^[\S]*$/),
      Validators.minLength(3),
      Validators.maxLength(25)
    ]);
  lastName = new FormControl('',
    [
      Validators.required,
      Validators.pattern(/^[\S]*$/),
      Validators.minLength(3),
      Validators.maxLength(25)
    ]);
  username = new FormControl('',
    {
      validators: [
        Validators.required,
        Validators.pattern(/^[_A-z0-9]*$/),
        Validators.minLength(3),
        Validators.maxLength(32),
      ]
    });
  dob = new FormControl('', Validators.required);
  bio = new FormControl('', Validators.maxLength(400));
  maxDate: Date;
  minDate: Date;
  day;
  month;
  year;
  hasFormErrors: boolean = false;
  isLoading: boolean = false;
  avatarResponse: AvatarDTO;
  bannerResponse: AvatarDTO;

  constructor(public params: ModalDialogParams,
    private userProfilePageService: UserProfilePageService,
    public fb: FormBuilder,
    private imageCropService: ImageCropService,
    private commonService: CommonService,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private userMenuService: UserMenuService) {
    this.user = this.params.context.user;
    if (!this.user) {
      this.onClose();
    }
    this.userAvatarPath = this.user.avatarDTO.avatarLink;
    this.userBannerPath = this.user.banner.avatarLink;

    this.username.setValue(this.user.username);
    this.firstName.setValue(this.user.firstName);
    this.lastName.setValue(this.user.lastName);
    if (this.user.bio) {
      this.bio.setValue(this.user.bio);
    }
    if (this.user.dob) {
      this.dob.setValue(new Date(this.user.dob));
    }

    this.userFormGroup = this.fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      dob: this.dob,
      bio: this.bio
    });
    this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - GlobalConstants.signUpAgeRestriction));
    this.minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 99));
    this.day = this.maxDate.getDay();
    this.month = this.maxDate.getMonth() + 1;
    this.year = this.maxDate.getFullYear();
  }

  ngOnInit() {
  }

  onPageLoaded(args): void {
    this.page = args.object as Page;
  }

  onContainerLoaded(args): void {
    this.container = args.object;
  }

  onTapUserAvatar(args): void {
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

      let keys = Object.keys(results);

      keys.forEach((key) => {
        if (results[key].type === 'image') {
          if (results[key].file) {
            ImageSource.fromFile(results[key].file).then((imageSource) => {
              this.imageCropService.openUserAvatarImageCropper(imageSource).then((croppedImg) => {
                this.userAvatarPath = croppedImg.path;
                this.hasAvatarBeenModified = true;
              });
            })
          }
        }
      });
    });
  }

  onTapUserBanner(args): void {
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

      let keys = Object.keys(results);

      keys.forEach((key) => {
        if (results[key].type === 'image') {
          if (results[key].file) {
            ImageSource.fromFile(results[key].file).then((imageSource) => {
              this.imageCropService.openUserBannerImageCropper(imageSource).then((croppedImg) => {
                this.userBannerPath = croppedImg.path;
                this.hasBannerBeenModified = true;
              });
            })
          }
        }
      });
    });
  }

  onInputFieldLoaded(args, inputField: InputField): void {
    this.inputFieldData[inputField].view = args.object;
  }

  onInputFocus(inputField: InputField): void {
    this.inputFieldData[inputField].focus = USER_FOCUS.touched;
  }

  hasInputErrors(inputField: InputField): boolean {
    return this.getInputFocus(inputField) === USER_FOCUS.touched &&
      this.userFormGroup.get(inputField).invalid;
  }

  getInputFocus(inputField: InputField): USER_FOCUS {
    return this.inputFieldData[inputField].focus;
  }

  // user banner
  onUserBannerFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultBanner;
  }

  // user avatar
  onUserAvatarFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  onOpenUserImageMenu(args, isAvatar: boolean = true): void {
    let viewId: string = isAvatar ? 'user-avatar-menu' : 'user-banner-menu';
    let actions = ["Reset"];
    if (isAvatar && this.user?.avatarDTO?.avatarLink) {
      actions.push("Remove");
    } else if (this.user?.banner?.avatarLink) {
      actions.push("Remove");
    }
    Menu.popup({
      view: this.page.getViewById(viewId),
      actions: actions
    })
      .then(action => {
        if (action.id === 0) {
          if (isAvatar) {
            this.userAvatarPath = this.user.avatarDTO.avatarLink;
            this.hasAvatarBeenModified = false;
          } else {
            this.userBannerPath = this.user.banner.avatarLink;
            this.hasBannerBeenModified = false;
          }
        } else if (action.id === 1) {
          if (isAvatar) {
            this.userAvatarPath = null;
          } else {
            this.userBannerPath = null;
          }
        }
      })
      .catch(console.log);
  }

  onUpdate(args): void {
    if (this.userFormGroup.valid) {
      this.isLoading = true;
      if (this.hasAvatarBeenModified && this.userAvatarPath) {
        const formData = [];
        formData.push({ name: 'file', filename: this.userAvatarPath });
        let task: bghttp.Task = this.userProfilePageService.updateUserAvatar(formData);
        task.on("progress", (e) => {
          // this.uploading = true;
          // this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
          // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
        });

        task.on("error", (error) => {
        });

        task.on("complete", (e: any) => {
          // console.log("completed", e);
        });

        task.on("responded", (e) => {
          this.userMenuService.onRequestUserAvatarRefresh(JSON.parse(e.data) as AvatarDTO);
          this.avatarResponse = JSON.parse(e.data);
          // console.log("responded", JSON.parse(e.data));
          try {

          } catch (e) {
          }
        });
      }
      if (this.hasBannerBeenModified && this.userBannerPath) {
        const formData = [];
        formData.push({ name: 'file', filename: this.userBannerPath });
        let task: bghttp.Task = this.userProfilePageService.updateUserBanner(formData);
        task.on("progress", (e) => {
          // this.uploading = true;
          // this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
          // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
        });

        task.on("error", (error) => {
        });

        task.on("complete", (e: any) => {
          // console.log("completed", e);
        });

        task.on("responded", (e) => {
          this.userMenuService.onRequestUserBannerRefresh(JSON.parse(e.data) as AvatarDTO);
          // console.log("responded", JSON.parse(e.data));
          this.bannerResponse = JSON.parse(e.data);
          try {

          } catch (e) {
          }
        });
      }
      const formObj = { ...this.userFormGroup.value, dob: this.commonService.getDateFromNumber(this.userFormGroup.get("dob").value) };
      this.userProfilePageService.updateUser(formObj).subscribe((loginResponse: LoginResponse) => {
        this.isLoading = false;
        if (loginResponse.accessToken && loginResponse.loginSuccess) {
          this.params.closeCallback({ userProfileData: formObj });
          this.snackBarService.show({ snackText: 'Profile details updated successfully' });
          this.authService.setUserLoginData(loginResponse);
        } else {
          this.onClose();
          this.snackBarService.showSomethingWentWrong();
        }
      }, error => {
        this.onClose();
        this.snackBarService.showHTTPError(error);
      });
    } else {
      let inputKeys = Object.keys(this.inputFieldData);
      inputKeys.forEach((inputKey) => {
        this.onInputFocus(inputKey as InputField);
        if (this.userFormGroup.get(inputKey).invalid) {
          this.inputFieldData[inputKey].view.shake();
        }
      });
      this.userFormGroup.markAllAsTouched();
    }
  }

  onClose(): void {
    this.params.closeCallback();
  }
}
