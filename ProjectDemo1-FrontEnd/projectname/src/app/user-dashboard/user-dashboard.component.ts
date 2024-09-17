import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  userEmail: string = '';
  isSidebarVisible = false;

  constructor(private modalService: NgbModal,private router:Router) {}
  ngOnInit(): void {
    this.userEmail = sessionStorage.getItem('userEmail') || '';
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    //localStorage.removeItem('userEmail');
    this.userEmail = '';
    this.router.navigate(['/login']); // Redirect to login page or home page
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.modalService.open(modal);
    }
  }
  }



