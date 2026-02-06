# DATA ARCHITECTURE & TYPESCRIPT INTERFACES
# PROJECT: SOFASA MANAGEMENT SYSTEM

## 1. INSTRUCCIONES PARA EL AGENTE
Este archivo define la VERDAD ÚNICA sobre los datos. Debes generar:
1.  Un archivo `src/app/core/models/domain.models.ts` con estas interfaces exactas.
2.  Un archivo `src/app/core/db/mock-db.ts` con los datos de ejemplo proporcionados.
3.  **IMPORTANTE:** Los formularios del frontend deben respetar los tipos de datos (number, string, Date, arrays) definidos aquí.

---

## 2. TABLAS MAESTRAS (CATÁLOGOS)

```typescript
// Tabla: USUARIOS
export interface Usuario {
  id: string; // UUID
  nombre: string;
  nDocumento: string; // "NUMERO" en excel, string para evitar problemas de ceros
  areaSofasa: string;
  cargoSofasa: string;
  avatarUrl?: string; // Para UI
}

// Tabla: PROYECTOS
export interface Proyecto {
  id: string; // UUID
  nombre: string;
  codigoProyecto: number;
}
3. TABLAS OPERATIVAS (TRANSACCIONALES)
TypeScript
/**
 * TABLA: PROYECCION_USUARIOS_MES
 * Mide headcount planificado vs real
 */
export interface ProyeccionUsuarios {
  id: string; // UUID
  idProyecto: string; // FK
  mes: string; // Formato YYYY-MM
  cantidadPersonalActivo: number; // Suma usuarios activos
  cantidadPersonalProyectado: number; // Registro manual
  observaciones?: string;
}

/**
 * TABLA: ROTACION_PERSONAL
 * KPIs de retiros
 */
export interface RotacionPersonal {
  id: string; // UUID
  idProyecto: string; // FK
  mes: string; // YYYY-MM
  totalPersonal: number;
  totalRetiros: number; // Registro manual
  // Calculado: (totalRetiros / totalPersonal) * 100
  porcentajeRotacion: number; 
}

/**
 * TABLA: CUMPLIMIENTO_CONTROLES
 * Auditoría
 */
export interface CumplimientoControles {
  id: string; // UUID
  idProyecto: string; // FK
  mes: string; // YYYY-MM
  totalPersonal: number;
  totalCumplimiento: number; // Registro Manual
  objetivo: number; // Constante 100%
  // Calculado: (totalCumplimiento / totalPersonal) * 100
  porcentajeCumplimiento: number;
}

/**
 * TABLA: CUMPLIMIENTO_TAREAS_PLAZOS
 * Evaluación Desempeño (Padre)
 */
export interface CumplimientoTareas {
  id: string; // UUID
  idProyecto: string;
  area: string;
  idUsuario: string; // FK Usuario
  promedioDesempeno: number; // Promedio de objetivos
}

/**
 * TABLA: OBJETIVOS DE CUMPLIMIENTO
 * Detalle del desempeño (Hijo de CumplimientoTareas)
 */
export interface ObjetivoCumplimientoDetalle {
  id: string;
  idCumplimiento: string; // FK CumplimientoTareas
  desempeno: number;
  informeMes: string; // TEXTO > 350 && < 500 caracteres
}

/**
 * TABLA: ACCIDENTES_INCIDENTES
 * Seguridad (SST)
 */
export type TipoIncidente = 'ACCIDENTE' | 'INCIDENTE';

export interface AccidenteIncidente {
  id: string;
  idProyecto: string;
  mes: string; // YYYY-MM
  cantidad: number;
  observaciones: string;
  tipo: TipoIncidente;
}

/**
 * TABLA: AUSENTISMOS
 * Gestión de faltas
 */
export interface Ausentismo {
  id: string;
  idProyecto: string;
  mes: string;
  // ARRAY<> en Excel -> Mapeado a lista de strings o tipos
  tipoAusentismo: string[]; 
  idUsuario: string; // FK Usuario
  diasTotalAusencia: number;
  diasLaboralesTotales: number; // Global Manual
  objetivo: number;
  observaciones?: string;
  // Calculado: diasLaboralesTotales / (totalPersonas * dias)
  porcentajeAusentismo: number;
}

/**
 * TABLA: SITUACIONES ESPECIALES
 * Casos anómalos RRHH
 */
export interface SituacionEspecial {
  id: string;
  idProyecto: string;
  mes: string;
  situacion: string[]; // ARRAY<>
  cantidad: number;
  cantidadPersonasMesUsuarios: number;
  // Calculado: (cantidad / cantidadPersonasMesUsuarios) * 100
  porcentajeSituacion: number;
  objetivo: number; // Esperado 0
  observaciones?: string;
}

/**
 * TABLA: IDEAS DE MEJORA
 * Feedback
 */
export interface IdeaMejora {
  id: string;
  idProyecto: string;
  mes: string;
  descripcion: string; // TEXTO > 350 && < 500
  idUsuario: string;
}

/**
 * TABLA: CAPACITACIONES
 * Formación
 */
export interface Capacitacion {
  id: string;
  idProyecto: string;
  fecha: Date;
  tema: string;
  responsable: string; // UUID Usuario
  lugar: string;
}

/**
 * TABLA: VACACIONES
 * Control días libres
 */
export interface Vacacion {
  id: string;
  idUsuario: string;
  idProyecto: string;
  mes: string;
  diasAcumulados: number; // Consultar DB
  observaciones?: string;
}
4. MOCK DATABASE (Ejemplo Realista para 'mock-db.ts')
Usa estos datos para popular la UI inicialmente.

TypeScript
export const MOCK_DB = {
  usuarios: [
    { id: 'u-1', nombre: 'Carlos Gomez', nDocumento: '102030', areaSofasa: 'Ensamble', cargoSofasa: 'Operario Senior' },
    { id: 'u-2', nombre: 'Ana Martinez', nDocumento: '405060', areaSofasa: 'Calidad', cargoSofasa: 'Analista' }
  ],
  proyectos: [
    { id: 'p-1', nombre: 'PLANTA DUSTER', codigoProyecto: 501 },
    { id: 'p-2', nombre: 'LOGISTICA T2', codigoProyecto: 502 }
  ],
  // Ejemplo: Rotación
  rotacion: [
    { 
      id: 'rot-1', 
      idProyecto: 'p-1', 
      mes: '2026-02', 
      totalPersonal: 150, 
      totalRetiros: 2, 
      porcentajeRotacion: 1.33 
    }
  ],
  // Ejemplo: Accidentes (Debe verse en tarjeta SST)
  accidentes: [
    {
      id: 'acc-1',
      idProyecto: 'p-1',
      mes: '2026-02',
      cantidad: 1,
      tipo: 'INCIDENTE',
      observaciones: 'Caída de herramienta sin lesiones.'
    }
  ],
  // Ejemplo: Situaciones Especiales (Con Array)
  situaciones: [
    {
      id: 'sit-1',
      idProyecto: 'p-1',
      mes: '2026-02',
      situacion: ['Permiso Sindical', 'Licencia Luto'],
      cantidad: 2,
      cantidadPersonasMesUsuarios: 150,
      porcentajeSituacion: 1.33,
      objetivo: 0,
      observaciones: 'Casos aprobados por gerencia.'
    }
  ]
};
5. REGLAS DE UI PARA ESTOS DATOS
Arrays (Tipo Ausentismo / Situaciones):

En el formulario, usa un componente ChipsInput o MultiSelect. El usuario debe poder agregar múltiples etiquetas (ej: "Enfermedad", "Luto") y estas se guardan en el array de strings.

Validaciones de Texto Largo (Ideas Mejora / Objetivos):

El Excel especifica "TEXTO MAS DE 350 MAX DE 500".

El Textarea debe tener un contador de caracteres visible: 34/500.

Si length < 350, mostrar advertencia: "La descripción debe ser detallada (mínimo 350 caracteres)".

Campos Calculados (Porcentajes):

En el formulario, estos campos deben ser readonly.

Al cambiar el numerador (ej: totalRetiros) o denominador (totalPersonal), el porcentaje debe recalcularse en tiempo real en la UI para feedback inmediato.

Fechas:

Usa siempre selectores de fecha estandarizados. Para campos YYYY-MM (Mes), usa un selector de "Solo Mes y Año".