import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from '../services/service.service';

function lettersOnlyValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const pattern = /^[a-zA-Z]+$/;
  if (control.value && !pattern.test(control.value)) {
    return { 'lettersOnly': true };
  }
  return null;
}

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  userForm: FormGroup;
  private apiUrl = 'http://localhost:5046/api/Users'; // Your API URL
  statusOptions: string[] = ['1', '0']; // Example status options

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar, private service:ServiceService
  ) {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: false }],
      firstName: ['', [Validators.required, lettersOnlyValidator]],
      lastName: ['', [Validators.required, lettersOnlyValidator]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      isActive: ['Active', Validators.required] // Default value, change as needed
    });
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: number): void {
    console.log("Hello")
    this.http.get<any>(`${this.apiUrl}/GetUserById/${id}`).subscribe(
      response => {
        this.userForm.patchValue({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          isActive: response.isActive
        });
      },
      error => {
        console.error('Error fetching user', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.service.patch(`Users/UpdateUser/${updatedUser.id}`, updatedUser).subscribe(
        response => {
          window.alert("Updated Successfully!!");
          this.router.navigate(['/dashboard/users']);
          this.snackBar.open('User updated successfully', 'Close', {
            duration: 3000,
           
          });
          
        },
        error => {
          console.error('Error updating user', error);
          this.snackBar.open('Failed to update user. Please try again.', 'Close', {
            duration: 5000,
          });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 5000,
      });
    }
  }
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailPattern.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }
}
