import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees:         any[] = [];
  filteredEmployees: any[] = [];
  departments:       string[] = [];

  searchText  = '';
  filterDept  = '';
  drawerOpen  = false;
  isEditMode  = false;
  isSaving    = false;

  deleteModalOpen  = false;
  employeeToDelete: any = null;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  employee: any = this.emptyForm();

  selectedEmployee: any = null;

  private avatarColors = [
    '#3b82f6','#8b5cf6','#10b981','#f59e0b',
    '#ef4444','#06b6d4','#ec4899','#6366f1'
  ];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void { this.loadEmployees(); }

  private emptyForm() {
    return { fullName: '', email: '', phone: '', department: '', designation: '', salary: 0 };
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: any[]) => {
        this.employees = data;
        this.departments = [...new Set(data.map((e: any) => e.department).filter(Boolean))];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    const q = this.searchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => {
      const matchSearch = !q ||
        emp.fullName?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.department?.toLowerCase().includes(q) ||
        emp.designation?.toLowerCase().includes(q);
      const matchDept = !this.filterDept || emp.department === this.filterDept;
      return matchSearch && matchDept;
    });
  }

  openAddDrawer(): void {
    this.isEditMode = false;
    this.employee   = this.emptyForm();
    this.toastMsg   = '';
    this.drawerOpen = true;
  }

  editEmployee(emp: any): void {
    this.isEditMode       = true;
    this.selectedEmployee = { ...emp };
    this.toastMsg         = '';
    this.drawerOpen       = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.toastMsg   = '';
  }

  addEmployee(): void {
    if (!this.employee.fullName.trim() || !this.employee.email.trim()) {
      this.showToast('Full name and email are required.', 'error');
      return;
    }

    this.isSaving = true;
    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Employee added successfully!', 'success');
        this.employee = this.emptyForm();
        this.loadEmployees();
        setTimeout(() => this.closeDrawer(), 1200);
      },
      error: () => {
        this.isSaving = false;
        this.showToast('Failed to add employee. Please try again.', 'error');
      }
    });
  }

  updateEmployee(): void {
    this.isSaving = true;
    this.employeeService.updateEmployee(this.selectedEmployee.id, this.selectedEmployee).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Employee updated successfully!', 'success');
        this.loadEmployees();
        setTimeout(() => this.closeDrawer(), 1200);
      },
      error: () => {
        this.isSaving = false;
        this.showToast('Update failed. Please try again.', 'error');
      }
    });
  }

  confirmDelete(emp: any): void {
    this.employeeToDelete = emp;
    this.deleteModalOpen  = true;
  }

  deleteEmployee(): void {
    if (!this.employeeToDelete) return;
    this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
      next: () => {
        this.deleteModalOpen  = false;
        this.employeeToDelete = null;
        this.loadEmployees();
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
    if (type === 'success') {
      setTimeout(() => { this.toastMsg = ''; }, 3000);
    }
  }
}