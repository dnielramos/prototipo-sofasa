/**
 * COMPLETE DOMAIN MODELS - SOFASA DATABASE
 * Source: SOFASA_DB.xlsx
 * Generated: 2026-02-04
 */

// ============================================
// MASTER TABLES (CATALOGOS)
// ============================================

export interface Usuario {
    id: string; // UUID
    nombre: string;
    nDocumento: string; // NUMERO - string to preserve leading zeros
    areaSofasa: string;
    cargoSofasa: string; // CARG0 SOFASA en Excel
    avatarUrl?: string; // UI extension
}

export interface Proyecto {
    id: string; // UUID
    nombre: string;
    codigoProyecto: number;
}

// ============================================
// OPERATIONAL TABLES (TRANSACCIONALES)
// ============================================

/**
 * PROYECCION_USUARIOS_MES
 * Mide headcount planificado vs real
 */
export interface ProyeccionUsuarios {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO DATE format YYYY-MM
    cantidadPersonalActivo: number; // SUMA DE USUARIOS ACTIVOS ESE MES
    cantidadPersonalProyectado: number; // REGISTRO MANUAL
    observaciones?: string;
}

/**
 * ROTACION_PERSONAL
 * KPIs de retiros
 */
export interface RotacionPersonal {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO DATE format YYYY-MM
    totalPersonal: number; // SUMA DE USUARIOS ACTIVOS
    totalRetiros: number; // REGISTRO MANUAL
    porcentajeRotacion: number; // CALCULADO: (totalRetiros / totalPersonal) * 100
}

/**
 * CUMPLIMIENTO_CONTROLES
 * Auditoría
 */
export interface CumplimientoControles {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO DATE
    totalPersonal: number; // SUMA DE USUARIOS ACTIVOS
    totalCumplimiento: number; // REGISTRO MANUAL
    objetivo: number; // CONSTANTE 100%
    porcentajeCumplimiento: number; // CALCULADO: (totalCumplimiento / totalPersonal) * 100
}

/**
 * CUMPLIMIENTO_TAREAS_PLAZOS
 * Evaluación Desempeño (Padre)
 */
export interface CumplimientoTareas {
    id: string; // UUID
    idProyecto: string; // FK
    area: string;
    idUsuario: string; // FK Usuario
    promedioDesempeno: number; // PROMEDIO OBJETIVOS
}

/**
 * OBJETIVOS DE CUMPLIMIENTO
 * Detalle del desempeño (Hijo de CumplimientoTareas)
 */
export interface ObjetivoCumplimiento {
    id: string; // UUID
    idCumplimiento: string; // FK CumplimientoTareas
    desempeno: number;
    informeMes: string; // TEXTO MAS DE 350 MENOS Y 500 MAX
}

/**
 * ACCIDENTES_INCIDENTES
 * Seguridad (SST)
 */
export type TipoIncidente = 'ACCIDENTE' | 'INCIDENTE';

export interface AccidenteIncidente {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO DATE
    cantidad: number;
    observaciones: string;
    tipo: TipoIncidente; // TEXTO || INCIDENTE O ACCIDENTE
}

/**
 * AUSENTISMOS
 * Gestión de faltas
 */
export interface Ausentismo {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO
    tipoAusentismo: string[]; // ARRAY<>
    idUsuario: string; // FK Usuario
    diasTotalAusencia: number; // TOTAL AUSENCIAS
    porcentajeAusentismo: number; // CALCULADO: diasLaboralesTotales / (totalPersonas * dias)
    diasLaboralesTotales: number; // NUMERO GLOBAL MANUAL
    objetivo: number;
    observaciones?: string;
}

/**
 * SITUACIONES ESPECIALES
 * Casos anómalos RRHH
 */
export interface SituacionEspecial {
    id: string; // UUID TEXTO
    idProyecto: string; // FK
    mes: string; // TEXTO
    situacion: string[]; // ARRAY<>
    cantidad: number;
    cantidadPersonasMesUsuarios: number;
    porcentajeSituacion: number; // CALCULADO: (cantidad / cantidadPersonasMesUsuarios) * 100
    objetivo: number; // CERO SIEMPRE (ESPERADO)
    observaciones?: string;
}

/**
 * IDEAS DE MEJORA
 * Feedback
 */
export interface IdeaMejora {
    id: string; // UUID
    idProyecto: string; // FK
    mes: string; // TEXTO MAS DE 350 MAX DE 500 CR
    descripcion: string; // TEXTO MAS DE 350 MAX DE 500 CR
    idUsuario: string; // UUID USUARIO
}

/**
 * CAPACITACIONES
 * Formación
 */
export interface Capacitacion {
    id: string; // UUID
    idProyecto: string; // FK
    fecha: string; // TEXTO DATE
    tema: string;
    responsable: string; // UUID USUARIO
    lugar: string;
}

/**
 * VACACIONES
 * Control días libres
 */
export interface Vacacion {
    id: string; // UUID
    idUsuario: string; // FK Usuario
    idProyecto: string; // FK
    mes: string; // TEXTO
    diasAcumulados: number; // NUMERO CONSULTAR DB
    observaciones?: string;
}

// ============================================
// UI/VIEW MODELS
// ============================================

export interface DashboardKpiData {
    proyeccion?: ProyeccionUsuarios;
    rotacion?: RotacionPersonal;
    cumplimientoControles?: CumplimientoControles;
    cumplimientoTareas?: CumplimientoTareas[];
    accidentes?: AccidenteIncidente[];
    ausentismos?: Ausentismo[];
    situaciones?: SituacionEspecial[];
    ideas?: IdeaMejora[];
    capacitaciones?: Capacitacion[];
    vacaciones?: Vacacion[];
}
