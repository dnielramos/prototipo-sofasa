/**
 * MOCK DATA - SOFASA SYSTEM
 * Estructura normalizada lista para consumir en Frontend
 */
const SOFASA_DB = {
    meta: {
        proyectoActual: { id: "p-001", nombre: "PLANTA ENSAMBLE DUSTER", codigo: 5021 },
        mesActual: "Febrero 2026",
        usuario: { nombre: "Ing. Admin", rol: "Super Admin" }
    },
    kpis: [
        {
            id: "kpi-01",
            titulo: "Proyección Usuarios",
            tabla: "Proyeccion_Usuarios_Mes",
            estado: "completado", // completado, pendiente, parcial
            valorPrincipal: "342 / 350",
            tendencia: "+2%",
            data: { activo: 342, proyectado: 350, observaciones: "Ingresos programados para semana 3." }
        },
        {
            id: "kpi-02",
            titulo: "Rotación Personal",
            tabla: "Rotacion_Personal",
            estado: "pendiente",
            valorPrincipal: "0.0%",
            tendencia: "0%",
            data: { totalPersonal: 342, totalRetiros: 0, porcentaje: 0 }
        },
        {
            id: "kpi-03",
            titulo: "Ausentismos",
            tabla: "Ausentismos",
            estado: "alerta", // Si supera umbrales
            valorPrincipal: "12 Casos",
            tendencia: "+5%",
            data: [
                { tipo: "Enfermedad General", cantidad: 8 },
                { tipo: "Calamidad", cantidad: 4 }
            ]
        },
        {
            id: "kpi-04",
            titulo: "Seguridad (SST)",
            tabla: "Accidentes_Incidentes",
            estado: "completado",
            valorPrincipal: "0 Accidentes",
            tendencia: "Stable",
            data: { accidentes: 0, incidentes: 2, observaciones: "Incidentes menores reportados en pintura." }
        },
        {
            id: "kpi-05",
            titulo: "Cumplimiento Tareas",
            tabla: "Cumplimiento_Tareas",
            estado: "parcial",
            valorPrincipal: "87%",
            tendencia: "-3%",
            data: { promedio: 87, evaluados: 120, total: 342 }
        },
        {
            id: "kpi-06",
            titulo: "Capacitaciones",
            tabla: "Capacitaciones",
            estado: "pendiente",
            valorPrincipal: "-- Hrs",
            tendencia: null,
            data: []
        }
    ]
};