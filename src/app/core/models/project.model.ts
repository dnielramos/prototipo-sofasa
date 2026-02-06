export interface Project {
    id: string;
    nombre: string;
    codigo_proyecto: number;
    descripcion?: string;
    activo: boolean;
    created_at: Date;
    // UI-specific fields
    lastReportDate?: Date;
    hasReportThisMonth?: boolean;
}

export interface ProjectStats {
    totalProyectos: number;
    reportadosEsteMes: number;
    pendientesDeReporte: number;
    proyectosActivos: number;
}
