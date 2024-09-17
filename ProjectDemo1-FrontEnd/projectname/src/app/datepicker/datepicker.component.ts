import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  dates: any[] = [];
  newDatePicker = {
    startdate: '',
    enddate: '',
    location: ''
  };

  locations: string[] = ['Tambaram', 'Navalur', 'Shozhlinganallur'];
  today: string = new Date().toISOString().split('T')[0];
  minEndDate: string = '';
  totalDays: number = 0;
  numberOfPersons: number = 1;

  

  @Output() applyDateRangeEvent = new EventEmitter<any>();

  constructor(private http: HttpClient,private service :ServiceService

  ) {}

  ngOnInit(): void {
    this.getDates();
  }

  getDates(): void {
    this.service.get(`DatePicker/GetDate`).subscribe(
      (data: any) => {
        this.dates = data;
      },
      (error: any) => {
        console.error('Error fetching dates:', error);
      }
    );
  }

  applyDateRange(): void {
    if (this.newDatePicker.startdate && this.newDatePicker.enddate && this.newDatePicker.location) {
      const startDate = new Date(this.newDatePicker.startdate);
      const endDate = new Date(this.newDatePicker.enddate);
      const timeDiff = endDate.getTime() - startDate.getTime();
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.service.post(`DatePicker/CreateDate`, this.newDatePicker, httpOptions).subscribe(
        (response: any) => {
          console.log('Date Range Applied:', response);
          this.getDates();
          this.applyDateRangeEvent.emit(this.newDatePicker); // Emit event with the data
        },
        (error: any) => {
          console.error('Error applying date range:', error);
        }
      );
    } else {
      alert('Please select a start date, end date, and location.');
    }
  }

  updateMinEndDate(): void {
    if (this.newDatePicker.startdate) {
      const startDate = new Date(this.newDatePicker.startdate);
      startDate.setDate(startDate.getDate() + 1);
      this.minEndDate = startDate.toISOString().split('T')[0];
    }
  }

  increasePersons(): void {
    this.numberOfPersons += 1;
  }

  decreasePersons(): void {
    if (this.numberOfPersons > 1) {
      this.numberOfPersons -= 1;
    }
  }
}