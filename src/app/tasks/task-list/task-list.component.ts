import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/task.service';
import { Task } from '../../models/task.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskPopupComponent } from '../task-popup/task-popup.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatPaginatorModule,
    TaskFormComponent,
  ],
  providers: [HttpClient],
})
export class TaskListComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  // paging state
  todoPage = 1;
  inProgressPage = 1;
  donePage = 1;
  pageSize = 5;
  totalCount = 0;

  todoTasksLastPage = 0;
  inProgressTaskLastPage = 0;
  donesLastTaskPage = 0;

  showForm = false;

  selectedTask: Task | null = null;
  showDetail = false;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loadTasks('To Do', this.todoPage, 'todoTasks');
    this.loadTasks('In Progress', this.inProgressPage, 'inProgressTasks');
    this.loadTasks('Done', this.donePage, 'doneTasks');
  }

  loadTasks(
    status: string,
    page: number,
    target: 'todoTasks' | 'inProgressTasks' | 'doneTasks'
  ) {
    this.taskService
      .getTasksByStatus(status, page, this.pageSize)
      .subscribe((res) => {
        this[target] = [...res.items];
        this.totalCount = res.totalCount;

        const lastPage = Math.ceil(this.totalCount / this.pageSize);
        switch (target) {
          case 'todoTasks':
            this.todoTasksLastPage = lastPage;
            break;
          case 'inProgressTasks':
            this.inProgressTaskLastPage = lastPage;
            break;
          case 'doneTasks':
            this.donesLastTaskPage = lastPage;
            break;
        }

        // Trigger change detection to update the view
        this.cdr.markForCheck();
      });
  }

  changePage(status: string, direction: 'prev' | 'next') {
    if (status === 'TODO') {
      this.todoPage += direction === 'next' ? 1 : -1;
      this.loadTasks('To Do', this.todoPage, 'todoTasks');
    }
    if (status === 'IN_PROGRESS') {
      this.inProgressPage += direction === 'next' ? 1 : -1;
      this.loadTasks('In Progress', this.inProgressPage, 'inProgressTasks');
    }
    if (status === 'DONE') {
      this.donePage += direction === 'next' ? 1 : -1;
      this.loadTasks('Done', this.donePage, 'doneTasks');
    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  addTask(task: Task) {
    task.status = 'To Do'; // Default status for new tasks
    this.taskService.add(task).subscribe({
      next: (newTask) => {
        this.loadAll();
      },
      error: (err) => {
        console.error('Add task failed:', err);
      },
      complete: () => {
        this.closeForm();
      },
    });
  }

  openDetail(task: Task): void {
    const dialogRef = this.dialog.open(TaskPopupComponent, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadAll();
      }
    });
  }

  deleteTask(id: string, status: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
