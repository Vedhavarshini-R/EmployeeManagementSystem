import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent {
}