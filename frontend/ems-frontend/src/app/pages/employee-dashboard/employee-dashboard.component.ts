import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent }      from '../../layout/sidebar/sidebar.component';
import { AnnouncementService }   from '../../services/announcement.service';
import { AttendanceService }     from '../../services/attendance.service';
import { LeaveService }          from '../../services/leave.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  employeeName = '';
  today        = '';
  greeting     = '';

  isLoggedIn = false;

attendanceId = 0;

loginTime = '';

logOffTime = '';

workingHours = 0;
  // Attendance 
  presentDays    = 0;
  absentDays     = 0;
  presentPercent = 0;
  absentPercent  = 0;

  get attendanceRate(): number {
    const total = this.presentDays + this.absentDays;
    if (!total) return 0;
    return Math.round((this.presentDays / total) * 100);
  }

  // Leaves
  casualLeaves  = 0;
  sickLeaves    = 0;
  earnedLeaves  = 0;
  pendingLeaves = 0;

  // Announcements
  announcements: any[] = [];

  constructor(
    private announcementService: AnnouncementService,
    private attendanceService:   AttendanceService,
    private leaveService:        LeaveService
  ) {}

  ngOnInit(): void {
    this.employeeName = localStorage.getItem('employeeName') ||
                        localStorage.getItem('username') || 'Employee';

    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Good morning'
                  : hour < 17 ? 'Good afternoon'
                  : 'Good evening';

    this.loadAnnouncements();
    this.loadAttendance();
    this.loadLeaves();
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (data: any[]) => { this.announcements = data.slice(0, 3); }
    });
  }

  loadAttendance(): void {
    this.attendanceService.getAttendance().subscribe({
      next: (data: any[]) => {
        const name = this.employeeName.toLowerCase();
        const mine = data.filter((a: any) =>
          a.employeeName?.toLowerCase().includes(name)
        );
        this.presentDays = mine.filter((a: any) => a.status === 'Present').length;
        this.absentDays  = mine.filter((a: any) => a.status === 'Absent').length;
        const total = this.presentDays + this.absentDays || 1;
        this.presentPercent = Math.round((this.presentDays / total) * 100);
        this.absentPercent  = Math.round((this.absentDays  / total) * 100);
      }
    });
  }

  loadLeaves(): void {
    this.leaveService.getLeaves().subscribe({
      next: (data: any[]) => {
        const name = this.employeeName.toLowerCase();
        const mine = data.filter((l: any) =>
          l.employeeName?.toLowerCase().includes(name)
        );
        this.casualLeaves  = mine.filter((l: any) => l.leaveType === 'Casual Leave').length;
        this.sickLeaves    = mine.filter((l: any) => l.leaveType === 'Sick Leave').length;
        this.earnedLeaves  = mine.filter((l: any) => l.leaveType === 'Earned Leave').length;
        this.pendingLeaves = mine.filter((l: any) => l.status === 'Pending').length;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

login(): void {

  this.attendanceService
    .login(this.employeeName)
    .subscribe({
      next: (res: any) => {

        this.isLoggedIn = true;

        this.attendanceId = res.id;

        this.loginTime =
          new Date(res.loginTime)
          .toLocaleTimeString();

        alert('Login Successful');
      },

      error: () => {
        alert('Login Failed');
      }
    });
}
logoff(): void {

  let reason = '';

  reason = prompt(
    'Reason for early logoff (leave blank if completed full day):'
  ) || '';

  this.attendanceService
    .logoff(this.attendanceId, reason)
    .subscribe({

      next: (res: any) => {

        this.logOffTime =
          new Date(res.logOffTime)
          .toLocaleTimeString();

        this.workingHours =
          res.workingHours;

        this.isLoggedIn = false;

        alert(
          'Logged Off Successfully\n' +
          'Working Hours: ' +
          this.workingHours.toFixed(2)
        );
      },

      error: () => {
        alert('Log Off Failed');
      }
    });
}
}