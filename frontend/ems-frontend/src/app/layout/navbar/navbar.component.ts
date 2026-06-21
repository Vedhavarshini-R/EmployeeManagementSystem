import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role = '';
  constructor(
  private sidebarService: SidebarService
) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
  }
  toggleSidebar() {

  this.sidebarService.toggleSidebar();

}

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

}