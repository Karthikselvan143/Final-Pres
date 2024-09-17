import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LogoutComponent } from './logout/logout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UsersComponent } from './users/users.component';
import { EdituserComponent } from './edituser/edituser.component';
import { RoomCardComponent } from './room-card/room-card.component';
import { RoomListComponent } from './room-list/room-list.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffModalComponent } from './staff-modal/staff-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatSortModule } from '@angular/material/sort';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserRoomsComponent } from './user-rooms/user-rooms.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BookedRoomsComponent } from './booked-rooms/booked-rooms.component';
import { RoomStatusComponent } from './room-status/room-status.component';
import { PaymentComponent } from './payment/payment.component';
import {HeaderComponent} from './header/header.component'
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { PartnersComponent } from './partners/partners.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AdminDashboardComponent,
    FeedbackComponent,
    LogoutComponent,
    UsersComponent,
    EdituserComponent,
    RoomCardComponent,
    RoomListComponent,
    AddRoomComponent,
    StaffListComponent,
    StaffModalComponent,
    UserDashboardComponent,
    UserRoomsComponent,
    BookedRoomsComponent,
    RoomStatusComponent,
    PaymentComponent,
    HeaderComponent,
    ContactComponent,
    AboutComponent,
    HomeComponent,
    PartnersComponent,
    FooterComponent,
    DatepickerComponent,
    GalleryComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    NgbModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule, // Add MatTableModule here
    MatSortModule,  // Add MatSortModule here (optional)
    ModalModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
