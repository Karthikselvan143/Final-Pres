import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  // Updated Email Pattern
  emailPattern: RegExp = /^[a-zA-Z]+\d{0,4}@(gmail|mail|webmail)\.(com|in)$/;
  
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/; // 1 uppercase, 1 number, 1 special char, 8+ chars
  namePattern: RegExp = /^[A-Za-z]{3,}$/; // No numbers/special characters, at least 3 characters for first name
  lastNamePattern: RegExp = /^[A-Za-z]{1,}$/; // No numbers/special characters, at least 1 character for last name
  showPassword: boolean = false;

  touchedFields: any = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  };

  formErrors: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Track when a field is touched
  onFieldTouched(field: string) {
    this.touchedFields[field] = true;
    this.validateForm();
  }

  validateForm() {
    // First Name validation
    if (this.touchedFields.firstName) {
      this.formErrors.firstName = this.namePattern.test(this.firstName)
        ? ''
        : 'First name must be at least 3 characters, no numbers or special characters.';
    }

    // Last Name validation
    if (this.touchedFields.lastName) {
      this.formErrors.lastName = this.lastNamePattern.test(this.lastName)
        ? ''
        : 'Last name must be at least 1 character, no numbers or special characters.';
    }

    // Email validation
    if (this.touchedFields.email) {
      if (!this.email) {
        this.formErrors.email = 'Please enter your email.';
      } else if (!this.emailPattern.test(this.email)) {
        this.formErrors.email = 'Please enter a valid email (e.g., esu1234@gmail.com).';
      } else {
        this.formErrors.email = '';
      }
    }

    // Password validation
    if (this.touchedFields.password) {
      this.formErrors.password = this.passwordPattern.test(this.password)
        ? ''
        : 'Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.';
    }

    // Confirm Password validation
    if (this.touchedFields.confirmPassword) {
      this.formErrors.confirmPassword = this.confirmPassword === this.password
        ? ''
        : 'Passwords do not match.';
    }
  }

  onSubmit() {
    this.validateForm();
    if (this.isFormValid()) {
      this.http.post('http://localhost:5046/api/Users/Registration', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }).subscribe(response => {
        window.alert('Registration successful!');
        this.router.navigate(['/login']);
      }, error => {
        console.error('Registration error', error);
      });
    }
  }

  isFormValid() {
    return !this.formErrors.firstName && !this.formErrors.lastName &&
           !this.formErrors.email && !this.formErrors.password && !this.formErrors.confirmPassword;
  }
}
