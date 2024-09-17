import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from '../services/service.service';
@Component({
  selector: 'app-room-status',
  templateUrl: './room-status.component.html',
  styleUrl: './room-status.component.css'
})
export class RoomStatusComponent implements OnInit {
  availableRooms: any[] = [];
  bookedRooms: any[] = [];
  displayedRooms: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient,private service:ServiceService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.http.get<any[]>('http://localhost:5046/api/Room/GetRoom').subscribe({
      next: (data) => {
        this.availableRooms = data.filter(room => !room.isBooked);
        this.bookedRooms = data.filter(room => room.isBooked);
        this.displayedRooms = this.availableRooms; // Default to showing available rooms
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rooms';
        this.loading = false;
      }
    });
  }

  showAvailableRooms() {
    this.displayedRooms = this.availableRooms;
  }
  
  showBookedRooms() {
    this.displayedRooms = this.bookedRooms;
  }
}