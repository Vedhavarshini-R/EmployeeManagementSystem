import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './pages/hr-dashboard/hr-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { LeaveManagementComponent } from './pages/leave-management/leave-management.component';
import { AttendanceManagementComponent } from './pages/attendance-management/attendance-management.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { hrGuard } from './guards/hr.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { PayrollManagementComponent } from './pages/payroll-management/payroll-management.component';
import { MySalaryComponent } from './pages/my-salary/my-salary.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'hr',
    component: HrDashboardComponent,
    canActivate: [authGuard, hrGuard]
  },

  {
    path: 'employee',
    component: EmployeeDashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'departments',
    component: DepartmentsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'leave-management',
    component: LeaveManagementComponent,
    canActivate: [authGuard]
  },

  {
    path: 'attendance-management',
    component: AttendanceManagementComponent,
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
  path: 'payroll-management',
  component: PayrollManagementComponent,
  canActivate: [authGuard]
},
{
  path: 'my-salary',
  component: MySalaryComponent,
  canActivate: [authGuard]
},
{
  path: 'reports',
  component: ReportsComponent,
  canActivate: [authGuard]
},
{
  path: 'change-password',
  component: ChangePasswordComponent,
  canActivate: [authGuard]
},
{
  path: 'announcements',
  component: AnnouncementsComponent,
  canActivate: [authGuard]
},
  {
    path: '**',
    redirectTo: 'login'
  }

];