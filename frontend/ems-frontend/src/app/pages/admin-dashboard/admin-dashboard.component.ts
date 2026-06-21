import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { LeaveService } from '../../services/leave.service';
import { AttendanceService } from '../../services/attendance.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  totalEmployees   = 0;
  totalDepartments = 0;
  pendingLeaves    = 0;
  attendanceCount  = 0;
  today            = '';

  private employeeChart:   Chart | null = null;
  private overviewChart:   Chart | null = null;
  private departmentChart: Chart | null = null;

  constructor(
    private employeeService:   EmployeeService,
    private departmentService: DepartmentService,
    private leaveService:      LeaveService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    this.loadCounts();
  }

  private loadCounts(): void {
    this.employeeService.getEmployeeCount().subscribe({
      next: (count: number) => {
        this.totalEmployees = count;
        this.refreshBarChart();
      }
    });

    this.departmentService.getDepartmentCount().subscribe({
      next: (count: number) => {
        this.totalDepartments = count;
        this.refreshBarChart();
      }
    });

    this.leaveService.getPendingCount().subscribe({
      next: (count: number) => {
        this.pendingLeaves = count;
        this.refreshDonutChart();
      }
    });

    this.attendanceService.getAttendanceCount().subscribe({
      next: (count: number) => {
        this.attendanceCount = count;
        this.refreshDonutChart();
      }
    });

    this.departmentService.getDepartments().subscribe({
      next: (departments: any[]) => {
        this.buildDepartmentChart(departments);
      }
    });
  }

  private refreshBarChart(): void {
    if (this.employeeChart) {
      this.employeeChart.data.datasets[0].data = [
        this.totalEmployees, this.totalDepartments
      ];
      this.employeeChart.update();
      return;
    }

    const canvas = document.getElementById('employeeChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.employeeChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Employees', 'Departments'],
        datasets: [{
          label: 'Count',
          data: [this.totalEmployees, this.totalDepartments],
          backgroundColor: ['rgba(59,130,246,0.85)', 'rgba(139,92,246,0.85)'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'DM Sans', size: 12 }, color: '#94a3b8' }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { font: { family: 'DM Sans', size: 12 }, color: '#94a3b8', stepSize: 1 }
          }
        }
      }
    });
  }

  private refreshDonutChart(): void {
    if (this.overviewChart) {
      this.overviewChart.data.datasets[0].data = [
        this.pendingLeaves, this.attendanceCount
      ];
      this.overviewChart.update();
      return;
    }

    const canvas = document.getElementById('overviewChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.overviewChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Pending Leaves', 'Attendance'],
        datasets: [{
          data: [this.pendingLeaves, this.attendanceCount],
          backgroundColor: ['rgba(245,158,11,0.85)', 'rgba(16,185,129,0.85)'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'DM Sans', size: 12 },
              color: '#64748b',
              padding: 16,
              boxWidth: 10,
              boxHeight: 10
            }
          }
        }
      }
    });
  }

  private buildDepartmentChart(departments: any[]): void {
    const canvas = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = departments.map((d: any) => d.departmentName);
    const colors = [
      'rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(245,158,11,0.8)',
      'rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)',  'rgba(6,182,212,0.8)'
    ];

    if (this.departmentChart) { this.departmentChart.destroy(); }

    this.departmentChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: departments.map(() => 1),
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { family: 'DM Sans', size: 11 },
              color: '#64748b',
              padding: 12,
              boxWidth: 10,
              boxHeight: 10
            }
          }
        }
      }
    });
  }
}