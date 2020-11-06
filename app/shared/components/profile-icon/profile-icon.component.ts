import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { GlobalConstants } from '~/shared/constants';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { AvatarDTO, ProfileIconTemplateType } from '~/shared/models/common.model';


@Component({
  selector: 'qn-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.scss']
})
export class ProfileIconComponent implements OnInit {
  @Input() avatar: AvatarDTO;
  @Input() height: number = 25;
  @Input() border: number = 10;
  @Input() sizeRef: string;
  @Input() slug: string;
  @Input() template: ProfileIconTemplateType = ProfileIconTemplateType.normal;
  avatarLink: string;
  @Input() alt: string = "image";
  defaultSrc: string = StaticMediaSrc.userFile;
  @Input() isCommunityAvatar: boolean = false;
  @ViewChild('elementOnHTML', { static: false }) elementOnHTML: ElementRef;
  defaultPath: string = GlobalConstants.userPath;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    if (this.isCommunityAvatar) {
      this.defaultPath = GlobalConstants.communityPath;
      this.defaultSrc = StaticMediaSrc.communityFile;
    }
  }
  ngAfterViewInit() {
    this.setAvatar(this.avatar);
    this.renderer.setStyle(this.elementOnHTML.nativeElement, 'height', this.height);
    this.renderer.setStyle(this.elementOnHTML.nativeElement, 'width', this.height);
    if (this.template === ProfileIconTemplateType.heading) {
      this.renderer.addClass(this.elementOnHTML.nativeElement, "heading-border");
    }
  }

  setAvatar(avatar: AvatarDTO) {
    this.avatar = avatar;
    if (this.avatar) {
      if (this.sizeRef === "icon" && this.avatar.iconLink) {
        this.avatarLink = this.avatar.iconLink;
      } else if (this.sizeRef === "small" && this.avatar.smallLink) {
        this.avatarLink = this.avatar.smallLink;
      } else if (this.sizeRef === "medium" && this.avatar.mediumLink) {
        this.avatarLink = this.avatar.mediumLink;
      } else {
        this.avatarLink = this.avatar.avatarLink;
      }
    }
  }

  checkImageSrc(src) {
    if (src) {
      return src;
    } else {
      return this.defaultSrc;
    }
  }
}
