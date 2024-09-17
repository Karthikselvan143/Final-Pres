import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.emailPattern.test(this.email) && this.password) {
      this.http.post<{ token?: string, user?: {
        email: any; role?: string 
} }>('http://localhost:5046/api/Users/Login', {
        email: this.email,
        password: this.password
      }, { observe: 'response' })
      .subscribe({
        next: response => {
          const user = response.body?.user;
          const token = response.body?.token;

          if (user && token) {
            sessionStorage.setItem('authToken', token);
              // Ensure user.email is a string
              const userEmail = typeof user.email === 'string' ? user.email : '';
              sessionStorage.setItem('userEmail', userEmail);
              

            console.log('User role:', user.role);

            if (user.role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/userdashboard']);
            }

            // window.alert('Login successful');
          } else {
            
            window.alert('Login failed!! Enter Valid Credentials!!');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            window.alert('Invalid credentials');
          } else if (error.status === 400) {
            window.alert('Bad request. Please check your input.');
          } else if (error.status === 500) {
            window.alert('Server error. Please try again later.');
          } else {
            window.alert('An unexpected error occurred');
          }
        }
      });
    } else {
      window.alert('Please enter valid credentials');
    }
  }
}
