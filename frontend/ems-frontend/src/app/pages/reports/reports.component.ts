import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { EmployeeService }   from '../../services/employee.service';
import { LeaveService }      from '../../services/leave.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  generatingPdf:   string = '';
  generatingExcel: string = '';
  downloadingAll      = false;
  downloadingAllExcel = false;
  progressWidth    = 0;
  toastMsg         = '';

  downloadLog: { name: string; time: string; type: 'pdf' | 'excel' }[] = [];

  constructor(
    private employeeService:   EmployeeService,
    private leaveService:      LeaveService,
    private attendanceService: AttendanceService
  ) {}

  /* ─── PDF REPORTS ─────────────────────────────────── */

  generateEmployeeReport(): void {
    this.startProgress('employee', 'pdf');
    this.employeeService.getEmployees().subscribe({
      next: (employees: any[]) => {
        const doc = new jsPDF();
        this.stylePdfHeader(doc, 'Employee Report');
        autoTable(doc, {
          startY: 38,
          head: [['ID', 'Name', 'Department', 'Designation', 'Email']],
          body: employees.map(e => [e.id, e.fullName, e.department, e.designation, e.email]),
          ...this.tableStyles()
        });
        doc.save('EmployeeReport.pdf');
        this.endProgress('pdf', 'EmployeeReport.pdf');
      }
    });
  }

  generateLeaveReport(): void {
    this.startProgress('leave', 'pdf');
    this.leaveService.getLeaves().subscribe({
      next: (leaves: any[]) => {
        const doc = new jsPDF();
        this.stylePdfHeader(doc, 'Leave Report');
        autoTable(doc, {
          startY: 38,
          head: [['ID', 'Employee', 'Type', 'From', 'To', 'Status']],
          body: leaves.map(l => [
            l.id, l.employeeName, l.leaveType,
            l.fromDate?.substring(0, 10),
            l.toDate?.substring(0, 10),
            l.status
          ]),
          ...this.tableStyles()
        });
        doc.save('LeaveReport.pdf');
        this.endProgress('pdf', 'LeaveReport.pdf');
      }
    });
  }

  generateAttendanceReport(): void {
    this.startProgress('attendance', 'pdf');
    this.attendanceService.getAttendance().subscribe({
      next: (attendance: any[]) => {
        const doc = new jsPDF();
        this.stylePdfHeader(doc, 'Attendance Report');
        autoTable(doc, {
          startY: 38,
          head: [['ID', 'Employee', 'Date', 'Status']],
          body: attendance.map(a => [a.id, a.employeeName, a.date?.substring(0, 10), a.status]),
          ...this.tableStyles()
        });
        doc.save('AttendanceReport.pdf');
        this.endProgress('pdf', 'AttendanceReport.pdf');
      }
    });
  }

  generatePayrollReport(): void {
    this.startProgress('payroll', 'pdf');
    this.employeeService.getEmployees().subscribe({
      next: (employees: any[]) => {
        const doc = new jsPDF();
        this.stylePdfHeader(doc, 'Payroll Report');
        autoTable(doc, {
          startY: 38,
          head: [['ID', 'Employee', 'Department', 'Designation', 'Salary (₹)']],
          body: employees.map(e => [e.id, e.fullName, e.department, e.designation, e.salary?.toLocaleString()]),
          ...this.tableStyles()
        });
        doc.save('PayrollReport.pdf');
        this.endProgress('pdf', 'PayrollReport.pdf');
      }
    });
  }

  downloadAllReports(): void {
    this.downloadingAll = true;
    const delays = [0, 1200, 2400, 3600];
    const fns = [
      () => this.generateEmployeeReport(),
      () => this.generateLeaveReport(),
      () => this.generateAttendanceReport(),
      () => this.generatePayrollReport()
    ];
    fns.forEach((fn, i) => setTimeout(fn, delays[i]));
    setTimeout(() => {
      this.downloadingAll = false;
      this.showToast('All 4 PDF reports downloaded!');
    }, 5000);
  }

  downloadAllExcel(): void {
    this.downloadingAllExcel = true;
    const delays = [0, 1200, 2400, 3600];
    const fns = [
      () => this.exportEmployees(),
      () => this.exportLeaves(),
      () => this.exportAttendance(),
      () => this.exportPayroll()
    ];
    fns.forEach((fn, i) => setTimeout(fn, delays[i]));
    setTimeout(() => {
      this.downloadingAllExcel = false;
      this.showToast('All 4 Excel exports downloaded!');
    }, 5000);
  }

  /* ─── EXCEL EXPORTS ───────────────────────────────── */

  exportEmployees(): void {
    this.startProgress('employee', 'excel');
    this.employeeService.getEmployees().subscribe({
      next: (data: any[]) => {
        this.saveExcel(data, 'Employees', 'Employees.xlsx');
        this.endProgress('excel', 'Employees.xlsx');
      }
    });
  }

  exportLeaves(): void {
    this.startProgress('leave', 'excel');
    this.leaveService.getLeaves().subscribe({
      next: (data: any[]) => {
        this.saveExcel(data, 'Leaves', 'LeaveReport.xlsx');
        this.endProgress('excel', 'LeaveReport.xlsx');
      }
    });
  }

  exportAttendance(): void {
    this.startProgress('attendance', 'excel');
    this.attendanceService.getAttendance().subscribe({
      next: (data: any[]) => {
        this.saveExcel(data, 'Attendance', 'AttendanceReport.xlsx');
        this.endProgress('excel', 'AttendanceReport.xlsx');
      }
    });
  }

  exportPayroll(): void {
    this.startProgress('payroll', 'excel');
    this.employeeService.getEmployees().subscribe({
      next: (data: any[]) => {
        this.saveExcel(data, 'Payroll', 'PayrollReport.xlsx');
        this.endProgress('excel', 'PayrollReport.xlsx');
      }
    });
  }

  /* ─── HELPERS ─────────────────────────────────────── */

  private saveExcel(data: any[], sheet: string, filename: string): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      filename
    );
  }

  private stylePdfHeader(doc: jsPDF, title: string): void {
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
    doc.setTextColor(0, 0, 0);
  }

  private tableStyles() {
    return {
      headStyles: { fillColor: [37, 99, 235] as [number, number, number], textColor: 255, fontStyle: 'bold' as const },
      alternateRowStyles: { fillColor: [248, 250, 255] as [number, number, number] },
      styles: { fontSize: 9, cellPadding: 4 }
    };
  }

  private startProgress(key: string, type: 'pdf' | 'excel'): void {
    this.progressWidth = 0;
    if (type === 'pdf')   this.generatingPdf   = key;
    else                  this.generatingExcel = key;

    // Animate progress to 85% while API loads
    const interval = setInterval(() => {
      if (this.progressWidth < 85) this.progressWidth += 5;
      else clearInterval(interval);
    }, 80);
  }

  private endProgress(type: 'pdf' | 'excel', filename: string): void {
    this.progressWidth = 100;
    setTimeout(() => {
      if (type === 'pdf')  this.generatingPdf   = '';
      else                 this.generatingExcel = '';
      this.progressWidth = 0;
    }, 400);

    // Add to download log
    this.downloadLog.unshift({
      name: filename,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: type === 'pdf' ? 'pdf' : 'excel'
    });
    if (this.downloadLog.length > 8) this.downloadLog.pop();

    this.showToast(`${filename} downloaded successfully!`);
  }

  private showToast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => { this.toastMsg = ''; }, 3000);
  }
}