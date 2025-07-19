import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResult, Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiBaseUrl;

  getTasksByStatus(
    status: string,
    pageNumber: number,
    pageSize: number,
  ): Observable<{totalCount: number, items: Task[] }> {
    const params = new HttpParams()
      .set('status', status)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    var response =  this.http.get<{totalCount: number, items: Task[] }>(`${this.baseUrl}/TMS/GetTasksByStatus`, { params });
    return response;
  }

  add(task: Task): Observable<Task> {
    const result = this.http.post<Task>(`${this.baseUrl}/TMS`, task);
    return result;
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/TMS/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/TMS/${id}`);
  }
}
