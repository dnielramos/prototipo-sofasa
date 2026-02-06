import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card.component';
import { ProjectsService } from '../../../../core/services/projects.service';
import { ProjectStats } from '../../../../core/models/project.model';

@Component({
    selector: 'app-projects-dashboard-overview',
    standalone: true,
    imports: [CommonModule, KpiCardComponent],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <app-kpi-card
                [title]="'Total Proyectos'"
                [value]="(stats()?.totalProyectos ?? 0).toString()"
                [icon]="'📊'"
                [status]="'info'"
                [clickable]="false">
            </app-kpi-card>

            <app-kpi-card
                [title]="'Reportados Este Mes'"
                [value]="(stats()?.reportadosEsteMes ?? 0).toString()"
                [icon]="'✅'"
                [status]="getReportStatus()"
                [clickable]="false">
            </app-kpi-card>

            <app-kpi-card
                [title]="'Pendientes de Reporte'"
                [value]="(stats()?.pendientesDeReporte ?? 0).toString()"
                [icon]="'⏳'"
                [status]="getPendingStatus()"
                [clickable]="false">
            </app-kpi-card>

            <app-kpi-card
                [title]="'Proyectos Activos'"
                [value]="(stats()?.proyectosActivos ?? 0).toString()"
                [icon]="'🟢'"
                [status]="'success'"
                [clickable]="false">
            </app-kpi-card>
        </div>
    `
})
export class ProjectsDashboardOverviewComponent implements OnInit {

    private projectsService = inject(ProjectsService);

    stats = signal<ProjectStats | null>(null);

    ngOnInit() {
        this.loadStats();
    }

    private loadStats() {
        this.projectsService.getProjectStats().subscribe(stats => {
            this.stats.set(stats);
        });
    }

    getReportStatus(): 'success' | 'warning' | 'danger' | 'info' {
        const s = this.stats();
        if (!s) return 'info';

        const percentage = (s.reportadosEsteMes / s.proyectosActivos) * 100;
        if (percentage >= 80) return 'success';
        if (percentage >= 50) return 'warning';
        return 'danger';
    }

    getPendingStatus(): 'success' | 'warning' | 'danger' | 'info' {
        const s = this.stats();
        if (!s) return 'info';

        if (s.pendientesDeReporte === 0) return 'success';
        if (s.pendientesDeReporte <= 2) return 'warning';
        return 'danger';
    }
}
