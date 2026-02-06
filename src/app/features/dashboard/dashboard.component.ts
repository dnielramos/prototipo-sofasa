import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UiDrawerComponent } from '../../shared/components/ui-drawer/ui-drawer.component';
import { KpiCardComponent, KpiStatus } from '../../shared/components/kpi-card/kpi-card.component';
import { DashboardStateService, DashboardKpi } from './dashboard-state.service';
import { ProjectsService } from '../../core/services/projects.service';
import { SafetyFormComponent } from './components/forms/safety-form/safety-form.component';
import { RotationFormComponent } from './components/forms/rotation-form/rotation-form.component';
import { ProyeccionFormComponent } from './components/forms/proyeccion-form/proyeccion-form.component';
import { IdeasFormComponent } from './components/forms/ideas-form/ideas-form.component';
import { CapacitacionesFormComponent } from './components/forms/capacitaciones-form/capacitaciones-form.component';
import { AusentismosFormComponent } from './components/forms/ausentismos-form/ausentismos-form.component';
import { TareasFormComponent } from './components/forms/tareas-form/tareas-form.component';
import { SituacionesFormComponent } from './components/forms/situaciones-form/situaciones-form.component';
import { VacacionesFormComponent } from './components/forms/vacaciones-form/vacaciones-form.component';
import { ControlesFormComponent } from './components/forms/controles-form/controles-form.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        UiDrawerComponent,
        KpiCardComponent,
        SafetyFormComponent,
        RotationFormComponent,
        ProyeccionFormComponent,
        IdeasFormComponent,
        CapacitacionesFormComponent,
        AusentismosFormComponent,
        TareasFormComponent,
        SituacionesFormComponent,
        VacacionesFormComponent,
        ControlesFormComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private state = inject(DashboardStateService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private projectsService = inject(ProjectsService);

    // Signals
    isDrawerOpen = signal(false);
    activeKpi = signal<DashboardKpi | null>(null);
    projectName = signal<string>('Cargando...');
    projectId = signal<string | null>(null);

    // Read from Service Store
    kpis = this.state.kpis;

    ngOnInit() {
        // Get project from route params
        this.route.paramMap.subscribe(params => {
            const id = params.get('projectId');
            if (id) {
                this.projectId.set(id);
                this.loadProject(id);
            }
        });
    }

    private loadProject(id: string) {
        this.projectsService.getProjectById(id).subscribe(project => {
            if (project) {
                this.projectName.set(project.nombre);
                // You could also pass the project to the state service here if needed
                // this.state.setProject(project);
            }
        });
    }

    openDrawer(kpi: DashboardKpi) {
        this.activeKpi.set(kpi);
        this.isDrawerOpen.set(true);
    }

    closeDrawer() {
        this.isDrawerOpen.set(false);
        setTimeout(() => this.activeKpi.set(null), 300); // Wait for animation
    }

    backToProjects() {
        this.router.navigate(['/projects']);
    }
}
