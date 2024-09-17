import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Define the admin email
const ADMIN_EMAIL = 'admin123@gmail.com';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userEmail = sessionStorage.getItem("userEmail");

  // If user is logged in
  if (userEmail) {
    // Allow access to admin routes only if the user is the admin
    if (route.url[0]?.path === 'dashboard' && userEmail !== ADMIN_EMAIL) {
      // router.navigate(['/access-denied']); // Redirect to an access-denied page
      return false;
    }
    return true;
  }

  // Redirect to login if not logged in
  router.navigate(['/login']); // Redirect to login page
  return false;
};

