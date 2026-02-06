import { Project } from '../models/project.model';

/**
 * Mock data for Proyectos table
 * Simulates various project states for development
 */
export const MOCK_PROJECTS: Project[] = [
    {
        id: '123e4567-e89b-12d3-a456-426614174001',
        nombre: 'Planta Bogotá Norte',
        codigo_proyecto: 1001,
        descripcion: 'Planta principal de producción y ensamblaje',
        activo: true,
        created_at: new Date('2024-01-15'),
        lastReportDate: new Date('2026-02-01'),
        hasReportThisMonth: true
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174002',
        nombre: 'Centro Logístico Medellín',
        codigo_proyecto: 1002,
        descripcion: 'Centro de distribución y almacenamiento',
        activo: true,
        created_at: new Date('2024-03-20'),
        lastReportDate: new Date('2026-02-03'),
        hasReportThisMonth: true
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174003',
        nombre: 'Planta Cali Sur',
        codigo_proyecto: 1003,
        descripcion: 'Planta de manufactura secundaria',
        activo: true,
        created_at: new Date('2024-05-10'),
        lastReportDate: new Date('2026-01-28'),
        hasReportThisMonth: false
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174004',
        nombre: 'Oficina Administrativa Barranquilla',
        codigo_proyecto: 1004,
        descripcion: 'Sede administrativa regional Costa',
        activo: true,
        created_at: new Date('2024-07-01'),
        lastReportDate: new Date('2026-02-04'),
        hasReportThisMonth: true
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174005',
        nombre: 'Centro de Investigación Bogotá',
        codigo_proyecto: 1005,
        descripcion: 'Centro de I+D e innovación tecnológica',
        activo: true,
        created_at: new Date('2024-08-15'),
        lastReportDate: new Date('2026-01-20'),
        hasReportThisMonth: false
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174006',
        nombre: 'Almacén Regional Bucaramanga',
        codigo_proyecto: 1006,
        descripcion: 'Almacén de repuestos y materiales',
        activo: true,
        created_at: new Date('2024-09-01'),
        lastReportDate: new Date('2026-01-15'),
        hasReportThisMonth: false
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174007',
        nombre: 'Planta Cartagena (Legacy)',
        codigo_proyecto: 1007,
        descripcion: 'Planta antigua en proceso de cierre',
        activo: false,
        created_at: new Date('2023-11-20'),
        lastReportDate: new Date('2025-12-01'),
        hasReportThisMonth: false
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174008',
        nombre: 'Centro Capacitación Pereira',
        codigo_proyecto: 1008,
        descripcion: 'Centro de formación de personal',
        activo: true,
        created_at: new Date('2025-02-01'),
        lastReportDate: new Date('2026-02-02'),
        hasReportThisMonth: true
    }
];
