import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  role           = '';
  displayName    = '';
  roleInitial    = '';
  roleBadgeClass = '';
  collapsed      = false;

  ngOnInit(): void {
    this.role        = localStorage.getItem('role') || '';
    this.displayName = localStorage.getItem('employeeName') ||
                       localStorage.getItem('username') || 'User';
    this.roleInitial = this.role.charAt(0).toUpperCase();

    const map: Record<string, string> = {
      ADMIN:    'badge-admin',
      HR:       'badge-hr',
      EMPLOYEE: 'badge-emp'
    };
    this.roleBadgeClass = map[this.role] ?? 'badge-emp';

    // Restore last state from localStorage
    this.collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    // Persist preference so it survives page navigation
    localStorage.setItem('sidebarCollapsed', String(this.collapsed));
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}