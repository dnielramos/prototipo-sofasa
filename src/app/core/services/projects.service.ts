import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Project, ProjectStats } from '../models/project.model';
import { MOCK_PROJECTS } from '../db/projects-mock-data';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    private projects = signal<Project[]>(MOCK_PROJECTS);

    /**
     * Get all projects
     */
    getProjects(): Observable<Project[]> {
        return of(this.projects()).pipe(delay(300)); // Simulate API delay
    }

    /**
     * Get single project by ID
     */
    getProjectById(id: string): Observable<Project | undefined> {
        const project = this.projects().find(p => p.id === id);
        return of(project).pipe(delay(200));
    }

    /**
     * Get project statistics for dashboard overview
     */
    getProjectStats(): Observable<ProjectStats> {
        const projects = this.projects();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const stats: ProjectStats = {
            totalProyectos: projects.length,
            proyectosActivos: projects.filter(p => p.activo).length,
            reportadosEsteMes: projects.filter(p => {
                if (!p.lastReportDate) return false;
                const reportDate = new Date(p.lastReportDate);
                return reportDate.getMonth() === currentMonth &&
                    reportDate.getFullYear() === currentYear;
            }).length,
            pendientesDeReporte: 0 // Will calculate below
        };

        // Pending = Active projects without report this month
        stats.pendientesDeReporte = stats.proyectosActivos - stats.reportadosEsteMes;

        return of(stats).pipe(delay(250));
    }

    /**
     * Check if a project has reports for a specific month
     */
    hasReportForMonth(projectId: string, month: Date): Observable<boolean> {
        const project = this.projects().find(p => p.id === projectId);
        if (!project || !project.lastReportDate) {
            return of(false);
        }

        const reportDate = new Date(project.lastReportDate);
        const hasReport = reportDate.getMonth() === month.getMonth() &&
            reportDate.getFullYear() === month.getFullYear();

        return of(hasReport).pipe(delay(150));
    }
}
