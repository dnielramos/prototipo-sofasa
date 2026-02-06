import { Injectable, computed, signal } from '@angular/core';
import { MOCK_DB } from '../../core/db/mock-db';
import { KpiStatus } from '../../shared/components/kpi-card/kpi-card.component';
import type {
    AccidenteIncidente,
    RotacionPersonal,
    Ausentismo,
    ProyeccionUsuarios,
    CumplimientoControles,
    CumplimientoTareas,
    SituacionEspecial,
    IdeaMejora,
    Capacitacion,
    Vacacion
} from '../../core/models/domain.models';

export interface DashboardKpi {
    id: string;
    title: string;
    value: string | number;
    subValue: string;
    status: KpiStatus;
    icon: string;
    colSpan: string;
    rowSpan?: string;
    type: 'safety' | 'rotation' | 'absenteeism' | 'tasks' | 'training' | 'special' | 'projection' | 'ideas' | 'vacaciones' | 'controles';
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardStateService {

    // ============================================
    // STATE SIGNALS (Source of Truth)
    // ============================================
    private proyeccionData = signal<ProyeccionUsuarios[]>(MOCK_DB.proyeccionUsuarios || []);
    private rotationData = signal<RotacionPersonal[]>(MOCK_DB.rotacion || []);
    private safetyData = signal<AccidenteIncidente[]>(MOCK_DB.accidentes || []);
    private ausentismosData = signal<Ausentismo[]>(MOCK_DB.ausentismos || []);
    private controlesData = signal<CumplimientoControles[]>(MOCK_DB.cumplimientoControles || []);
    private tareasData = signal<CumplimientoTareas[]>(MOCK_DB.cumplimientoTareas || []);
    private situacionesData = signal<SituacionEspecial[]>(MOCK_DB.situaciones || []);
    private ideasData = signal<IdeaMejora[]>(MOCK_DB.ideasMejora || []);
    private capacitacionesData = signal<Capacitacion[]>(MOCK_DB.capacitaciones || []);
    private vacacionesData = signal<Vacacion[]>(MOCK_DB.vacaciones || []);

    // ============================================
    // COMPUTED KPIs (View Models)
    // ============================================

    projectionKpi = computed<DashboardKpi>(() => {
        const data = this.proyeccionData()[0];
        if (!data) return this.emptyKpi('projection', 'Proyección Usuarios');

        const gap = data.cantidadPersonalProyectado - data.cantidadPersonalActivo;
        const status: KpiStatus = gap > 10 ? 'alert' : gap > 0 ? 'pending' : 'completed';

        return {
            id: data.id,
            title: 'Proyección Usuarios',
            value: data.cantidadPersonalActivo.toString(),
            subValue: `/ ${data.cantidadPersonalProyectado}`,
            status,
            icon: 'ph-users-three',
            colSpan: 'col-span-1 md:col-span-2',
            type: 'projection',
            data
        };
    });

    rotationKpi = computed<DashboardKpi>(() => {
        const data = this.rotationData()[0];
        if (!data) return this.emptyKpi('rotation', 'Rotación Personal');

        let status: KpiStatus = 'completed';
        if (data.porcentajeRotacion > 5) status = 'alert';
        else if (data.porcentajeRotacion > 2) status = 'pending';

        return {
            id: data.id,
            title: 'Rotación Personal',
            value: `${data.porcentajeRotacion.toFixed(1)}%`,
            subValue: 'Mensual',
            status,
            icon: 'ph-arrows-left-right',
            colSpan: 'col-span-1',
            type: 'rotation',
            data
        };
    });

    safetyKpi = computed<DashboardKpi>(() => {
        const accidentes = this.safetyData().filter(d => d.tipo === 'ACCIDENTE');
        const incidentes = this.safetyData().filter(d => d.tipo === 'INCIDENTE');

        const totalAccidentes = accidentes.reduce((sum, a) => sum + a.cantidad, 0);
        const totalIncidentes = incidentes.reduce((sum, i) => sum + i.cantidad, 0);

        const status: KpiStatus = totalAccidentes > 0 ? 'alert' : totalIncidentes > 0 ? 'pending' : 'completed';

        return {
            id: 'safety-kpi',
            title: 'Seguridad (SST)',
            value: totalAccidentes.toString(),
            subValue: `${totalIncidentes} incidentes`,
            status,
            icon: 'ph-shield-check',
            colSpan: 'col-span-1',
            type: 'safety',
            data: this.safetyData()[0]
        };
    });

    ausentismosKpi = computed<DashboardKpi>(() => {
        const data = this.ausentismosData();
        const totalCasos = data.length;
        const totalDias = data.reduce((sum, a) => sum + a.diasTotalAusencia, 0);

        const status: KpiStatus = totalCasos > 10 ? 'alert' : totalCasos > 5 ? 'pending' : 'completed';

        return {
            id: 'ausen-kpi',
            title: 'Ausentismos',
            value: totalCasos.toString(),
            subValue: `${totalDias} días totales`,
            status,
            icon: 'ph-thermometer',
            colSpan: 'col-span-1 md:col-span-2',
            rowSpan: 'row-span-2',
            type: 'absenteeism'
        };
    });

    tareasKpi = computed<DashboardKpi>(() => {
        const data = this.tareasData();
        if (!data.length) return this.emptyKpi('tasks', 'Cumplimiento Tareas');

        const promedio = data.reduce((sum, t) => sum + t.promedioDesempeno, 0) / data.length;
        const status: KpiStatus = promedio >= 90 ? 'completed' : promedio >= 75 ? 'pending' : 'alert';

        return {
            id: 'tasks-kpi',
            title: 'Cumplimiento Tareas',
            value: `${promedio.toFixed(1)}%`,
            subValue: `${data.length} evaluados`,
            status,
            icon: 'ph-list-checks',
            colSpan: 'col-span-1',
            type: 'tasks'
        };
    });

    capacitacionesKpi = computed<DashboardKpi>(() => {
        const data = this.capacitacionesData();
        const status: KpiStatus = data.length >= 2 ? 'completed' : data.length > 0 ? 'pending' : 'alert';

        return {
            id: 'cap-kpi',
            title: 'Capacitaciones',
            value: data.length.toString(),
            subValue: 'Programadas',
            status,
            icon: 'ph-graduation-cap',
            colSpan: 'col-span-1',
            type: 'training'
        };
    });

    situacionesKpi = computed<DashboardKpi>(() => {
        const data = this.situacionesData();
        const totalCasos = data.reduce((sum, s) => sum + s.cantidad, 0);
        const status: KpiStatus = totalCasos === 0 ? 'completed' : totalCasos < 5 ? 'pending' : 'alert';

        return {
            id: 'sit-kpi',
            title: 'Situaciones Especiales',
            value: totalCasos.toString(),
            subValue: 'casos',
            status,
            icon: 'ph-warning',
            colSpan: 'col-span-1',
            type: 'special'
        };
    });

    // 9. Vacaciones
    vacacionesKpi = computed<DashboardKpi>(() => {
        const data = this.vacacionesData();
        const active = data.length; // Simply count active requests/records
        return {
            id: 'vac-kpi',
            title: 'Vacaciones',
            value: active.toString(),
            subValue: 'Programadas',
            status: 'neutral',
            icon: 'ph-airplane-tilt',
            colSpan: 'col-span-1',
            type: 'vacaciones'
        };
    });

    // 10. Cumplimiento Controles
    controlesKpi = computed<DashboardKpi>(() => {
        const data = this.controlesData()[0];
        if (!data) return this.emptyKpi('controles', 'Controles (Auditoría)');

        const pct = data.porcentajeCumplimiento;
        const status: KpiStatus = pct >= 98 ? 'completed' : pct >= 90 ? 'pending' : 'alert';

        return {
            id: 'ctrl-kpi',
            title: 'Controles (Auditoría)',
            value: `${pct.toFixed(1)}%`,
            subValue: 'Cumplimiento',
            status,
            icon: 'ph-clipboard-text',
            colSpan: 'col-span-1',
            type: 'controles',
            data
        };
    });

    ideasKpi = computed<DashboardKpi>(() => {
        const data = this.ideasData();
        const status: KpiStatus = data.length > 0 ? 'completed' : 'pending';

        return {
            id: 'ideas-kpi',
            title: 'Ideas de Mejora',
            value: data.length.toString(),
            subValue: 'nuevas',
            status,
            icon: 'ph-lightbulb',
            colSpan: 'col-span-1',
            type: 'ideas'
        };
    });

    // Master KPI List
    kpis = computed<DashboardKpi[]>(() => [
        this.projectionKpi(),
        this.rotationKpi(),
        this.safetyKpi(),
        this.ausentismosKpi(),
        this.tareasKpi(),
        this.controlesKpi(), // NEW
        this.capacitacionesKpi(),
        this.situacionesKpi(),
        this.ideasKpi(),
        this.vacacionesKpi() // NEW
    ]);

    // ============================================
    // CRUD ACTIONS (Optimistic UI)
    // ============================================

    updateProyeccion(updated: ProyeccionUsuarios) {
        this.proyeccionData.update(list =>
            list.map(item => item.id === updated.id ? updated : item)
        );
    }

    updateSafety(updated: AccidenteIncidente) {
        this.safetyData.update(list =>
            list.map(item => item.id === updated.id ? updated : item)
        );
    }

    updateRotation(updated: RotacionPersonal) {
        this.rotationData.update(list =>
            list.map(item => item.id === updated.id ? updated : item)
        );
    }

    updateControles(updated: CumplimientoControles) {
        // Usually singular per month, so update or append if logic requires
        // Mock DB has [0] so we verify ID
        this.controlesData.update(list => {
            const exists = list.find(l => l.id === updated.id);
            if (exists) return list.map(item => item.id === updated.id ? updated : item);
            return [updated, ...list]; // Or just replace
        });
    }

    addAusentismo(nuevo: Ausentismo) {
        this.ausentismosData.update(list => [...list, nuevo]);
    }

    addSituacion(nueva: SituacionEspecial) {
        this.situacionesData.update(list => [...list, nueva]);
    }

    addVacacion(nueva: Vacacion) {
        this.vacacionesData.update(list => [...list, nueva]);
    }

    addIdea(nueva: IdeaMejora) {
        this.ideasData.update(list => [...list, nueva]);
    }

    addCapacitacion(nueva: Capacitacion) {
        this.capacitacionesData.update(list => [...list, nueva]);
    }

    addTarea(nueva: CumplimientoTareas) {
        this.tareasData.update(list => [...list, nueva]);
    }

    private emptyKpi(type: any, title: string): DashboardKpi {
        return {
            id: 'new',
            title,
            value: '--',
            subValue: 'Sin datos',
            status: 'neutral',
            icon: 'ph-question',
            colSpan: 'col-span-1',
            type
        };
    }
}
