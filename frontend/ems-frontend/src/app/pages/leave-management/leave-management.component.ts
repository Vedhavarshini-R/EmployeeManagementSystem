import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {

  leaves:         any[] = [];
  filteredLeaves: any[] = [];

  role         = '';
  activeFilter = 'All';
  drawerOpen   = false;
  isSaving     = false;
  processingId: number | null = null;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  leave = this.emptyLeave();

  private avatarColors: Record<string, string> = {};
  private colorPalette = [
    '#3b82f6','#8b5cf6','#10b981','#f59e0b',
    '#ef4444','#06b6d4','#ec4899','#6366f1'
  ];

  get pendingCount()  { return this.leaves.filter(l => l.status === 'Pending').length;  }
  get approvedCount() { return this.leaves.filter(l => l.status === 'Approved').length; }
  get rejectedCount() { return this.leaves.filter(l => l.status === 'Rejected').length; }

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.loadLeaves();
  }

  private emptyLeave() {
    return { employeeName: '', leaveType: '', fromDate: '', toDate: '', reason: '' };
  }

  loadLeaves(): void {
    this.leaveService.getLeaves().subscribe({
      next: (data: any[]) => {
        this.leaves = data;
        this.applyFilter();
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredLeaves = this.activeFilter === 'All'
      ? [...this.leaves]
      : this.leaves.filter(l => l.status === this.activeFilter);
  }

  openDrawer(): void  { this.leave = this.emptyLeave(); this.toastMsg = ''; this.drawerOpen = true; }
  closeDrawer(): void { this.drawerOpen = false; this.toastMsg = ''; }

  applyLeave(): void {
    if (!this.leave.employeeName.trim() || !this.leave.leaveType ||
        !this.leave.fromDate || !this.leave.toDate || !this.leave.reason.trim()) {
      this.showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (new Date(this.leave.toDate) < new Date(this.leave.fromDate)) {
      this.showToast('To date cannot be before from date.', 'error');
      return;
    }

    this.isSaving = true;
    this.leaveService.applyLeave(this.leave).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Leave request submitted successfully!', 'success');
        this.leave = this.emptyLeave();
        this.loadLeaves();
        setTimeout(() => this.closeDrawer(), 1400);
      },
      error: () => {
        this.isSaving = false;
        this.showToast('Failed to submit request. Please try again.', 'error');
      }
    });
  }

  approve(id: number): void {
    this.processingId = id;
    this.leaveService.approveLeave(id).subscribe({
      next: () => { this.processingId = null; this.loadLeaves(); }
    });
  }

  reject(id: number): void {
    this.processingId = id;
    this.leaveService.rejectLeave(id).subscribe({
      next: () => { this.processingId = null; this.loadLeaves(); }
    });
  }

  /* ── Helpers ── */
  getDays(from: string, to: string): number {
    if (!from || !to) return 0;
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getAvatarColor(name: string): string {
    if (!this.avatarColors[name]) {
      const idx = Object.keys(this.avatarColors).length % this.colorPalette.length;
      this.avatarColors[name] = this.colorPalette[idx];
    }
    return this.avatarColors[name];
  }

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      'Casual Leave': 'type-badge type-casual',
      'Sick Leave':   'type-badge type-sick',
      'Earned Leave': 'type-badge type-earned'
    };
    return map[type] ?? 'type-badge type-casual';
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    if (type === 'success') { setTimeout(() => { this.toastMsg = ''; }, 3000); }
  }
}