import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './payroll-management.component.html',
  styleUrls: ['./payroll-management.component.css']
})
export class PayrollManagementComponent implements OnInit {

  employees:         any[] = [];
  filteredEmployees: any[] = [];
  departments:       string[] = [];

  searchText = '';
  filterDept = '';
  today      = '';

  savingId:   number | null = null;
  updatedIds: Set<number>   = new Set();

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  private avatarColors = [
    '#3b82f6','#8b5cf6','#10b981','#f59e0b',
    '#ef4444','#06b6d4','#ec4899','#6366f1'
  ];

  get totalPayroll(): number {
    return this.employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  }

  get avgSalary(): number {
    if (!this.employees.length) return 0;
    return Math.round(this.totalPayroll / this.employees.length);
  }

  get departmentCount(): number {
    return this.departments.length;
  }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: any[]) => {
        // Keep originalSalary for dirty-state tracking
        this.employees = data.map(e => ({ ...e, originalSalary: e.salary }));
        this.departments = [...new Set(data.map(e => e.department).filter(Boolean))];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    const q = this.searchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => {
      const matchSearch = !q ||
        emp.fullName?.toLowerCase().includes(q) ||
        emp.designation?.toLowerCase().includes(q);
      const matchDept = !this.filterDept || emp.department === this.filterDept;
      return matchSearch && matchDept;
    });
  }

  updateSalary(employee: any): void {
    if (employee.salary === employee.originalSalary) return;

    this.savingId = employee.id;

    this.employeeService.updateEmployee(employee.id, employee).subscribe({
      next: () => {
        this.savingId = null;
        employee.originalSalary = employee.salary;
        this.updatedIds.add(employee.id);
        this.showToast(`Salary updated for ${employee.fullName}`, 'success');

        // Clear the "Saved" state after 3s
        setTimeout(() => { this.updatedIds.delete(employee.id); }, 3000);
      },
      error: () => {
        this.savingId = null;
        this.showToast('Failed to update salary. Please try again.', 'error');
      }
    });
  }

  resetSalary(employee: any): void {
    employee.salary = employee.originalSalary;
  }

  /* ── Helpers ── */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    setTimeout(() => { this.toastMsg = ''; }, 3000);
  }
}