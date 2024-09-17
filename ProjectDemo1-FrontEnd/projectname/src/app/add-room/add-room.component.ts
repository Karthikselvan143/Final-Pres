import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'] // Corrected from styleUrl to styleUrls
})
export class AddRoomComponent {
  roomForm: FormGroup;
  private apiUrl = `Room/AddRoom`; // Adjust the URL as necessary

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private service: ServiceService
  ) {
    this.roomForm = this.fb.group({
      roomNumber: [null, [Validators.required, this.roomNumberRangeValidator]],
      roomType: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/), this.priceMinValidator]], // Numeric validation and minimum value
      isAvailable: [true, Validators.required],
      imagePath: [''],
      bathRoom: [''],
      hall: [''],
      bedRoom: [''],
      rating: [null, [Validators.required, this.ratingRangeValidator]], // Rating between 1.0 and 5.0
      location: [null, Validators.required],
      description: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]], // Only letters and spaces
      wifi: [false], // Default value
      tv: [false],
      carparking: [false],
      freecancelation: [false],
      hotwater: [false],
      ironing: [false]
    });
  }

  // Validator for room number range (101 to 500)
  roomNumberRangeValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && (value < 101 || value > 500)) {
      return { roomNumberRange: true }; // Room number out of range
    }
    return null;
  }

  // Validator for rating range (1.0 to 5.0)
  ratingRangeValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && (value < 1.0 || value > 5.0)) {
      return { ratingRange: true }; // Rating out of range
    }
    return null;
  }

  // Validator for price minimum value (100)
  priceMinValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && value < 100) {
      return { priceMin: true }; // Price less than minimum value
    }
    return null;
  }

  // Submit form logic
  onSubmit() {
    if (this.roomForm.valid) {
      const formData = this.roomForm.value;
      formData.amenities = this.getSelectedAmenities(); // Collect selected amenities
      this.service.post(`${this.apiUrl}`, formData).subscribe(
        response => {
          window.alert('Room added successfully');
          this.activeModal.close(response); // Close modal and pass response
        },
        error => {
          console.error('Error adding room', error);
        }
      );
    } else {
      this.roomForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      alert('Please fill out all required fields correctly.');
    }
  }

  // Get selected amenities for the room
  getSelectedAmenities() {
    const amenities = [];
    if (this.roomForm.value.wifi) amenities.push('Free Wi-Fi');
    if (this.roomForm.value.tv) amenities.push('TV Available');
    if (this.roomForm.value.carparking) amenities.push('Car parking Available');
    if (this.roomForm.value.hotwater) amenities.push('Hot water');
    if (this.roomForm.value.ironing) amenities.push('Ironing');
    if (this.roomForm.value.freecancelation) amenities.push('Free Cancelation');
    return amenities.join(', '); // Return amenities as a comma-separated string
  }

  // Close the modal
  close() {
    this.activeModal.dismiss(); // Dismiss the modal
  }
}
