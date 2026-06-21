# Employee Management System (EMS)

A full-stack **Employee Management System** developed using **Angular**, **ASP.NET Core Web API**, and **PostgreSQL** to streamline employee management, attendance tracking, leave handling, payroll, and administrative operations.

---

## Project Overview

The Employee Management System is designed to simplify HR and administrative tasks by providing a centralized platform for managing employees, attendance, departments, announcements, payroll, and reports.

This system supports multiple user roles such as:

- Admin
- HR
- Employee

Each role has dedicated access and functionalities based on authorization.

---

## Tech Stack

### Frontend
- Angular
- TypeScript
- HTML
- CSS

### Backend
- ASP.NET Core Web API
- C#

### Database
- PostgreSQL

### Tools Used
- VS Code
- Visual Studio
- Git
- GitHub
- Swagger API

---

## Key Features

### Authentication & Authorization
- Secure Login
- Role-based access control
- Change Password

### Employee Management
- Add Employee
- Update Employee Details
- Delete Employee
- Employee Profile Management

### Department Management
- Add Departments
- View Departments
- Manage Department Data

### Attendance Management
- Login Time Tracking
- Logoff Time Tracking
- Attendance Monitoring
- Attendance Approval

### Leave Management
- Apply Leave
- Approve / Reject Leave Requests
- Track Leave Status

### Payroll Management
- Salary Details
- Payroll Tracking
- Employee Salary View

### Announcements
- Admin announcements
- Employee notifications

### Reports
- Attendance Reports
- Employee Reports
- Leave Reports

---

## Architecture Diagram

```text
User
   ↓
Angular Frontend
   ↓
ASP.NET Core Web API
   ↓
Entity Framework Core
   ↓
PostgreSQL Database
```

---

## Screenshots

### Login Page

<img width="1887" height="872" alt="Screenshot 2026-06-21 162138" src="https://github.com/user-attachments/assets/0736f694-003a-4ab1-bdbd-0a9ebb79b454" />


### Admin Dashboard

<img width="1893" height="873" alt="Screenshot 2026-06-21 162205" src="https://github.com/user-attachments/assets/56bd6bc1-6f25-4764-959e-0231e1c6ab08" />

### HR Dashboard

<img width="1890" height="851" alt="Screenshot 2026-06-21 163246" src="https://github.com/user-attachments/assets/5b50ac83-c92b-41f5-9196-3e4c63486d40" />

### Employee Dashboard

<img width="1890" height="862" alt="Screenshot 2026-06-21 164001" src="https://github.com/user-attachments/assets/58607007-7d1f-4a0b-8710-1a73568f9e42" />


### Attendance Management

IN ADMIN DASHBOARD:
<img width="1892" height="855" alt="Screenshot 2026-06-21 162455" src="https://github.com/user-attachments/assets/372a8f0a-0b35-4a0b-91cf-8ac4bdd321dc" />

IN HR DASHBOARD:
<img width="1891" height="862" alt="Screenshot 2026-06-21 163459" src="https://github.com/user-attachments/assets/9e631dcf-439a-4e89-8834-d11ff67af847" />

IN Employee DASHBOARD:
<img width="1892" height="856" alt="Screenshot 2026-06-21 164140" src="https://github.com/user-attachments/assets/97d47df4-3094-4375-a70f-41aeb38d8aaa" />



### Leave Management

IN ADMIN DASHBOARD:
<img width="1888" height="857" alt="Screenshot 2026-06-21 162548" src="https://github.com/user-attachments/assets/0cca5488-e655-4b9c-bf85-8b3e9a250b13" />

IN HR DASHBOARD:
<img width="1901" height="862" alt="Screenshot 2026-06-21 163648" src="https://github.com/user-attachments/assets/87a80a67-1cfa-4f89-9a6e-12ad1390203f" />

IN Employee DASHBOARD:
<img width="1895" height="852" alt="Screenshot 2026-06-21 164215" src="https://github.com/user-attachments/assets/f0151aa7-c5de-4751-9308-96e3ab81f52a" />


### Reports Dashboard

IN ADMIN DASHBOARD:
<img width="1885" height="866" alt="Screenshot 2026-06-21 162634" src="https://github.com/user-attachments/assets/e29b1d1c-6263-46b0-bdb0-7309dc48fe46" />

IN HR DASHBOARD:
<img width="1895" height="845" alt="image" src="https://github.com/user-attachments/assets/9d3a3516-d1dd-4b5e-bc35-d33f7278715c" />

### salary Dashboard
IN Employee DASHBOARD:
<img width="1906" height="860" alt="Screenshot 2026-06-21 164402" src="https://github.com/user-attachments/assets/4c3a054b-05d7-4d77-85c7-3d76ba779155" />



---

## API Testing

API endpoints were tested using:
- Swagger API
<img width="1890" height="872" alt="Screenshot 2026-06-21 162719" src="https://github.com/user-attachments/assets/67e96e66-c969-41e0-b974-27429e6219c4" />


<img width="1883" height="857" alt="Screenshot 2026-06-21 162739" src="https://github.com/user-attachments/assets/96dd41d7-7fb5-4519-ae33-adb72f96ce7f" />

-Testing sample screenshots

<img width="1882" height="865" alt="Screenshot 2026-06-21 162921" src="https://github.com/user-attachments/assets/ab5b1672-b52e-46de-b96b-359934cab6ad" />

---

## Installation Steps

### Clone Repository
```bash
git clone https://github.com/Vedhavarshini-R/EmployeeManagementSystem.git
```

### Frontend Setup
```bash
cd frontend/ems-frontend
npm install
ng serve
```

### Backend Setup
```bash
cd backend/EMS.API
dotnet restore
dotnet run
```

---

## Future Enhancements
- Email Notifications
- Mobile App Integration
- Advanced Analytics Dashboard
- Performance Optimization

---

## Author

**Vedhavarshini R**

Aspiring Software Developer passionate about building full-stack applications using modern technologies.
