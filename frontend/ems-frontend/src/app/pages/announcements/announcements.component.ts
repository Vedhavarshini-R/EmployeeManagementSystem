import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  announcements:         any[] = [];
  filteredAnnouncements: any[] = [];

  activeFilter = 'All';
  drawerOpen   = false;
  isSaving     = false;
  isAdmin      = false;

  deleteModalOpen      = false;
  announcementToDelete: any = null;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  announcement = this.emptyForm();

  get urgentCount():    number { return this.announcements.filter(a => a.priority === 'Urgent').length;    }
  get importantCount(): number { return this.announcements.filter(a => a.priority === 'Important').length; }
  get generalCount():   number { return this.announcements.filter(a => !a.priority || a.priority === 'General').length; }

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    const role   = localStorage.getItem('role') || '';
    this.isAdmin = role === 'ADMIN' || role === 'HR';
    this.loadAnnouncements();
  }

  private emptyForm() {
    return { title: '', message: '', priority: 'General' };
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (data: any[]) => {
        this.announcements = data;
        this.applyFilter();
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'All') {
      this.filteredAnnouncements = [...this.announcements];
    } else {
      this.filteredAnnouncements = this.announcements.filter(a =>
        (a.priority || 'General') === this.activeFilter
      );
    }
  }

  openDrawer():  void { this.announcement = this.emptyForm(); this.toastMsg = ''; this.drawerOpen = true;  }
  closeDrawer(): void { this.drawerOpen = false; this.toastMsg = ''; }

  addAnnouncement(): void {
    if (!this.announcement.title.trim()) {
      this.showToast('Please enter a title.', 'error'); return;
    }
    if (!this.announcement.message.trim()) {
      this.showToast('Please enter a message.', 'error'); return;
    }

    this.isSaving = true;
    this.announcementService.addAnnouncement(this.announcement).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Announcement posted successfully!', 'success');
        this.announcement = this.emptyForm();
        this.loadAnnouncements();
        setTimeout(() => this.closeDrawer(), 1400);
      },
      error: () => {
        this.isSaving = false;
        this.showToast('Failed to post announcement. Try again.', 'error');
      }
    });
  }

  confirmDelete(item: any): void {
    this.announcementToDelete = item;
    this.deleteModalOpen      = true;
  }

  deleteAnnouncement(): void {
    if (!this.announcementToDelete) return;
    this.announcementService.deleteAnnouncement(this.announcementToDelete.id).subscribe({
      next: () => {
        this.deleteModalOpen      = false;
        this.announcementToDelete = null;
        this.loadAnnouncements();
      }
    });
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    if (type === 'success') { setTimeout(() => { this.toastMsg = ''; }, 3000); }
  }
}