import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:7224/api/Employee';

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addEmployee(employee: any) {
    return this.http.post(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: any) {
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEmployeeCount() {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  updateSalary(id: number, employee: any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  getSalaryByUsername(username: string) {
    return this.http.get(
      `${this.apiUrl}/salary/${username}`
    );
  }

  getEmployeeByUsername(username: string) {
    return this.http.get(
      `${this.apiUrl}/username/${username}`
    );
  }

  uploadPhoto(id: number, file: File) {

  const formData = new FormData();

  formData.append('file', file);

  return this.http.post(
    `${this.apiUrl}/upload-photo/${id}`,
    formData
  );
}

changePassword(data: any) {
  return this.http.post(
    `${this.apiUrl}/change-password`,
    data
  );
}
}