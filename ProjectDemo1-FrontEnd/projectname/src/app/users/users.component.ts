import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'] // Corrected to use styleUrls
})
export class UsersComponent implements OnInit {
  users: any[] = []; // Define the type according to your data structure
  filteredUsers: any[] = [];
  searchEmail: string = ''; // For search input
  private apiUrl = 'Users/GetUsers'; // Your API URL

  constructor(private http: HttpClient, private router: Router, private service: ServiceService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
    });

    this.service.get(this.apiUrl).subscribe(
      response => {
        this.users = response.users; // Adjust according to your response structure
        this.filterUsers(); // Ensure the filter is applied after loading
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  filterUsers(): void {
    if (this.searchEmail) {
      this.filteredUsers = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  editUser(id: number): void {
    console.log('Navigating to edit user with ID:', id); // For debugging
    this.router.navigate(['/dashboard/edituser', id]); // Correct route navigation
  }

  deleteUser(id: number): void {
    if (confirm("Are you sure you want to delete the user?")) {
      this.service.delete(`Users/DeleteUser/${id}`)
        .subscribe(
          () => this.loadUsers(),
          error => console.error('Error deleting user', error)
        );
    }
  }
}
