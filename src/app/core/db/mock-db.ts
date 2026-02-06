import type {
    Usuario,
    Proyecto,
    ProyeccionUsuarios,
    RotacionPersonal,
    CumplimientoControles,
    CumplimientoTareas,
    ObjetivoCumplimiento,
    AccidenteIncidente,
    Ausentismo,
    SituacionEspecial,
    IdeaMejora,
    Capacitacion,
    Vacacion
} from '../models/domain.models';

/**
 * MOCK DATABASE - SOFASA SYSTEM
 * Complete implementation with all tables from Excel
 */

export const MOCK_DB = {
    // ============================================
    // MASTER TABLES
    // ============================================
    usuarios: [
        { id: 'u-1', nombre: 'Carlos Gómez', nDocumento: '102030', areaSofasa: 'Ensamble', cargoSofasa: 'Operario Senior' },
        { id: 'u-2', nombre: 'Ana Martínez', nDocumento: '405060', areaSofasa: 'Calidad', cargoSofasa: 'Analista' },
        { id: 'u-3', nombre: 'Pedro Ramírez', nDocumento: '789012', areaSofasa: 'Logística', cargoSofasa: 'Supervisor' },
        { id: 'u-4', nombre: 'María López', nDocumento: '345678', areaSofasa: 'RRHH', cargoSofasa: 'Jefe de Área' },
        { id: 'u-5', nombre: 'Luis Fernández', nDocumento: '901234', areaSofasa: 'Ensamble', cargoSofasa: 'Operario' }
    ] as Usuario[],

    proyectos: [
        { id: 'p-1', nombre: 'PLANTA ENSAMBLE DUSTER', codigoProyecto: 5021 },
        { id: 'p-2', nombre: 'LOGISTICA T2', codigoProyecto: 5022 },
        { id: 'p-3', nombre: 'PINTURA AVANZADA', codigoProyecto: 5023 }
    ] as Proyecto[],

    // ============================================
    // OPERATIONAL TABLES
    // ============================================

    proyeccionUsuarios: [
        {
            id: 'proy-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            cantidadPersonalActivo: 342,
            cantidadPersonalProyectado: 350,
            observaciones: 'Ingresos programados para semana 3.'
        },
        {
            id: 'proy-2',
            idProyecto: 'p-2',
            mes: '2026-02',
            cantidadPersonalActivo: 85,
            cantidadPersonalProyectado: 90,
            observaciones: 'Contratación en proceso.'
        }
    ] as ProyeccionUsuarios[],

    rotacion: [
        {
            id: 'rot-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            totalPersonal: 342,
            totalRetiros: 2,
            porcentajeRotacion: 0.58
        },
        {
            id: 'rot-2',
            idProyecto: 'p-2',
            mes: '2026-02',
            totalPersonal: 85,
            totalRetiros: 1,
            porcentajeRotacion: 1.18
        }
    ] as RotacionPersonal[],

    cumplimientoControles: [
        {
            id: 'cc-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            totalPersonal: 342,
            totalCumplimiento: 340,
            objetivo: 100,
            porcentajeCumplimiento: 99.42
        }
    ] as CumplimientoControles[],

    cumplimientoTareas: [
        {
            id: 'ct-1',
            idProyecto: 'p-1',
            area: 'Ensamble',
            idUsuario: 'u-1',
            promedioDesempeno: 92.5
        },
        {
            id: 'ct-2',
            idProyecto: 'p-1',
            area: 'Calidad',
            idUsuario: 'u-2',
            promedioDesempeno: 88.0
        }
    ] as CumplimientoTareas[],

    objetivosCumplimiento: [
        {
            id: 'obj-1',
            idCumplimiento: 'ct-1',
            desempeno: 95,
            informeMes: 'Cumplimiento sobresaliente en las tareas asignadas durante el mes de febrero. El operario demostró capacidad de resolución de problemas en la línea de ensamble, especialmente en la estación de montaje de puertas. Se destaca su iniciativa para implementar mejoras en el proceso que redujeron tiempos en 8%. Recomendación: Considerar para programa de líderes de equipo. Áreas de mejora: Documentación técnica más detallada.'
        },
        {
            id: 'obj-2',
            idCumplimiento: 'ct-2',
            desempeno: 88,
            informeMes: 'Desempeño satisfactorio en el área de control de calidad. Se realizaron 450 inspecciones visuales y 120 pruebas funcionales durante el período. Detectó 12 no conformidades críticas que fueron corregidas antes del despacho. Necesita mejorar velocidad de documentación de hallazgos. Mostró buena colaboración con el equipo de producción para resolver incidencias. Objetivo cumplido en 88% debido a retrasos en la entrega de reportes semanales.'
        }
    ] as ObjetivoCumplimiento[],

    accidentes: [
        {
            id: 'acc-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            cantidad: 0,
            tipo: 'ACCIDENTE',
            observaciones: 'Mes sin accidentes laborales. Auditoría SST aprobada.'
        },
        {
            id: 'acc-2',
            idProyecto: 'p-1',
            mes: '2026-02',
            cantidad: 2,
            tipo: 'INCIDENTE',
            observaciones: 'Dos incidentes menores reportados: 1. Caída de herramienta sin lesiones. 2. Alarma de emergencia activada accidentalmente.'
        }
    ] as AccidenteIncidente[],

    ausentismos: [
        {
            id: 'aus-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            tipoAusentismo: ['Enfermedad General', 'Calamidad Doméstica'],
            idUsuario: 'u-5',
            diasTotalAusencia: 3,
            porcentajeAusentismo: 1.2,
            diasLaboralesTotales: 20,
            objetivo: 2,
            observaciones: 'Incapacidad médica presentada correctamente.'
        }
    ] as Ausentismo[],

    situaciones: [
        {
            id: 'sit-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            situacion: ['Permiso Sindical', 'Licencia Luto'],
            cantidad: 2,
            cantidadPersonasMesUsuarios: 342,
            porcentajeSituacion: 0.58,
            objetivo: 0,
            observaciones: 'Casos aprobados por gerencia. Permisos sindicales justificados.'
        }
    ] as SituacionEspecial[],

    ideasMejora: [
        {
            id: 'idea-1',
            idProyecto: 'p-1',
            mes: '2026-02',
            descripcion: 'Propongo implementar un sistema de kanban visual en la línea de ensamble 3 para mejorar el flujo de materiales. Actualmente hay demoras en el abastecimiento de componentes porque el operario debe desplazarse hasta el almacén temporal. La idea es colocar tarjetas de señalización que el mismo operario active cuando quedan 2 unidades de cualquier componente. El abastecedor recogerá estas tarjetas cada 30 minutos. Esto reducirá tiempos muertos estimados en 45 minutos diarios por línea.',
            idUsuario: 'u-1'
        }
    ] as IdeaMejora[],

    capacitaciones: [
        {
            id: 'cap-1',
            idProyecto: 'p-1',
            fecha: '2026-02-15',
            tema: 'Seguridad en Alturas - Nivel Avanzado',
            responsable: 'u-4',
            lugar: 'Aula de Capacitación Principal'
        },
        {
            id: 'cap-2',
            idProyecto: 'p-1',
            fecha: '2026-02-22',
            tema: 'Manejo de Herramientas Neumáticas',
            responsable: 'u-3',
            lugar: 'Taller Mecánico'
        }
    ] as Capacitacion[],

    vacaciones: [
        {
            id: 'vac-1',
            idUsuario: 'u-2',
            idProyecto: 'p-1',
            mes: '2026-02',
            diasAcumulados: 15,
            observaciones: 'Programadas para marzo.'
        }
    ] as Vacacion[]
};
