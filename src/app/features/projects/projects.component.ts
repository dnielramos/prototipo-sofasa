import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsService } from '../../core/services/projects.service';
import { Project } from '../../core/models/project.model';
import { ProjectsDashboardOverviewComponent } from './components/projects-dashboard-overview/projects-dashboard-overview.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, ProjectsDashboardOverviewComponent],
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

    private projectsService = inject(ProjectsService);
    private router = inject(Router);

    projects = signal<Project[]>([]);
    filteredProjects = signal<Project[]>([]);
    searchTerm = signal<string>('');
    isLoading = signal<boolean>(true);

    ngOnInit() {
        this.loadProjects();
    }

    private loadProjects() {
        this.isLoading.set(true);
        this.projectsService.getProjects().subscribe(projects => {
            this.projects.set(projects);
            this.filteredProjects.set(projects);
            this.isLoading.set(false);
        });
    }

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value.toLowerCase();
        this.searchTerm.set(value);

        if (!value.trim()) {
            this.filteredProjects.set(this.projects());
            return;
        }

        const filtered = this.projects().filter(p =>
            p.nombre.toLowerCase().includes(value) ||
            p.codigo_proyecto.toString().includes(value) ||
            p.descripcion?.toLowerCase().includes(value)
        );
        this.filteredProjects.set(filtered);
    }

    filterByStatus(status: 'all' | 'active' | 'inactive') {
        if (status === 'all') {
            this.filteredProjects.set(this.projects());
        } else {
            const filtered = this.projects().filter(p =>
                p.activo === (status === 'active')
            );
            this.filteredProjects.set(filtered);
        }
    }

    navigateToDashboard(project: Project) {
        this.router.navigate(['/dashboard', project.id]);
    }

    formatDate(date?: Date): string {
        if (!date) return 'Sin reportes';
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
