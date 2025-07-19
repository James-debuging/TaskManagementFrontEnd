import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [FormsModule, NgIf],
})
export class TaskFormComponent implements OnInit {
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() closed = new EventEmitter<void>();

  @Input() taskData!: Task;

  task: Task = {
    id: '',
    title: '',
    description: '',
    status: 'To Do',
    type: 'Feature',
  };

  get isEditMode(): boolean {
    return !!this.taskData?.id;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.taskData) {
      // Clone data into the form model
      this.task = { ...this.taskData };
    }
  }

  onSubmit() {
    const resultTask: Task = {
      id: this.taskData?.id ?? '',
      title: this.task.title,
      description: this.task.description,
      status: this.isEditMode ? this.task.status : 'To Do',
      type: this.task.type,
    };

    this.taskCreated.emit(resultTask);
    this.resetForm();
  }

  onCancel() {
    this.closed.emit();
    this.resetForm();
  }

  resetForm() {
    this.task = {
      id: '',
      title: '',
      description: '',
      status: 'To Do',
      type: 'Feature',
    };
  }
}
