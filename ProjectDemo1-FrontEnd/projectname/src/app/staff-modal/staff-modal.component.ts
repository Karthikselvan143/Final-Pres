import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-staff-modal',
  templateUrl: './staff-modal.component.html',
  styleUrl: './staff-modal.component.css'
})
export class StaffModalComponent implements OnInit{
  @Input() staff: any = {};
  @Input() mode: 'create' | 'update' = 'create';
  staffForm: FormGroup;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:5046/api/RoomService';

  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      staffName: [this.staff.staffName || '', Validators.required],
      email: [this.staff.email || '', [Validators.required, Validators.email]],
      contact: [this.staff.contact || '', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: [this.staff.address || ''],
      rating: [this.staff.rating || '', [Validators.min(0), Validators.max(5)]],
      isAvailable: [this.staff.isAvailable || ''],  // Default value can be set to '' or 'Active'
      aadhar: [this.staff.aadhar || '', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      imagePath: [this.staff.imagePath || '']
    });
  }

  ngOnInit(): void {}

  save(): void {

    if (this.staffForm.invalid) {
      console.log("Error bro!")
      this.staffForm.markAllAsTouched(); // Mark all controls as touched to trigger validation messages
      return;
    }
    if (this.mode === 'create') {
      console.log(this.mode);
      this.http.post(`${this.apiUrl}/CreateStaff`, this.staff)
        .subscribe(
          () => this.close('Staff added successfully!'),
          error => this.errorMessage = 'Error adding staff.'
        );
    } else if (this.mode === 'update') {
      this.http.put(`${this.apiUrl}/UpdateStaff/${this.staff.id}`, this.staff)
        .subscribe(
          () => this.close('Staff updated successfully!'),
          error => this.errorMessage = 'Error updating staff.'
        );
    }
  }

  close(message?: string): void {
    if (message) {
      alert(message);
    }
    this.activeModal.close();
  }
}
      