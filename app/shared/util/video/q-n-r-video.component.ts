import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { getViewById, GridLayout, Slider, TouchGestureEventData } from '@nativescript/core';
import { Video } from 'nativescript-videoplayer';
import { CommonService } from '~/services/common.service';
import { qColors } from '~/_variables';
enum VideoVoiceState {
  muted,
  unmuted
}

enum VideoStreamState {
  playing,
  paused
}

enum VideoStatusDisplay {
  none,
  muted,
  unmuted,
  playing,
  paused
}

class VideoRef {
  container: GridLayout
  loaded: boolean;
  video: Video;
  voiceState: VideoVoiceState;
  streamState: VideoStreamState;
  slider: Slider;
  currentTime: FormControl;
  interval: any;
  userInteraction: UserInteraction = new UserInteraction();
  videoInteraction: UserInteraction = new UserInteraction(3000);
  startTime: string;
  endTime: string;

  private stutusDisplayInterval: any;
  videoStatusDisplay: VideoStatusDisplay

  // constructor(loaded: boolean,
  //   index: number,
  //   video: Video,
  //   voiceState: VideoVoiceState,
  //   streamState: VideoStreamState,
  //   userInteraction: UserInteraction) {
  // }
  setLoaded(loaded: boolean) {
    this.loaded = loaded;
  }
  setCurrentTime(currentTime: FormControl) {
    this.currentTime = currentTime;
  }
  setVideo(video: Video) {
    this.video = video;
  }
  setVoiceState(voiceState: VideoVoiceState) {
    this.voiceState = voiceState;
  }
  setStreamState(streamState: VideoStreamState) {
    this.streamState = streamState;
  }
  showingStatusChanged(videoStatusDisplay: VideoStatusDisplay) {
    this.videoStatusDisplay = videoStatusDisplay;
    if (this.stutusDisplayInterval) {
      clearTimeout(this.stutusDisplayInterval);
    }
    this.stutusDisplayInterval = setTimeout(() => {
      this.videoStatusDisplay = VideoStatusDisplay.none;
    }, 2000);
  }
}

class UserInteraction {
  live: boolean = false;
  timeout: any;
  timeoutValue: number;

  constructor(timeoutValue: number = 500) {
    this.timeoutValue = timeoutValue;
  }

  get isLive() {
    return this.live;
  }

  public setLive(view = undefined) {
    this.live = true;
    if (view) {
      view.show(200);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.live = false;
      if (view) {
        view.hide(200);
      }
    }, this.timeoutValue);
  }
}

@Component({
  selector: 'qn-video',
  templateUrl: './q-n-r-video.component.html',
  styleUrls: ['./q-n-r-video.component.scss']
})
export class QNRVideoComponent implements OnInit {
  @Input() src: string;
  @Input() id: string;
  videoContainer: VideoRef = new VideoRef();
  qColors = qColors;

  constructor(private ngZone: NgZone,
    private commonService: CommonService) { }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.stop();
  }

  onVideoContainerLoaded(args) {
    this.videoContainer.container = args.object as GridLayout;
  }

  onVideoLoaded(args) {
    console.log("onVideoLoaded");
    const video = args.object as Video;
    video.controls = false;

    // @todo store in user settings
    video.on(Video.playbackReadyEvent, () => {
      console.log("playbackReadyEvent");
      this.ngZone.run(() => {
        this.videoContainer.setLoaded(true);
        this.videoContainer.setCurrentTime(new FormControl(
          0, [
          Validators.max(video.getDuration())
        ]));
        // this.videoContainer[index].container.height = video.height
      });
    });
    video.on(Video.playbackStartEvent, () => {
      console.log("playbackStartEvent");
      this.startSlider();
    });
    video.on(Video.pausedEvent, () => {
      console.log("pausedEvent");
      this.stopSlider();
    });
    video.on(Video.errorEvent, (error) => {
      console.log("errorEvent");
    });
    // video.on(Video.currentTimeUpdatedEvent, (args) => {
    //   this.ngZone.run(() => {
    //     this.videoContainer.slider.value = video.currentTime();
    //   });
    // })
    this.videoContainer.setLoaded(false);
    this.videoContainer.setVideo(video);
    this.videoContainer.setVoiceState(VideoVoiceState.muted);
    // @todo
    this.videoContainer.setStreamState(VideoStreamState.playing);
  }

  isVideoLoaded(): boolean {
    return this.ngZone.run(() => {
      return this.videoContainer.loaded;
    });
  }

  toggleVideoVoiceState() {
    const videoRef = this.videoContainer;
    if (videoRef.voiceState === VideoVoiceState.unmuted) {
      videoRef.video.mute(true);
      videoRef.setVoiceState(VideoVoiceState.muted);
      videoRef.showingStatusChanged(VideoStatusDisplay.muted);
    } else if (videoRef.voiceState === VideoVoiceState.muted) {
      videoRef.video.mute(false);
      videoRef.setVoiceState(VideoVoiceState.unmuted);
      videoRef.showingStatusChanged(VideoStatusDisplay.unmuted);
    }
  }

  toggleVideoPlayingState() {
    const videoRef = this.videoContainer;
    if (videoRef.streamState === VideoStreamState.playing) {
      videoRef.video.pause();
      videoRef.setStreamState(VideoStreamState.paused);
      videoRef.showingStatusChanged(VideoStatusDisplay.paused);
    } else if (videoRef.streamState === VideoStreamState.paused) {
      videoRef.video.play();
      videoRef.setStreamState(VideoStreamState.playing);
      videoRef.showingStatusChanged(VideoStatusDisplay.playing);
    }
  }

  startSlider(): void {
    if (this.videoContainer.interval) {
      clearInterval(this.videoContainer.interval);
    }
    this.videoContainer.interval = setInterval(() => {
      this.videoContainer.currentTime.setValue(this.videoContainer.video.getCurrentTime())
    }, 1000);
  }

  stopSlider(): void {
    clearInterval(this.videoContainer.interval);
    this.videoContainer.interval = null;
  }

  getVideoDuration() {
    if (this.videoContainer.loaded) {
      return this.videoContainer.video.getDuration();
    }
    return 0;
  }

  onSliderLoaded(argsloaded) {
    let sliderComponent: Slider = <Slider>argsloaded.object;
    this.videoContainer.slider = sliderComponent;
    // setTimeout(() => {
    //   const parent = argsloaded.parent;
    //   console.log("parent", parent);
    //   const controllerContainer: any = getViewById(parent, this.getVideoControllerId())
    //   console.log("controllerContainer", controllerContainer);
    //   this.videoContainer.videoInteraction.setLive(controllerContainer);
    // }, 2000);
    sliderComponent.on("valueChange", (args) => {
      let slider = <Slider>args.object;
      const currentTime = slider.value;
      // console.log(`new value ${slider.value}`);
      if (currentTime - this.videoContainer.video.getCurrentTime() != 0 &&
        this.videoContainer.userInteraction.isLive) {
        // @todo: add throttle
        this.videoContainer.video.seekToTime(currentTime);
        // console.log(`Slider new value ${slider.value}`);
      }
    });
  }

  handleUserInteractingWithController(args: TouchGestureEventData) {
    // console.log(
    //   "Touch point: [" + args.getX() + ", " + args.getY() +
    //   "] activePointers: " + args.getActivePointers().length);

    if (args.getActivePointers().length > 0) {
      this.videoContainer.userInteraction.setLive();
    }
  }

  handleUserInteractingWithVideo(args: TouchGestureEventData) {
    if (args.getActivePointers().length > 0) {
      const parent = args.view;
      const controllerContainer: any = getViewById(parent, this.id)
      this.videoContainer.videoInteraction.setLive(controllerContainer);
    }
  }

  pause(): void {
    this.videoContainer.video.pause();
  }

  stop(): void {
    this.stopSlider();
    this.videoContainer.video.stop();
  }

  getStartTime() {
    return this.secondsToTimeFrame(this.videoContainer.video.getCurrentTime() / 1000);
  }

  getEndTime() {
    return this.secondsToTimeFrame(this.videoContainer.video.getDuration() / 1000);
  }

  videoPlayed() {
    return this.videoContainer.videoStatusDisplay === VideoStatusDisplay.playing;
  }

  videoPaused() {
    return this.videoContainer.videoStatusDisplay === VideoStatusDisplay.paused;
  }

  videoMuted() {
    return this.videoContainer.videoStatusDisplay === VideoStatusDisplay.muted;
  }

  videoUnmuted() {
    return this.videoContainer.videoStatusDisplay === VideoStatusDisplay.unmuted;
  }

  secondsToTimeFrame(ms: number): string {
    var h = Math.floor(ms / 3600);
    var m = Math.floor(ms % 3600 / 60);
    var s = Math.floor(ms % 3600 % 60);
    let timeToEnableResend;
    if (h > 0) {
      timeToEnableResend = [
        this.commonService.appendZero(h),
        this.commonService.appendZero(m),
        this.commonService.appendZero(s)
      ].join(':');
    } else {
      timeToEnableResend = [
        this.commonService.appendZero(m),
        this.commonService.appendZero(s)
      ].join(':');
    }
    return timeToEnableResend;
  }
}
