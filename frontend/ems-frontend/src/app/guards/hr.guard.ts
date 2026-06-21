import { CanActivateFn } from '@angular/router';

export const hrGuard: CanActivateFn = () => {

  const role = localStorage.getItem('role');

  if (role === 'HR') {
    return true;
  }

  alert('Access Denied');

  window.location.href = '/login';

  return false;
};