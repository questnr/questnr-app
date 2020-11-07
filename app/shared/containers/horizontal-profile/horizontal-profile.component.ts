import { Component, OnInit, Input } from '@angular/core';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { AvatarDTO } from '~/shared/models/common.model';
import { qRipple } from '~/_variables';

@Component({
  selector: 'qn-horizontal-profile',
  templateUrl: './horizontal-profile.component.html',
  styleUrls: ['./horizontal-profile.component.scss']
})
export class HorizontalProfileComponent implements OnInit {
  @Input() avatar: AvatarDTO;
  @Input() isCommunityAvatar: boolean = false;
  @Input() head: string;
  @Input() subhead: string;
  @Input() rippleEnabled: boolean = true;
  @Input() iconSize: string = 'medium';
  rippleColor = qRipple.$horizontalProfile;

  defaultUserSrc: string = StaticMediaSrc.userFile;

  constructor() { }

  ngOnInit(): void {
  }
  handleTap(args) {
  }
}
