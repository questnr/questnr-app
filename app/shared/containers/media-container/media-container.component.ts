import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { isAndroid } from '@nativescript/core';
import { Carousel } from 'nativescript-carousel';
import { FeedService } from '~/services/feeds.service';
import { PostActionForMedia, PostMedia, ResourceType } from '~/shared/models/post-action.model';
import { QNRVideoComponent } from '~/shared/util/video/q-n-r-video.component';
import { qColors } from '~/_variables';

@Component({
  selector: 'qn-media-container',
  templateUrl: './media-container.component.html',
  styleUrls: ['./media-container.component.scss']
})
export class MediaContainerComponent implements OnInit {
  @Input() postActionId: number;
  @Input() viewMediaList: PostMedia[];
  @ViewChild("myCarousel", { static: false }) carouselView: ElementRef<Carousel>;
  errorOnImageIndexList: number[] = [];
  qColors = qColors;
  resourceTypeClass = ResourceType;
  currentPageIndex: number = 0;
  videoContainer: QNRVideoComponent[] = [];

  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.carouselView && isAndroid) {
      setTimeout(() => this.refreshCarousel());
    }
  }

  // createVideoView(args, media: PostMedia) {

  //   //create videoview    
  //   var mVideoView = new android.widget.VideoView(args.context);
  //   var mMediaController = new android.widget.MediaController(args.context);
  //   mMediaController.setAnchorView(mVideoView);

  //   // parse the uri
  //   var videoLink = media.postMediaLink;
  //   var mVideoURL = android.net.Uri.parse(videoLink);
  //   mVideoView.setVideoURI(mVideoURL);
  //   mVideoView.setMediaController(mMediaController);
  //   mVideoView.requestFocus();
  //   mVideoView.start();

  //   args.view = mVideoView;

  //   // Create our Complete Listener - this is triggered once a video reaches the end
  //   var completionListener = new android.media.MediaPlayer.OnCompletionListener({
  //     onCompletion: function (args) {
  //       console.log('Video Done');
  //     }
  //   });
  //   // Set the listener using the correct method
  //   mVideoView.setOnCompletionListener(completionListener);
  // }

  refreshCarousel() {
    const adapter = this.carouselView.nativeElement.android.getAdapter();
    adapter.notifyDataSetChanged();
  }

  ngOnDestroy(): void {
    this.stopVideo();
  }

  stopVideo(): void {
    this.videoContainer.forEach((qnrVideo: QNRVideoComponent) => {
      qnrVideo.stop();
    });
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
    this.videoContainer.forEach((qnrVideo: QNRVideoComponent, videoPageIndex: number) => {
      if (videoPageIndex !== this.currentPageIndex) {
        qnrVideo.pause();
      }
    });
    // console.log('Page changed to index: ' + args.index);
  };

  onFailure(args, index: number) {
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
