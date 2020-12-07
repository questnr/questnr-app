import { Component, Input, OnInit } from '@angular/core';
import { Community } from '~/shared/models/community.model';
import { qRadius } from '~/_variables';

@Component({
  selector: 'qn-community-card-view-skeleton',
  templateUrl: './community-card-view-skeleton.component.html',
  styleUrls: ['./community-card-view-skeleton.component.scss']
})
export class CommunityCardViewSkeletonComponent implements OnInit {
  qRadius = qRadius;
  @Input() height: number = 80;
  @Input() community: Community;
  @Input() showJoinButton: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
