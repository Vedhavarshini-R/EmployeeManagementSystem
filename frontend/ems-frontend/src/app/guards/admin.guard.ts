import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    return true;
  }

  alert('Access Denied');

  window.location.href = '/login';

  return false;
};