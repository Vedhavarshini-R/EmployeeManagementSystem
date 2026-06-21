import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './attendance-management.component.html',
  styleUrls: ['./attendance-management.component.css']
})
export class AttendanceManagementComponent implements OnInit {
  userRole = '';
employeeName = '';

  attendanceList:     any[] = [];
  filteredAttendance: any[] = [];

  

  searchText   = '';
  statusFilter = 'All';
  drawerOpen   = false;
  isSaving     = false;

  deleteModalOpen = false;
  recordToDelete: any = null;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  attendance = this.emptyForm();

  private avatarColors = [
    '#3b82f6','#8b5cf6','#10b981','#f59e0b',
    '#ef4444','#06b6d4','#ec4899','#6366f1'
  ];

  get presentCount():    number { return this.attendanceList.filter(a => a.status === 'Present').length; }
  get absentCount():     number { return this.attendanceList.filter(a => a.status === 'Absent').length;  }
  get attendanceRate():  number {
    if (!this.attendanceList.length) return 0;
    return Math.round((this.presentCount / this.attendanceList.length) * 100);
  }

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {

  this.userRole =
    localStorage.getItem('role') || '';

  this.employeeName =
    localStorage.getItem('employeeName') ||
    localStorage.getItem('username') ||
    '';

  this.loadAttendance();
}

  private emptyForm() {
    return {
      employeeName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present'
    };
  }

loadAttendance(): void {

  this.attendanceService.getAttendance().subscribe({
    next: (data: any[]) => {

      console.log('Role:', this.userRole);
      console.log('Employee from LocalStorage:', this.employeeName);
      console.log('Attendance Data:', data);

      if (this.userRole === 'EMPLOYEE') {

        this.attendanceList = data.filter(
          (x: any) =>
            x.employeeName?.trim().toLowerCase() ===
            this.employeeName.trim().toLowerCase()
        );

      } else {

        this.attendanceList = data;

      }

      this.attendanceList.forEach((x: any) => {
  console.log(
    'ID:',
    x.id,
    'Name:',
    x.employeeName,
    'Date:',
    x.date
  );
});

      this.applyFilters();
    },
    error: (err) => {
      console.error(err);
    }
  });

}

  applyFilters(): void {
    const q = this.searchText.toLowerCase();
    this.filteredAttendance = this.attendanceList.filter(item => {
      const matchSearch = !q || item.employeeName?.toLowerCase().includes(q);
      const matchStatus = this.statusFilter === 'All' || item.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  openDrawer(): void  { this.attendance = this.emptyForm(); this.toastMsg = ''; this.drawerOpen = true; }
  closeDrawer(): void { this.drawerOpen = false; this.toastMsg = ''; }

  markAttendance(): void {
    if (!this.attendance.employeeName.trim()) {
      this.showToast('Employee name is required.', 'error');
      return;
    }
    if (!this.attendance.date) {
      this.showToast('Please select a date.', 'error');
      return;
    }

    this.isSaving = true;
    this.attendanceService.markAttendance(this.attendance).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Attendance marked successfully!', 'success');
        this.attendance = this.emptyForm();
        this.loadAttendance();
        setTimeout(() => this.closeDrawer(), 1400);
      },
      error: () => {
        this.isSaving = false;
        this.showToast('Failed to mark attendance. Please try again.', 'error');
      }
    });
  }

  confirmDelete(record: any): void {
    this.recordToDelete = record;
    this.deleteModalOpen = true;
  }

  deleteAttendance(): void {
    if (!this.recordToDelete) return;
    this.attendanceService.deleteAttendance(this.recordToDelete.id).subscribe({
      next: () => {
        this.deleteModalOpen = false;
        this.recordToDelete  = null;
        this.loadAttendance();
      }
    });
  }

 approveAttendance(
  id: number,
  reason: string
): void {

  this.attendanceService
    .approveAttendance(id, reason)
    .subscribe({

      next: () => {

        alert('Approved');

        this.loadAttendance();
      }
    });
}

rejectAttendance(
  id: number
): void {

  this.attendanceService
    .rejectAttendance(id)
    .subscribe({

      next: () => {

        alert('Marked as Absent');

        this.loadAttendance();
      }
    });
}
    updateStatus(item: any): void {

  this.attendanceService
    .approveAttendance(
      item.id,
      item.adminDecision
    )
    .subscribe({

      next: () => {

        alert('Status Updated');

        this.loadAttendance();
      }
    });
}

  /* ── Helpers ── */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    if (type === 'success') { setTimeout(() => { this.toastMsg = ''; }, 3000); }
  }
}