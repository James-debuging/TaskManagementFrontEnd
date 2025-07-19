
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'form', loadComponent: () => import('./tasks/task-form/task-form.component').then(m => m.TaskFormComponent) },
  {
    path: '',
    loadComponent: () => import('./tasks/task-list/task-list.component').then(m => m.TaskListComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
