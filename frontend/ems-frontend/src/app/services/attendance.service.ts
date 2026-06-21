import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7224/api/Attendance';

  constructor(private http: HttpClient) { }

  getAttendance() {
  return this.http.get<any[]>(
    'https://localhost:7224/api/Attendance'
  );
}

  markAttendance(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  deleteAttendance(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAttendanceCount() {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  login(employeeName: string) {
  return this.http.post(
    `${this.apiUrl}/login?employeeName=${employeeName}`,
    {}
  );
}

logoff(
  id: number,
  reason: string
) {
  return this.http.put(
    `${this.apiUrl}/logoff/${id}?reason=${encodeURIComponent(reason)}`,
    {}
  );
}
approveAttendance(
  id: number,
  reason: string
){
  return this.http.put(
    `${this.apiUrl}/approve/${id}?reason=${reason}`,
    {}
  );
}
rejectAttendance(id: number){
  return this.http.put(
    `${this.apiUrl}/reject/${id}`,
    {}
  );
}
}