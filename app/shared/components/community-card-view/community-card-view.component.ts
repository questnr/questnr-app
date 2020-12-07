import { Component, Input, OnInit } from '@angular/core';
import { FinalEventData, Img } from '@nativescript-community/ui-image';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
import { GlobalConstants } from '~/shared/constants';
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

  constructor(private routerExtensions: RouterExtensions) { }

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
    this.routerExtensions.navigate(['/', GlobalConstants.communityPath, this.community.slug], {
      animated: true,
      transition: {
        name: "slideLeft",
        duration: 400,
        curve: new CubicBezierAnimationCurve(.08, .47, .19, .97)
      }
    })
  }
}
