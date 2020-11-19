import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinalEventData } from '@nativescript-community/ui-image';
import { getViewById, Label, ObservableArray, View } from '@nativescript/core';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { ListViewEventData, RadListView } from 'nativescript-ui-listview';
import { CommonService } from '~/services/common.service';
import { MediaSrc } from '~/shared/models/common.model';
import { PostMedia, ResourceType } from '~/shared/models/post-action.model';

@Component({
  selector: 'qn-attached-file-list',
  templateUrl: './attached-file-list.component.html',
  styleUrls: ['./attached-file-list.component.scss']
})
export class AttachedFileListComponent implements OnInit {
  @Input() elementHeight: number = 70;
  @Input() attachedFileLinkList: PostMedia[]
  attachedFileList = new ObservableArray<MediaSrc>();
  @Output() downloadError = new EventEmitter();
  @Output() finalizedAttachedFileListListener = new EventEmitter();
  useLink: boolean = false;
  _selectedItemIndexList: number[] = [];
  attachedMediaListView: RadListView;
  resourceTypeClass = ResourceType;
  container: any;

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    this.clearAttachedFileList();
    if (this.attachedFileLinkList?.length) {
      this.useLink = true;
    }
  }

  pushFile(file: MediaSrc) {
    if (!this.isFileAlreadyAdded(file)) {
      this.attachedFileList.push(file);
    }
  }

  isFileAlreadyAdded(mediaSrc: MediaSrc) {
    let exists = false;
    if (!this.attachedFileList.length) {
      return exists;
    }
    this.attachedFileList.forEach((attachedFile: MediaSrc) => {
      if (attachedFile.src === mediaSrc.src) {
        exists = true;
      }
    });
    return exists;
    // return new Promise((resolve) => {

    // })
  }

  clearAttachedFileList() {
    this.attachedFileList = new ObservableArray<MediaSrc>();
  }

  removeAttachedFile() {
    let tempAttachedFileList = this.attachedFileList;
    this.clearAttachedFileList();
    this._selectedItemIndexList.forEach((removeIndex: number) => {
      tempAttachedFileList
        .map((file: MediaSrc, fileIndex: number) => {
          if (fileIndex != removeIndex) {
            this.attachedFileList.push(file);
          }
        });
    });
    this._selectedItemIndexList = [];
    this.finalizedAttachedList();
  }

  finalizedAttachedList() {
    this.finalizedAttachedFileListListener.emit(this.attachedFileList);
  }

  downloadErrorListener($event) {
    this.downloadError.emit();
  }

  onContainerLoaded(args) {
    this.container = args.object;
  }

  onAttachedMediaListViewLoaded(args) {
    this.attachedMediaListView = args.object as RadListView;
  }

  public onItemSelected(args: ListViewEventData) {
    this._selectedItemIndexList.push(args.index);
  }

  public onItemDeselected(args: ListViewEventData) {
    this._selectedItemIndexList = this._selectedItemIndexList.filter((itemIndex: number) => {
      return itemIndex != args.index;
    });
  }

  getTotalItemText(): string {
    return this.attachedFileList?.length > 1 ?
      this.attachedFileList?.length + ' items attached' : this.attachedFileList?.length + ' item attached';
  }

  selectionInProgress(): boolean {
    return this._selectedItemIndexList.length > 0;
  }

  animateTrashButton(): void {
    let trashbutton: any = getViewById(this.container, 'remove-attached-media');
    trashbutton.shake();
  }

  templateSelector(item, index, items) {
    // return item.resourceType;
    return ResourceType.application;
  }

  onFailure(args: FinalEventData, index: number): void {
    console.log("onFailure", index);
    this.attachedFileLinkList.splice(index, 1);
  }
}
