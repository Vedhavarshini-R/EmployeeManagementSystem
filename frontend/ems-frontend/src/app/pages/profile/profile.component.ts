import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EmployeeService }  from '../../services/employee.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  employee:     any  = {};
  imageUrl      = '';
  selectedFile!: File;
  uploading     = false;

  toastMsg  = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (data: any) => {
          this.employee = data;
          if (this.employee.profileImage) {
            this.imageUrl = `https://localhost:7224/Uploads/${this.employee.profileImage}`;
          }
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.showToast('Only JPG, PNG or WEBP images are allowed.', 'error');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image must be smaller than 5MB.', 'error');
      return;
    }

    this.selectedFile = file;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (e: any) => { this.imageUrl = e.target.result; };
    reader.readAsDataURL(file);
  }

  uploadPhoto(): void {
    if (!this.selectedFile) {
      this.showToast('Please select a photo first.', 'error');
      return;
    }

    this.uploading = true;
    this.employeeService.uploadPhoto(this.employee.id, this.selectedFile).subscribe({
      next: (res: any) => {
        this.uploading = false;
        this.imageUrl  = `https://localhost:7224/Uploads/${res.image}`;
        this.selectedFile = null!;
        this.showToast('Profile photo updated successfully!', 'success');
      },
      error: () => {
        this.uploading = false;
        this.showToast('Upload failed. Please try again.', 'error');
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  private showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMsg  = msg;
    this.toastType = type;
    setTimeout(() => { this.toastMsg = ''; }, 3500);
  }
}