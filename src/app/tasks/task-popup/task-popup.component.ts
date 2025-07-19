import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../core/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-popup',
  templateUrl: './task-popup.component.html',
  styleUrls: ['./task-popup.component.scss'],
  imports: [MatDialogModule, TaskFormComponent, CommonModule],
})
export class TaskPopupComponent {
  isEditMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    public dialogRef: MatDialogRef<TaskPopupComponent>,
    private taskService: TaskService,
  ) {}

  openForm() {
    this.isEditMode = true;
  }
  closeForm() {
    this.isEditMode = false;
  }

  close(): void {
    this.dialogRef.close();
  }

  updateTask(id: string, task: Task) {
    this.taskService.updateTask(id, task).subscribe({
      next: (newTask) => {
        this.dialogRef.close(newTask);
      },
      error: (err) => {
        console.error('Add task failed:', err);
      },
      complete: () => {
        this.dialogRef.close('updated');
        this.closeForm();
      },
    });
  }
}
