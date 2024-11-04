import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardData } from 'models/admin-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:3000/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(this.apiUrl);
  }
}