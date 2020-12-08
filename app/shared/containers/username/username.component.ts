import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation';
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

  constructor(private renderer2: Renderer2,
    private routerExtensions: RouterExtensions) { }

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
