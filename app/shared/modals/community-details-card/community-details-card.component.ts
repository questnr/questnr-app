import { Component, OnInit } from '@angular/core';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import { ModalDialogParams } from '@nativescript/angular';
import { StaticMediaSrc } from '~/shared/constants/static-media-src';
import { Community } from '~/shared/models/community.model';
import { RelationType } from '~/shared/models/relation-type';
import { qColors, qRadius } from '~/_variables';

@Component({
  selector: 'qn-community-details-card',
  templateUrl: './community-details-card.component.html',
  styleUrls: ['./community-details-card.component.scss']
})
export class CommunityDetailsCardComponent implements OnInit {
  qRadius = qRadius;
  qColors = qColors;
  height: number = 120;
  community: Community;
  showJoinButton: boolean = true;
  defaultSrc: string = StaticMediaSrc.communityFile;
  relationTypeClass = RelationType;
  relation: RelationType;

  constructor(
    public params: ModalDialogParams) {
    this.community = this.params.context.community;
  }

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
}
