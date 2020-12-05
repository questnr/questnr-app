import { Component, Input, OnInit } from '@angular/core';
import { RelationType } from '~/shared/models/relation-type';
import { qColors, qRadius } from '~/_variables';

@Component({
  selector: 'qn-user-description-card',
  templateUrl: './user-description-card.component.html',
  styleUrls: ['./user-description-card.component.scss']
})
export class UserDescriptionCardComponent implements OnInit {
  qColors = qColors;
  qRadius = qRadius;
  @Input() bio: string;
  @Input() username: string;
  @Input() relation: string;
  isLoading: boolean = true;
  relationTypeClass = RelationType;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.isLoading = false;
  }
}
