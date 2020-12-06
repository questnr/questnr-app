import { Component, Input, OnInit } from '@angular/core';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { Community } from '~/shared/models/community.model';
import { RelationType } from '~/shared/models/relation-type';
import { qColors, qRadius } from '~/_variables';

@Component({
  selector: 'qn-community-card-view',
  templateUrl: './community-card-view.component.html',
  styleUrls: ['./community-card-view.component.scss']
})
export class CommunityCardViewComponent implements OnInit {
  qRadius = qRadius;
  qColors = qColors;
  @Input() height: number = 80;
  @Input() community: Community;
  @Input() showJoinButton: boolean = true;
  defaultSrc: string = StaticMediaSrc.communityFile;
  relationTypeClass = RelationType;
  relation: RelationType;

  constructor() { }

  ngOnInit() {
    this.relation = this.community?.communityMeta?.relationShipType;
  }

  onActionEvent(relation: RelationType) {
    this.relation = relation;
  }

  // community avatar
  onFailure(args: FinalEventData): void {
    console.log("onFailure");
    let img = args.object as Img;
    img.src = this.defaultSrc;
  }

  onCommunityPageOpen(args): void {

  }
}
