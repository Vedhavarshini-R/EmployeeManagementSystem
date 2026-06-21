import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  alert('Please Login First');

  window.location.href = '/login';

  return false;
};