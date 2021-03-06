import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { isAndroid } from '@nativescript/core';
import { Carousel } from 'nativescript-carousel';
import { AWSService } from '~/services/aws.service';
import { FeedService } from '~/services/feed.service';
import { PostActionForMedia, PostMedia, ResourceType } from '~/shared/models/post-action.model';
import { QNRVideoComponent } from '~/shared/util/video/q-n-r-video.component';
import { qColors } from '~/_variables';

class VideoContainer {
  video: QNRVideoComponent;
  index: number;
}

@Component({
  selector: 'qn-media-container',
  templateUrl: './media-container.component.html',
  styleUrls: ['./media-container.component.scss']
})
export class MediaContainerComponent implements OnInit {
  @Input() postActionId: number;
  @Input() viewMediaList: PostMedia[];
  @ViewChild("myCarousel", { static: false }) carouselView: ElementRef<Carousel>;
  signedURLs = {};
  errorOnImageIndexList: number[] = [];
  qColors = qColors;
  resourceTypeClass = ResourceType;
  currentPageIndex: number = 0;
  videoContainer: VideoContainer[] = [];
  waitingForVideoRendered: boolean = false;
  showIndicator: boolean = true;


  constructor(private feedService: FeedService,
    private awsService: AWSService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.carouselView && isAndroid) {
      setTimeout(() => this.refreshCarousel());
    }
  }

  refreshCarousel() {
    const adapter = this.carouselView.nativeElement.android.getAdapter();
    adapter.notifyDataSetChanged();
  }

  ngOnDestroy(): void {
    this.stopVideoIfAny();
  }

  getMediaLink(index: number): string {
    if (!this.signedURLs || (!this.signedURLs.hasOwnProperty(index) &&
      this.viewMediaList.length)) {
      this.signedURLs[index] = this.awsService.getObjectURL(this.viewMediaList[index].postMediaKey);
      return this.signedURLs[index];
    }
    return this.signedURLs[index];
  }

  playVideoIfAny(): void {
    try {
      this.videoContainer.forEach((videoContainerRef: VideoContainer) => {
        if (this.currentPageIndex === videoContainerRef.index) {
          videoContainerRef.video.setPlayWhenReady(true);
        }
      });
    } catch (e) { }
  }

  pauseVideoIfAny(): void {
    try {
      this.videoContainer.forEach((videoContainerRef: VideoContainer) => {
        videoContainerRef.video?.setPlayWhenReady(false);
      });
    } catch (e) { }
  }

  stopVideoIfAny(): void {
    try {
      this.videoContainer.forEach((videoContainerRef: VideoContainer) => {
        videoContainerRef.video?.stop();
      });
    } catch (e) { }
  }

  myTapPageEvent(args) {
    // const tappedPage = this.carouselView.nativeElement.selectedPage;
    // console.log('Tapped page index: ' + (this.carouselView.nativeElement.selectedPage));
  }

  getVideoControllerId(index: number): string {
    return [this.postActionId, index, 'video-controller'].join('/')
  }

  myChangePageEvent(args): void {
    this.currentPageIndex = args.index;
    // const prev = { showIndicator: this.showIndicator };
    // if (this.isNormalCarousel()) {
    //   this.carouselView.nativeElement.showIndicator = true;
    //   this.showIndicator = true;
    // } else {
    //   this.carouselView.nativeElement.showIndicator = false;
    //   this.showIndicator = false;
    // }
    // if (prev.showIndicator != this.showIndicator) {
    //   console.log("refreshCarousel", this.showIndicator)
    //   this.refreshCarousel();
    // }
    console.log('Page changed to index: ' + args.index);
    this.videoContainer.forEach((videoContainerRef: VideoContainer) => {
      if (!videoContainerRef.video) {
      } else {
        if (videoContainerRef.index === this.currentPageIndex) {
          videoContainerRef.video.setPlayWhenReady(true);
        } else {
          videoContainerRef.video.setPlayWhenReady(false);
        }
      }
    });
  }

  isNormalCarousel(): boolean {
    return !this.videoContainer.map((videoContainer: VideoContainer) => {
      return videoContainer.index;
    }).includes(this.currentPageIndex);
  }

  onQNRVideoLoaded(args, index: number) {
    // console.log("onQNRVideoLoaded", index, args);
    // const qnrVideoComponent = args.object as QNRVideoComponent;
    // console.log("qnrVideoComponent", qnrVideoComponent);
  }

  onQNRVideoRendered(qnrVideoComponent: QNRVideoComponent, index: number) {
    // console.log("onQNRVideoRendered", index, qnrVideoComponent.videoId);
    this.videoContainer.push({ video: qnrVideoComponent, index: index });
    // if (this.currentPageIndex === index) {
    //   qnrVideoComponent.setPlayWhenReady(true);
    // }
  }

  onFailure(args, index: number) {
    console.log("onFailure")
    this.errorOnImageIndexList.push(index);
  }

  onLoad(index: number) {
    if (this.errorOnImageIndexList.includes(index)) {
      this.errorOnImageIndexList.splice(index, this.errorOnImageIndexList.length);
    }
  }
  onRefreshImageAtIndex(index: number) {
    this.feedService.getPostMediaList(this.postActionId).subscribe((res: PostActionForMedia) => {
      this.viewMediaList = res.postMediaList;
      for (let mediaIndex = 0; mediaIndex < res?.postMediaList?.length; mediaIndex++) {
        if (res?.postMediaList[mediaIndex]?.resourceType !== ResourceType.application) {
          this.viewMediaList.push(res.postMediaList[mediaIndex]);
        }
      }
      this.errorOnImageIndexList = [];
    });
  }
}
