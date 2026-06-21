import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private apiUrl = 'https://localhost:7224/api/Announcement';

  constructor(private http: HttpClient) { }

  getAnnouncements() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addAnnouncement(announcement: any) {
    return this.http.post(this.apiUrl, announcement);
  }

  deleteAnnouncement(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}