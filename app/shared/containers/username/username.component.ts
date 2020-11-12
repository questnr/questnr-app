import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { GlobalConstants } from '~/shared/constants';

@Component({
  selector: 'qn-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
  @Input() username: string;
  @Input() slug: string;
  @Input() fontSize: string;
  @Input() isCommunity: boolean = false;
  usernameComponentRef: ElementRef;
  @ViewChild("usernameComponent")
  set usernameComponent(usernameComponentRef: ElementRef) {
    this.usernameComponentRef = usernameComponentRef;
  }
  defaultPath: string = GlobalConstants.userPath;

  constructor(private renderer2: Renderer2) { }

  ngOnInit(): void {
    if (this.isCommunity) {
      this.defaultPath = GlobalConstants.communityPath;
    }
  }

  ngAfterViewInit(): void {
    if (this.fontSize) {
      this.renderer2.setStyle(this.usernameComponentRef.nativeElement, "font-size", this.fontSize);
    }
  }
}
