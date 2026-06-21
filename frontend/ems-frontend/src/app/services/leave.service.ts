import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'https://localhost:7224/api/LeaveRequest';

  constructor(private http: HttpClient) { }

  getLeaves() {
  return this.http.get<any[]>(
    'https://localhost:7224/api/LeaveRequest'
  );
}

  applyLeave(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  approveLeave(id: number) {
    return this.http.put(
      `${this.apiUrl}/approve/${id}`,
      {}
    );
  }

  rejectLeave(id: number) {
    return this.http.put(
      `${this.apiUrl}/reject/${id}`,
      {}
    );
  }

  deleteLeave(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  getPendingCount() {
    return this.http.get<number>(
      `${this.apiUrl}/count`
    );
  }
}