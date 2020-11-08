import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalDialogParams } from '@nativescript/angular';
import * as bghttp from '@nativescript/background-http';
import { ObservableArray, TextView } from '@nativescript/core';
import { ImagePickerOptions, Mediafilepicker } from 'nativescript-mediafilepicker';
import { VideoPickerOptions } from 'nativescript-mediafilepicker/mediafilepicker.common';
import { ListViewEventData, RadListView } from 'nativescript-ui-listview';
import { environment } from '~/environments/environment';
import { AuthService } from '~/services/auth.service';
import { CommonService } from '~/services/common.service';
import { FeedsService } from '~/services/feeds.service';
import { SnackBarService } from '~/services/snackbar.service';
import { ProfileIconComponent } from '~/shared/containers/profile-icon/profile-icon.component';

class MediaSrc {
  public type: string;
  public src: string;
  constructor(type: string, src: string) {
    this.type = type;
    this.src = src;
  }
}

@Component({
  selector: 'qn-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  animations: [
    trigger('expand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreatePostComponent implements OnInit {
  feedTextViewRef: TextView;
  @ViewChild('fileInput') fileInput: ElementRef;

  // @ViewChild('floatingSuggestionBoxRef')
  // set floatingSuggestionBoxRef(element: FloatingSuggestionBoxComponent) {
  //   setTimeout(() => {
  //     this.floatingSuggestionBoxElement = element;
  //     this.hashTagService.registerFloatingSuggestionBoxElement(this.floatingSuggestionBoxElement);
  //   }, 0);
  // }

  // floatingSuggestionBoxElement: FloatingSuggestionBoxComponent;
  // iFramelyData: IFramelyData;
  isLoading = false;
  uploading = false;
  uploadProgress = 0;
  text = new FormControl();
  blogTitle = new FormControl('',
    {
      validators: [
        Validators.required,
        Validators.maxLength(200),
      ]
    });
  richText: string;
  editorText: string;
  addedMediaSrc = new ObservableArray<MediaSrc>();
  // @Output() postData = new EventEmitter();
  apiUrl: any;
  isMediaEnabled = false;
  textAreaInput: string;
  isHashOn: boolean = false;
  isBlogEditor: boolean = false;
  isFetchingPostData: boolean = false;
  // quill: Quill;
  quillLength: number;
  @Input() editing: any;
  postEditorName: string = "Post";
  mobileView: boolean = false;
  profileIconRef: ProfileIconComponent;
  @ViewChild("profileIcon")
  set profileIcon(profileIconRef: ProfileIconComponent) {
    this.profileIconRef = profileIconRef;
  }
  // _selectedItems: MediaSrc[] = [];
  _selectedItemIndexList: number[] = [];
  maxMediaLimit: number = 10;
  attachedMediaListView: RadListView;

  constructor(private params: ModalDialogParams,
    public authService: AuthService,
    private feedsService: FeedsService,
    private commonService: CommonService,
    private snackBarService: SnackBarService) {

    // To test progress bar
    // setTimeout(() => {
    //   this.isLoading = true;
    //   this.uploading = true;
    //   this.uploadProgress = 0;
    // }, 1000);
    // let process = setInterval(() => {
    //   this.uploadProgress += 20;
    //   if (this.uploadProgress >= 100) {
    //     this.isLoading = false;
    //     this.uploading = false;
    //     this.uploadProgress = 0;
    //     clearInterval(process);
    //   }
    // }, 1200);
  }

  ngOnInit() { }

  switchEditor(isBlogEditor) {
    this.isBlogEditor = isBlogEditor;
    if (this.isBlogEditor) {
      this.postEditorName = "Blog";
    }
    else {
      this.postEditorName = "Post";
      setTimeout(() => {
        this.feedTextViewRef.focus();
      }, 10);
    }
  }

  onFeedTextViewLoaded(args) {
    this.feedTextViewRef = args.object as TextView;
    this.feedTextViewRef.focus();
  }

  onTextChange(args) {

  }

  isPostInvalid() {
    if ((!this.isBlogEditor && (this.text.value || this.addedMediaSrc.length))
      || (this.isBlogEditor && this.quillLength > 1)) {
      return false;
    }
    return true;
  }

  validateBlogTitle(): boolean {
    if (this.isBlogEditor && this.blogTitle.invalid) {
      this.blogTitle.markAllAsTouched();
      return false;
    }
    return true;
  }

  postFeed() {
    if ((this.text.value && !this.isBlogEditor) ||
      (this.richText && this.isBlogEditor) || this.addedMediaSrc.length) {
      // if (this.data.editing) {
      // Since blogs can not be edited
      // if (!this.isPostInvalid() && !this.isBlogEditor) {
      //   // if ((this.isPostInvalid()) || (this.validateBlogTitle())) {
      //   this.isLoading = true;
      //   this.service.editPost(this.isBlogEditor ? this.richText : this.text.value, this.blogTitle.value, this.data.feed.postActionId).subscribe((res: any) => {
      //     this.uploading = true;
      //     this.closeDialog(res);
      //     // console.log('close', res);
      //     this.snackBar.open('Post Edited Successfully', 'close', { duration: 5000 });
      //   });
      // }
      // } else {
      const formData = [];
      formData.push({ name: "postEditorType", value: this.isBlogEditor ? "blog" : "normal" });
      if (this.isBlogEditor) {
        formData.push({ name: 'text', value: this.richText });
        formData.push({ name: 'blogTitle', value: this.blogTitle.value });
      } else {
        formData.push({ name: 'text', value: this.text.value?.length ? this.text.value : '' });
      }
      if (this.addedMediaSrc.length) {
        this.addedMediaSrc.forEach((mediaSrc: MediaSrc) => {
          let file = mediaSrc.src;
          var name = file.substr(file.lastIndexOf("/") + 1);
          formData.push({ name: 'files', filename: file });
        });
      }
      // Check if the blog title is valid
      if ((!this.isPostInvalid()) && (this.validateBlogTitle())) {
        this.isLoading = true;
        if (this.params.context?.isCommunityPost && this.params.context?.community?.communityId != null) {
          this.apiUrl = `${environment.baseUrl}user/community/${this.params.context.community.communityId}/posts`;
        } else {
          this.apiUrl = `${environment.baseUrl}user/posts`;
        }
        var request: bghttp.Request = {
          url: this.apiUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Authorization": 'Bearer ' + this.authService.getAccessToken()
          },
          description: "Uploading "
        };
        let session = bghttp.session("image-upload-1");
        let task: bghttp.Task = session.multipartUpload(formData, request);
        task.on("progress", (e) => {
          this.uploading = true;
          this.uploadProgress = Math.round(e.currentBytes / e.totalBytes * 100);
          // console.log("uploadProgress", this.uploadProgress, e.currentBytes, e.totalBytes);
        });
        task.on("error", (error) => {
          // @todo: show error message from server if any
          this.isLoading = false;
          this.uploading = false;
          this.uploadProgress = 0;
          this.snackBarService.showSomethingWentWrong();
        });

        task.on("complete", (e: any) => {
          // console.log("completed", e);
        });

        task.on("responded", (e) => {
          // console.log("responded", e);
          this.uploadCompleted(e.data);
        });
        // task.on("cancelled", cancelledHandler);
      }
      // }
    }
  }

  uploadCompleted(createdPost) {
    this.reset();
    this.params.closeCallback(createdPost);
  }

  attachMedia(): void {
    let pictureOptions: ImagePickerOptions = {
      android: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 10,
        isNeedFolderList: true
      }, ios: {
        isCaptureMood: false,
        isNeedCamera: true,
        maxNumberFiles: 10
      }
    };

    // let allowedVideoQualities = [];

    // if (app.ios) {
    //   allowedVideoQualities = [AVCaptureSessionPreset1920x1080, AVCaptureSessionPresetHigh];  // get more from here: https://developer.apple.com/documentation/avfoundation/avcapturesessionpreset?language=objc
    // }

    let videoOptions: VideoPickerOptions = {
      android: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 2,
        isNeedFolderList: true,
        maxDuration: 20,

      },
      ios: {
        isCaptureMood: false, // if true then camera will open directly.
        videoMaximumDuration: 10,
        // allowedVideoQualities: allowedVideoQualities
      }
    };

    let mediafilepicker = new Mediafilepicker();
    mediafilepicker.openImagePicker(pictureOptions);
    // mediafilepicker.openVideoPicker(videoOptions);

    mediafilepicker.on("getFiles", (res) => {
      let results = res.object.get('results');
      // console.dir(results);

      let keys = Object.keys(results);

      keys.forEach((key) => {
        if (results[key].type === 'image') {
          // console.log("Image found!");
          if (results[key].file) {
            this.addedMediaSrc.push({ type: results[key].type, src: results[key].file });
          }
        }
      })
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

  reset() {
    this.isLoading = false;
    this.uploading = false;
    this.isMediaEnabled = false;
    this.uploadProgress = 0;
    this.text.setValue('');
    // this.iFramelyData = null;
    this.isBlogEditor = false;
    this._selectedItemIndexList = [];
    this.addedMediaSrc = new ObservableArray<MediaSrc>();
    this.richText = '';
    // if (this.quill) {
    //   this.quill.root.innerHTML = "";
    // }
  }

  onAttachedMediaListViewLoaded(args) {
    this.attachedMediaListView = args.object as RadListView;
  }

  templateSelector(item, index, items) {
    return item.type;
  }

  public onItemSelected(args: ListViewEventData) {
    // const listview = args.object as RadListView;
    // this._selectedItems = listview.getSelectedItems() as Array<MediaSrc>;
    // const selectedItem = this.addedMediaSrc.getItem(args.index);
    // console.log("Item selected: " + (selectedItem && selectedItem.src));
    this._selectedItemIndexList.push(args.index);
  }

  public onItemDeselected(args: ListViewEventData) {
    // const listview = args.object as RadListView;
    // this._selectedItems = listview.getSelectedItems() as Array<MediaSrc>;
    // console.log("Deselected", this._selectedItems.length);
    // const selectedItem = this.addedMediaSrc.getItem(args.index);
    // console.log("Item deselected: " + (selectedItem && selectedItem.src));
    this._selectedItemIndexList = this._selectedItemIndexList.filter((itemIndex: number) => {
      return itemIndex != args.index;
    });
  }

  onRemoveMedia() {
    this._selectedItemIndexList.forEach((selectedItem: number) => {
      this.addedMediaSrc.splice(selectedItem, 1);
    });
    this._selectedItemIndexList = [];
  }

  close() {
    this.params.closeCallback();
  }
}