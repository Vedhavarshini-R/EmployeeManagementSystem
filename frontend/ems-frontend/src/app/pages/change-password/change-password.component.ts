import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private employeeService: EmployeeService
  ) { }

  changePassword() {

    if (this.newPassword !== this.confirmPassword) {

      alert('Passwords do not match');

      return;
    }

    const data = {

      username: localStorage.getItem('username'),

      currentPassword: this.currentPassword,

      newPassword: this.newPassword

    };

    this.employeeService
      .changePassword(data)
      .subscribe({

        next: () => {

          alert('Password Changed Successfully');

          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';

        },

        error: (err) => {

          alert(err.error);

        }

      });

  }

}