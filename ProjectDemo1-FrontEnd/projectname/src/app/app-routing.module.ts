import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UsersComponent } from './users/users.component';
import { EdituserComponent } from './edituser/edituser.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomCardComponent } from './room-card/room-card.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserRoomsComponent } from './user-rooms/user-rooms.component';
import { BookedRoomsComponent } from './booked-rooms/booked-rooms.component';
import { RoomStatusComponent } from './room-status/room-status.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './auth.guard';
import { LandingComponent } from './landing/landing.component';



const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingComponent },
  {
    path: 'dashboard', component: AdminDashboardComponent, canActivate: [authGuard],children: [
      { path: 'users', component: UsersComponent },
      { path: 'edituser/:id', component: EdituserComponent },
      {path:'rooms',component:RoomListComponent},
      {path:'roomservice',component:StaffListComponent},
      { path: 'rooms/add', component: AddRoomComponent },
      {path:'roomcard',component:RoomCardComponent},
      { path: 'feedback', component: FeedbackComponent },
      {path:'roomstatus',component:RoomStatusComponent},
      {path:'bookedrooms',component:BookedRoomsComponent},
      { path: '', redirectTo: 'userroom', pathMatch: 'full' },
      {path:'payments',component:PaymentComponent},
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  {path:'userdashboard',component:UserDashboardComponent,canActivate: [authGuard],children:[
    {path:'userroom',component:UserRoomsComponent},
    {path:'roomstatus',component:RoomStatusComponent},
    {path:'bookedrooms',component:BookedRoomsComponent}
    
  ]},
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
