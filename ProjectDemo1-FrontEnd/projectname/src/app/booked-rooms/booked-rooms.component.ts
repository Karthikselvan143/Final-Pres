import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booked-rooms',
  templateUrl: './booked-rooms.component.html',
  styleUrls: ['./booked-rooms.component.css']
})
export class BookedRoomsComponent implements OnInit {
  bookedRooms: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  userEmail: string | null = null;

  private apiUrl = 'http://localhost:5046/api/Payment'; // Update with your API base URL
  private cancelUrl = 'http://localhost:5046/api/Room/CancelBooking';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail'); // Retrieve user email from sessionStorage

    if (this.userEmail) {
      this.loadBookedRooms();
    } else {
      this.error = 'User email is not available. Please log in.';
      this.loading = false;
    }
  }

  loadBookedRooms(): void {
    if (!this.userEmail) {
      this.error = 'User email is not available. Please log in.';
      this.loading = false;
      return;
    }

    // Create HTTP parameters with user email
    const params = new HttpParams().set('email', this.userEmail);

    this.http.get<any[]>(`${this.apiUrl}/GetBookedRoomsByUserEmail`, { params })
      .subscribe({
        next: (data) => {
          this.bookedRooms = data.map(room => ({
            ...room,
            isCanceled: !room.roomDetails.isBooked // Adjust based on your API response
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching booked rooms:', err); // Log detailed error
          this.error = 'No Records!! Not Booked!!';
          this.loading = false;
        }
      });
  }

  cancelBooking(roomNumber: number) {
    if (window.confirm("Are you sure you want to cancel the booking?")) {
      const requestPayload = { roomNumber: roomNumber, userEmail: this.userEmail };
      
      this.http.post<any>(`${this.cancelUrl}`, requestPayload).subscribe(
        (response) => {
          // Handle successful cancellation
          this.loadBookedRooms(); // Refresh the list to show updated status
        },
        (err) => {
          this.error = 'Failed to cancel booking';
        }
      );
    }
  }
}