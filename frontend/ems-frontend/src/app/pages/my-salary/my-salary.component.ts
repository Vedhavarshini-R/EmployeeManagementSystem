import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { EmployeeService }  from '../../services/employee.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-my-salary',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './my-salary.component.html',
  styleUrls: ['./my-salary.component.css']
})
export class MySalaryComponent implements OnInit {

  salaryData: any = {};
  currentMonth = '';
  downloading  = false;
  toastMsg     = '';

  /* ── Computed salary components ── */
  get basicSalary(): number { return Math.round((this.salaryData.salary || 0) * 0.40); }
  get hra():         number { return Math.round((this.salaryData.salary || 0) * 0.20); }
  get transport():   number { return Math.round((this.salaryData.salary || 0) * 0.10); }
  get special():     number {
    return (this.salaryData.salary || 0) - this.basicSalary - this.hra - this.transport;
  }

  get pf():       number { return Math.round(this.basicSalary * 0.12); }
  get profTax():  number { return 200; }
  get tds():      number { return Math.round((this.salaryData.salary || 0) * 0.05); }
  get esi():      number { return Math.round((this.salaryData.salary || 0) * 0.0075); }

  get totalDeductions(): number { return this.pf + this.profTax + this.tds + this.esi; }
  get netSalary():       number { return (this.salaryData.salary || 0) - this.totalDeductions; }
  get deductionPercent():number { return Math.round((this.totalDeductions / (this.salaryData.salary || 1)) * 100); }
  get netPercent():      number { return Math.round((this.netSalary / (this.salaryData.salary || 1)) * 100); }

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const username = localStorage.getItem('username');
    if (username) {
      this.employeeService.getSalaryByUsername(username).subscribe({
        next: (data: any) => { this.salaryData = data; }
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  }

  downloadPayslip(): void {
    this.downloading = true;
    const doc  = new jsPDF();
    const name = this.salaryData.fullName || 'Employee';

    // ── Header bar ──
    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SALARY PAYSLIP', 14, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pay Period: ${this.currentMonth}`, 14, 22);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    // ── Employee info ──
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(name, 14, 44);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${this.salaryData.designation || ''} · ${this.salaryData.department || ''}`, 14, 51);

    // ── Earnings table ──
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 14, 64);

    autoTable(doc, {
      startY: 68,
      head: [['Component', 'Amount (₹)']],
      body: [
        ['Basic Salary',       `₹${this.basicSalary.toLocaleString()}`],
        ['House Rent Allowance',`₹${this.hra.toLocaleString()}`],
        ['Transport Allowance', `₹${this.transport.toLocaleString()}`],
        ['Special Allowance',   `₹${this.special.toLocaleString()}`],
        ['Gross Earnings',      `₹${(this.salaryData.salary || 0).toLocaleString()}`],
      ],
      headStyles:  { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold' },
      bodyStyles:  { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
    });

    const afterEarnings = (doc as any).lastAutoTable.finalY + 10;

    // ── Deductions table ──
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DEDUCTIONS', 14, afterEarnings);

    autoTable(doc, {
      startY: afterEarnings + 4,
      head: [['Component', 'Amount (₹)']],
      body: [
        ['Provident Fund (12%)', `₹${this.pf.toLocaleString()}`],
        ['Professional Tax',     `₹${this.profTax.toLocaleString()}`],
        ['Income Tax (TDS 5%)',  `₹${this.tds.toLocaleString()}`],
        ['ESI (0.75%)',          `₹${this.esi.toLocaleString()}`],
        ['Total Deductions',     `₹${this.totalDeductions.toLocaleString()}`],
      ],
      headStyles:  { fillColor: [185, 28, 28], textColor: 255, fontStyle: 'bold' },
      bodyStyles:  { fontSize: 9 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
    });

    const afterDeductions = (doc as any).lastAutoTable.finalY + 10;

    // ── Net pay box ──
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(14, afterDeductions, 182, 22, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('NET TAKE HOME SALARY', 20, afterDeductions + 10);
    doc.setFontSize(13);
    doc.text(`₹${this.netSalary.toLocaleString()}`, 196 - doc.getTextWidth(`₹${this.netSalary.toLocaleString()}`), afterDeductions + 15);

    // ── Footer ──
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a system-generated payslip. No signature required.', 14, 285);

    doc.save(`Payslip_${name.replace(/\s+/g, '_')}_${this.currentMonth.replace(/\s+/g, '_')}.pdf`);

    setTimeout(() => {
      this.downloading = false;
      this.showToast('Payslip downloaded successfully!');
    }, 600);
  }

  private showToast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => { this.toastMsg = ''; }, 3000);
  }
}