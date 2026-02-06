import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    },
    {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
    },
    {
        path: 'dashboard/:projectId',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: '**',
        redirectTo: 'projects'
    }
];
