import { Injectable } from "@angular/core";
import { QNRVideoComponent } from "~/shared/util/video/q-n-r-video.component";

@Injectable()
export class VideoService {
    constructor() {
    }

    currentVideo: QNRVideoComponent;

    isBeingPlayed(): boolean {
        return this.currentVideo.isBeingPlayed();
    }

    setVideo(video: QNRVideoComponent): void {
        console.log("setVideo", video.videoId);
        if (this.currentVideo) {
            this.currentVideo.videoContainer.pause();
        }
        this.currentVideo = video;
    }

    resetVideo(video: QNRVideoComponent): void {
        console.log("resetVideo", video.videoId);
        if (this.currentVideo.isEqual(video)) {
            this.currentVideo = null;
        }
        video.videoContainer.pause();
    }

    removeVideo(video: QNRVideoComponent): void {
        console.log("removeVideo", video.videoId);
        if (this.currentVideo.isEqual(video)) {
            this.currentVideo = null;
        }
    }

    setVideoAndPlay(qnrVideoComponent: QNRVideoComponent): void {
        console.log("setVideoAndPlay", qnrVideoComponent.videoId);
        try {
            if (typeof this.currentVideo !== 'undefined') {
                if (this.currentVideo && !this.currentVideo.isEqual(qnrVideoComponent)) {
                    this.currentVideo.videoContainer.pause();
                }
            }
            this.currentVideo = qnrVideoComponent;
            this.play();
        } catch (e) {
            this.currentVideo = qnrVideoComponent;
        }
    }

    play(): void {
        this.currentVideo.videoContainer.play();
    }

    pause(): void {
        this.currentVideo.videoContainer.pause();
    }

    terminate() {
        if (this.currentVideo) {
            this.currentVideo.videoContainer.video.destroy();
        }
        this.currentVideo = null;
    }
}