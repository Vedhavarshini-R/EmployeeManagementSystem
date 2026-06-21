import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'https://localhost:7224/api/Department';

  constructor(private http: HttpClient) { }

  getDepartments() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDepartment(department: any) {
    return this.http.post(this.apiUrl, department);
  }

  updateDepartment(id: number, department: any) {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDepartmentCount() {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}