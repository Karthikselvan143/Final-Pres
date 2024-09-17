import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from './environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
 export class AuthService {

//   constructor(private http: HttpClient) { }

//   userLogin(userObj: any) {
//     return this.http.post("http://localhost:5046/api/Users/Login", userObj).pipe(
      
//       map((resonse: any) => {
//         console.log(resonse);
//         if (resonse.access) {
//           console.log(resonse);
//           sessionStorage.setItem("access", resonse.access)
//         }
//         return resonse;
//       })
//     )
//   }
//   logOut() {
//     sessionStorage.clear()
//   }
private apiUrl = `${environment.apiUrl}/logout`;

constructor(private http: HttpClient,private router:Router) { }

logout(): Observable<any> {
  return this.http.post(this.apiUrl, {});
}

logoutAndRedirect() {
  this.logout().subscribe(() => {
    if(sessionStorage.getItem('authToken'))
    {
    sessionStorage.removeItem('authToken'); // Clear token from session storage
    }
    this.router.navigate(['/login']); // Redirect to login page
  });
}
}
