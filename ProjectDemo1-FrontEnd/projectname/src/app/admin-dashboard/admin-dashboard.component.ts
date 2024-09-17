import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  userEmail: string = '';
  constructor(private router:Router) {}
  logout(): void {
   
    if(window.confirm("Trying to Logout ?")){
      sessionStorage.removeItem('authToken');
      //localStorage.removeItem('userEmail');
      this.userEmail = '';
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/dashboard']);
    }
   
  }
}
