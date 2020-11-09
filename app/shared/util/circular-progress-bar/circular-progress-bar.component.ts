import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "circular-progress-bar",
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent {
  @Input() size = 100;
  @Input() progress = 0;
  @Input() textColor = "#bfbfc4";
  @Input() fillColor = "#FDA458";
  @Input() fillBackgroundColor = "#efeff4";
  @Input() offset = 0;

  get height() {
    return Math.min(this.size, 250);
  };
  get value() {
    return Math.min(this.progress, 100);
  };
  get text() {
    return `${this.value.toFixed()}%`;
  };
  get textSize() {
    return this.height / 3.5;
  };
}