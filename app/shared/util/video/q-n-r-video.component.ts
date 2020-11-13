import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { getViewById, GridLayout, isAndroid, Slider, TouchGestureEventData } from '@nativescript/core';
import { Video } from '@nstudio/nativescript-exoplayer';
import { CommonService } from '~/services/common.service';
import { VideoService } from '~/services/video.service';
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
  paused,
  error
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
  play() {
    this.video.play();
    this.setStreamState(VideoStreamState.playing);
  }
  pause() {
    this.video.pause();
    this.setStreamState(VideoStreamState.paused);
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
  @Input() videoId: string;
  @Input() autoplay: boolean = false;
  @Output() loadedEvent = new EventEmitter();

  videoContainer: VideoRef = new VideoRef();
  qColors = qColors;

  constructor(private ngZone: NgZone,
    private commonService: CommonService,
    private videoService: VideoService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.loadedEvent.emit(this);
  }

  ngOnDestroy(): void {
    if (isAndroid) {
      this.stop();
    }
    console.log("destroy Video");
    this.videoContainer.video.destroy();
  }

  onVideoContainerLoaded(args) {
    this.videoContainer.container = args.object as GridLayout;
  }

  onVideoLoaded(args) {
    console.log("onVideoLoaded");
    const video = args.object as Video;
    this.videoContainer.setLoaded(false);
    this.videoContainer.setVideo(video);
    this.videoContainer.setVoiceState(VideoVoiceState.unmuted);

    // @todo store in user settings
    // video.on(Video.playbackReadyEvent, () => {
    //   console.log("playbackReadyEvent");
    //   this.ngZone.run(() => {
    //     this.videoContainer.setLoaded(true);
    //     this.videoContainer.setCurrentTime(new FormControl(
    //       0, [
    //       Validators.max(video.getDuration())
    //     ]));
    //     if (this.autoplay) {
    //       this.play();
    //     } else {
    //       this.videoContainer.setStreamState(VideoStreamState.paused);
    //     }
    //   });
    // });
    // video.on(Video.playbackStartEvent, () => {
    //   console.log("playbackStartEvent");
    //   this.startSlider();
    //   this.videoContainer.setStreamState(VideoStreamState.playing);
    // });
    // video.on(Video.pausedEvent, () => {
    //   console.log("pausedEvent");
    //   this.stopSlider();
    //   this.videoContainer.setStreamState(VideoStreamState.paused);
    // });
    // video.on(Video.mutedEvent, () => {
    //   console.log("mutedEvent");
    //   this.videoContainer.setVoiceState(VideoVoiceState.muted);
    // });
    // video.on(Video.unmutedEvent, () => {
    //   console.log("unmutedEvent");
    //   this.videoContainer.setVoiceState(VideoVoiceState.unmuted);
    // });
    // video.on(Video.errorEvent, (error: EventData) => {
    //   console.log("errorEvent", error.object);
    //   this.videoContainer.setStreamState(VideoStreamState.paused);
    //   this.videoContainer.showingStatusChanged(VideoStatusDisplay.error);
    // });
    // video.on(Video.finishedEvent, () => {
    //   console.log("finishedEvent");
    //   this.stopSlider();
    //   this.videoContainer.setStreamState(VideoStreamState.stopped);
    // });
    // video.on(Video.currentTimeUpdatedEvent, (args) => {
    //   this.ngZone.run(() => {
    //     this.videoContainer.slider.value = video.currentTime();
    //   });
    // })
  }

  onVideoFinished(): void {
    console.log("finishedEvent");
    this.stopSlider();
  }

  onPlaybackReady(): void {
    console.log("playbackReadyEvent");
    this.ngZone.run(() => {
      this.videoContainer.setLoaded(true);
      this.videoContainer.setCurrentTime(new FormControl(
        0, [
        Validators.max(this.videoContainer.video.getDuration())
      ]));
      if (this.autoplay) {
        this.play();
      } else {
        this.videoContainer.setStreamState(VideoStreamState.paused);
      }
    });
  }

  setPlayWhenReady(autoplay: boolean): void {
    this.autoplay = autoplay;
    if (this.videoContainer.loaded) {
      if (autoplay)
        this.play();
      else
        this.pause();
    }
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
      this.pause();
      videoRef.showingStatusChanged(VideoStatusDisplay.paused);
    } else if (videoRef.streamState === VideoStreamState.paused) {
      this.play();
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
    if (!this.videoContainer.interval) return;
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
      const controllerContainer: any = getViewById(parent, this.videoId)
      this.videoContainer.videoInteraction.setLive(controllerContainer);
    }
  }

  play(force: boolean = false): void {
    this.ngZone.run(() => {
      if (!this.videoContainer.loaded) return;
      if (this.videoContainer.streamState === VideoStreamState.playing && !force)
        return;
      // this.videoContainer.video.play();
      this.videoService.setVideoAndPlay(this);
      this.videoContainer.setStreamState(VideoStreamState.playing);
      this.startSlider();
    });
  }

  pause(force: boolean = false): void {
    this.ngZone.run(() => {
      if (!this.videoContainer.loaded) return;
      if (this.videoContainer.streamState === VideoStreamState.paused && !force)
        return;
      // this.videoContainer.video.pause();
      this.videoService.resetVideo(this);
      this.videoContainer.setStreamState(VideoStreamState.paused);
      this.stopSlider();
    });
  }

  stop(): void {
    if (!this.videoContainer.loaded) return;
    this.videoContainer.video.stop();
    this.stopSlider();
    this.videoService.removeVideo(this);
  }

  isBeingPlayed(): boolean {
    return this.videoContainer.streamState === VideoStreamState.playing;
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

  videoErrorOccurred() {
    return this.videoContainer.videoStatusDisplay === VideoStatusDisplay.error;
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

  public isEqual(anotherVideo: QNRVideoComponent): boolean {
    return this.videoId === anotherVideo.videoId;
  }
}
