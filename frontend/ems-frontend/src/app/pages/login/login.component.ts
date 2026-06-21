import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username     = '';
  password     = '';
  selectedRole = '';
  hidePassword = true;
  isLoading    = false;
  errorMsg     = '';
  year         = new Date().getFullYear();
  rememberMe   = false;

  userFocused  = false;
  passFocused  = false;

  @ViewChild('formCard') formCard!: ElementRef<HTMLDivElement>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /* ── Subtle 3-D tilt on mouse move ── */
  onMouseMove(event: MouseEvent): void {
    if (!this.formCard) return;
    const el   = this.formCard.nativeElement;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const nx   = (event.clientX - rect.left) / rect.width  * 2 - 1;
    const ny   = (event.clientY - rect.top)  / rect.height * 2 - 1;

    /* subtle ±4° tilt — professional, not gimmicky */
    const rx = -ny * 4;
    const ry =  nx * 4;

    el.style.transform  = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    el.style.transition = 'transform 0.10s ease';
    el.style.boxShadow  = `
      ${-ry * 2}px ${rx * 2}px 48px rgba(15,23,42,0.14),
      0 8px 24px rgba(59,130,246,0.10)
    `;
  }

  onMouseLeave(): void {
    if (!this.formCard) return;
    const el = this.formCard.nativeElement;
    el.style.transform  = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
    el.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    el.style.boxShadow  = '';
  }

  /* ── Login ── */
  login(): void {
    this.errorMsg = '';

    if (!this.selectedRole) {
      this.errorMsg = 'Please select a role to continue.'; return;
    }
    if (!this.username.trim()) {
      this.errorMsg = 'Username is required.'; return;
    }
    if (!this.password.trim()) {
      this.errorMsg = 'Password is required.'; return;
    }

    this.isLoading = true;

    this.authService.login({ username: this.username.trim(), password: this.password })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;

          if (res.role !== this.selectedRole) {
            this.errorMsg = 'Selected role does not match your account.'; return;
          }

          localStorage.setItem('token',    res.token);
          localStorage.setItem('role',     res.role);
          localStorage.setItem('username', res.username ?? this.username);
          if (res.employeeName) localStorage.setItem('employeeName', res.employeeName);
          if (this.rememberMe)  localStorage.setItem('rememberMe', 'true');

          const routes: Record<string, string> = {
            ADMIN:    '/admin',
            HR:       '/hr',
            EMPLOYEE: '/employee'
          };
          this.router.navigate([routes[res.role] ?? '/login']);
        },
        error: () => {
          this.isLoading = false;
          this.errorMsg  = 'Incorrect username or password.';
        }
      });
  }
}