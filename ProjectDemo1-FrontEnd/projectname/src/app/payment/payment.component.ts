import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Booking } from '../models/room.model';
import { environment } from '../environments/environments';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})

export class PaymentComponent implements  OnInit{
  bookingDetails: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  private apiUrl = 'http://localhost:5046/api/Booking'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBookingDetails();
  }

  loadBookingDetails(): void {
    this.http.get<any[]>(`${this.apiUrl}/Details`) // Update with your endpoint
      .subscribe({
        next: (data) => {
          this.bookingDetails = data.map(item => ({
            ...item,
            isBooked: item.isBooked // Ensure correct status display
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching booking details:', err);
          this.error = 'Failed to load booking details.';
          this.loading = false;
        }
      });
  }

  deleteBooking(bookingId: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.http.delete(`${this.apiUrl}/${bookingId}`)
        .subscribe({
          next: () => {
            this.loadBookingDetails(); // Refresh the list to show updated data
          },
          error: (err) => {
            console.error('Error deleting booking:', err);
            this.error = 'Failed to delete booking.';
          }
        });
    }
  }

  cancelBooking(bookingId: number): void {
    this.http.post(`${this.apiUrl}/CancelBookingStatus`, { bookingId })
      .subscribe({
        next: () => {
          this.loadBookingDetails(); // Refresh the list to show updated status
        },
        error: (err) => {
          console.error('Error cancelling booking:', err);
          this.error = 'Failed to cancel booking.';
        }
      });
  }

}