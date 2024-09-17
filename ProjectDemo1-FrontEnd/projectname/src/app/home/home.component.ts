// home.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('roomVideo') roomVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    // Ensure the video starts playing when the page loads
    this.playVideo();
  }

  playVideo(): void {
    const video = this.roomVideo.nativeElement;
    video.play().catch(error => {
      console.error('Error attempting to play video:', error);
    });
  }

  pauseVideo(): void {
    const video = this.roomVideo.nativeElement;
    video.pause();
  }
}
