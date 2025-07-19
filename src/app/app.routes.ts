import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'form', loadComponent: () => import('./tasks/task-form/task-form.component').then(m => m.TaskFormComponent) },
    {
        path: '',
        loadComponent: () => import('./tasks/task-list/task-list.component').then(m => m.TaskListComponent)
    }
];
