import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
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
  defaultPath: string = GlobalConstants.userPath;
  aspectRatio: number = 1;

  constructor(private routerExtensions: RouterExtensions,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.isCommunityAvatar) {
      this.aspectRatio = 4 / 3;
      this.defaultPath = GlobalConstants.communityPath;
      this.defaultSrc = StaticMediaSrc.communityFile;
    }
  }
  ngAfterViewInit() {
    this.getAvatarLink();
    // if (this.template === ProfileIconTemplateType.heading) {
    //   this.renderer.addClass(this.elementOnHTML.nativeElement, "heading-border");
    // }
  }

  setAvatar(avatar: AvatarDTO) {
    this.avatar = avatar;
    this.getAvatarLink();
  }

  getAvatarLink() {
    if (!this.avatarLink) {
      if (!this.avatar) {
        this.avatarLink = this.defaultSrc;
      } else if (this.sizeRef === "icon" && this.avatar.iconLink) {
        this.avatarLink = this.avatar.iconLink;
      } else if (this.sizeRef === "small" && this.avatar.smallLink) {
        this.avatarLink = this.avatar.smallLink;
      } else if (this.sizeRef === "medium" && this.avatar.mediumLink) {
        this.avatarLink = this.avatar.mediumLink;
      } else if (this.avatar.avatarLink) {
        this.avatarLink = this.avatar.avatarLink;
      } else {
        this.avatarLink = this.defaultSrc;
      }
      this.cd.detach();
      return this.avatarLink;
    }
    return this.avatarLink;
  }

  onFailure(args: FinalEventData): void {
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  // checkImageSrc(src) {
  //   if (src) {
  //     return src;
  //   } else {
  //     return this.defaultSrc;
  //   }
  // }

  onOpenEntityPage(args): void {
    this.routerExtensions.navigate(['/', this.defaultPath, this.slug], {
      animated: true,
      transition: {
        name: "fade",
        duration: 400,
        curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
      }
    });
  }
}
