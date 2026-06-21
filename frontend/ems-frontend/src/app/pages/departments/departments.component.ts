import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService }   from '../../services/employee.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  departments:         any[] = [];
  filteredDepartments: any[] = [];

  searchText  = '';
  drawerOpen  = false;
  isEditMode  = false;
  isSaving    = false;

  totalEmployees   = 0;
  previewColorIndex = 0;

  department         = { name: '' };
  selectedDepartment: any = null;

  deleteModalOpen = false;
  deptToDelete:   any = null;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  private colorPalette = [
    '#3b82f6','#8b5cf6','#10b981','#f59e0b',
    '#ef4444','#06b6d4','#ec4899','#6366f1',
    '#14b8a6','#f97316'
  ];

  get avgPerDept(): number {
    if (!this.departments.length) return 0;
    return Math.round(this.totalEmployees / this.departments.length);
  }

  constructor(
    private departmentService: DepartmentService,
    private employeeService:   EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployeeCount();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data: any[]) => {
        this.departments         = data;
        this.filteredDepartments = data;
      }
    });
  }

  loadEmployeeCount(): void {
    this.employeeService.getEmployeeCount().subscribe({
      next: (count: number) => { this.totalEmployees = count; }
    });
  }

  searchDepartment(): void {
    const q = this.searchText.toLowerCase();
    this.filteredDepartments = this.departments.filter(d =>
      d.name?.toLowerCase().includes(q)
    );
  }

  openAddDrawer(): void {
    this.isEditMode        = false;
    this.department        = { name: '' };
    this.previewColorIndex = this.departments.length % this.colorPalette.length;
    this.toastMsg          = '';
    this.drawerOpen        = true;
  }

  editDepartment(dep: any): void {
    this.isEditMode        = true;
    this.selectedDepartment = { ...dep };
    this.previewColorIndex  = this.filteredDepartments.indexOf(dep) % this.colorPalette.length;
    this.toastMsg           = '';
    this.drawerOpen         = true;
  }

  closeDrawer(): void { this.drawerOpen = false; this.toastMsg = ''; }

  addDepartment(): void {
    if (!this.department.name.trim()) {
      this.showToast('Department name is required.', 'error'); return;
    }
    this.isSaving = true;
    this.departmentService.addDepartment(this.department).subscribe({
      next: () => {
        this.isSaving   = false;
        this.department = { name: '' };
        this.showToast('Department added successfully!', 'success');
        this.loadDepartments();
        setTimeout(() => this.closeDrawer(), 1400);
      },
      error: () => { this.isSaving = false; this.showToast('Failed to add department.', 'error'); }
    });
  }

  updateDepartment(): void {
    if (!this.selectedDepartment?.name?.trim()) {
      this.showToast('Department name is required.', 'error'); return;
    }
    this.isSaving = true;
    this.departmentService.updateDepartment(this.selectedDepartment.id, this.selectedDepartment).subscribe({
      next: () => {
        this.isSaving = false;
        this.showToast('Department updated successfully!', 'success');
        this.loadDepartments();
        setTimeout(() => this.closeDrawer(), 1400);
      },
      error: () => { this.isSaving = false; this.showToast('Failed to update department.', 'error'); }
    });
  }

  confirmDelete(dep: any): void {
    this.deptToDelete   = dep;
    this.deleteModalOpen = true;
  }

  deleteDepartment(): void {
    if (!this.deptToDelete) return;
    this.departmentService.deleteDepartment(this.deptToDelete.id).subscribe({
      next: () => {
        this.deleteModalOpen = false;
        this.deptToDelete    = null;
        this.loadDepartments();
      }
    });
  }

  /* ── Helpers ── */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getColor(index: number): string {
    return this.colorPalette[index % this.colorPalette.length];
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    if (type === 'success') { setTimeout(() => { this.toastMsg = ''; }, 3000); }
  }
}