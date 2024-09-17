import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Feedback } from '../models/room.model';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(300)
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class FeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  feedback: Feedback = { name: '', email: '', phoneNumber: '', message: '' };
  isEditing: boolean = false;

  private apiUrl = 'http://localhost:5046/api/Admin'; // Adjust to match your API endpoint

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.http.get<Feedback[]>(`${this.apiUrl}/GetFeedback`).pipe(
      catchError(this.handleError)
    ).subscribe(data => this.feedbacks = data);
  }

  createFeedback(): void {console.log("hello")
    this.http.post<void>(`${this.apiUrl}/CreateFeedback`, this.feedback).pipe(
      catchError(this.handleError)
    ).subscribe(() => {
      this.loadFeedbacks();
      window.alert("Feedback created Successfully!!")
      this.resetForm();
    });
  }

  updateFeedback(id: number | undefined): void {
    if (id === undefined) {
      console.error('Feedback ID is undefined');
      return;
    }

    this.http.put<void>(`${this.apiUrl}/UpdateFeedback/${id}`, this.feedback).pipe(
      catchError(this.handleError)
    ).subscribe(() => {
      this.loadFeedbacks();
      window.alert("FeedBack Updated Successfully!!!")
      this.resetForm();
    });
  }

  deleteFeedback(id: number | undefined): void {
    if (id === undefined) {
      console.error('Feedback ID is undefined');
      return;
    }
    window.alert("Are you sure to Delete this Feedback");
    this.http.delete<void>(`${this.apiUrl}/DeleteFeedback/${id}`).pipe(
      catchError(this.handleError)
    ).subscribe(() => 
     
      this.loadFeedbacks() 
    );
  }

  editFeedback(feedback: Feedback): void {
    this.feedback = { ...feedback };
    this.isEditing = true;
  }

  resetForm(): void {
    this.feedback = { name: '', email: '', phoneNumber: '', message: '' };
    this.isEditing = false;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }
}