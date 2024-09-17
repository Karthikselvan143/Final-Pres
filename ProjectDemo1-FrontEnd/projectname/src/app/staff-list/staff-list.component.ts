import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffModalComponent } from '../staff-modal/staff-modal.component';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staffList: any[] = [];              // Original staff list
  filteredStaffList: any[] = [];       // Filtered staff list for display
  searchEmail: string = '';            // Model for search input
  staff: any = {};
  mode: 'create' | 'update' = 'create'; // Mode for Add/Edit modal
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private modalService: NgbModal,private service :ServiceService) {}

  ngOnInit(): void {
    this.loadStaff(); // Load staff data when the component initializes
  }

  loadStaff(): void {
    this.service.get('RoomService/GetStaff')
      .subscribe(
        data => {
          this.staffList = data;            // Store staff data
          this.filteredStaffList = data;    // Initially, filtered list is the same as the complete list
        },
        error => this.errorMessage = 'Error fetching staff data.'
      );
  }

  // Filter the staff list based on the search input (email)
  filterStaffList(): void {
    this.filteredStaffList = this.staffList.filter(staff =>
      staff.email.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }

  // Clear the search and reset the filtered list
  clearSearch(): void {
    this.searchEmail = '';                 // Clear the search input
    this.filteredStaffList = this.staffList; // Reset the filtered list to the original staff list
  }

  // Existing methods (openAddStaffModal, openEditStaffModal, save, deleteStaff)
  openAddStaffModal(): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.staff = {};
    modalRef.result.then(() => this.loadStaff());
  }

  openEditStaffModal(staff: any): void {
    const modalRef = this.modalService.open(StaffModalComponent);
    modalRef.componentInstance.mode = 'update';
    modalRef.componentInstance.staff = { ...staff };
    modalRef.result.then(() => this.loadStaff());
  }

  save(): void {
    if (this.mode === 'create') {
      this.service.post('RoomService/CreateStaff', this.staff)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll(); // Close modal
          },
          error => this.errorMessage = 'Error adding staff.'
        );
    } else if (this.mode === 'update') {
      this.service.put(`RoomService/UpdateStaff/${this.staff.id}`, this.staff)
        .subscribe(
          () => {
            this.loadStaff();
            this.modalService.dismissAll(); // Close modal
          },
          error => this.errorMessage = 'Error updating staff.'
        );
    }
  }

  deleteStaff(id: number): void {
    if(confirm("are you want to delete the staff?")){
      this.service.delete(`RoomService/DeleteStaff/${id}`)
      .subscribe(
        () => this.loadStaff(),
        error => this.errorMessage = 'Error deleting staff.'
      );
    }
   
  }
}
    