import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '~/services/common.service';
import { PostMedia } from '~/shared/models/post-action.model';
import * as utilsModule from "@nativescript/core/utils/utils";
import { MediaSrc } from '~/shared/models/common.model';

@Component({
  selector: 'qn-attached-file',
  templateUrl: './attached-file.component.html',
  styleUrls: ['./attached-file.component.scss']
})
export class AttachedFileComponent implements OnInit {
  @Input() index: number;
  @Input() useLink: boolean = false;
  @Input() attachedFile: MediaSrc;
  @Input() attachedFileLink: PostMedia;
  noneFileExtension: string = "unrecognised file";
  fileName: string;
  displayFileName: string;

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
  }

  checkFileExtension() {
    let fileSrc = this.attachedFile.src;
    this.fileName = fileSrc.substr(fileSrc.lastIndexOf("/") + 1);
    const extension = this.commonService.checkFileExtension(this.fileName);
    if (extension) return extension;
    else {
      return this.noneFileExtension;
    }
  }

  getFileExtension() {
    if (this.attachedFileLink?.fileExtension?.length > 0) {
      return this.attachedFileLink.fileExtension;
    }
    return this.noneFileExtension;
  }

  getFileName(): string {
    if (!this.displayFileName) {
      this.displayFileName = this.fileName.substr(0, 7) + '..';
    }
    return this.displayFileName;
  }

  openLink(): void {
    utilsModule.openUrl(this.attachedFileLink.postMediaLink);
  }

  // downloadAttachedFile(mediaLink: string) {
  //   if (mediaLink) {
  //     let a = document.createElement('a')
  //     a.href = mediaLink;
  //     a.download = mediaLink.split('/').pop()
  //     document.body.appendChild(a)
  //     a.click()
  //     document.body.removeChild(a)
  //   }
  //   else {
  //     this.downloadError.emit();
  //   }
  // }
}
