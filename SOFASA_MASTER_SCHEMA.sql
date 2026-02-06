/*
 * =======================================================================================
 * SISTEMA DE GESTIÓN INTEGRAL SOFASA - MASTER DATABASE SCHEMA
 * =======================================================================================
 * FECHA: Febrero 2026
 * MOTOR: PostgreSQL (Compatible con SQL Server/Oracle con ajustes menores de sintaxis)
 * ESTÁNDAR: BCNF (Boyce-Codd Normal Form) - Normalización estricta.
 *
 * NOTA DE ARQUITECTURA:
 * 1. Todos los IDs primarios son UUID (GUID) para seguridad y replicación.
 * 2. Las fechas de reporte mensual se estandarizan al primer día del mes (YYYY-MM-01).
 * 3. Los campos calculados (%) NO se persisten si son redundantes, salvo que se requiera 
 * histórico inmutable (Snapshot). Aquí se definen como persistentes para coincidir 
 * con los requerimientos explícitos del Excel (Snapshots de cierre de mes).
 * 4. Los Arrays del Excel (Tipos de Ausentismo/Situaciones) se resuelven con 
 * Tablas Puente (Relaciones N:M) para integridad referencial absoluta.
 * =======================================================================================
 */

-- Habilitar extensión para UUIDs (Si es PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* ---------------------------------------------------------------------------------------
   1. TABLAS MAESTRAS (CATÁLOGOS DEL SISTEMA)
   Son las entidades transversales que alimentan las relaciones.
--------------------------------------------------------------------------------------- */

-- 1.1 PROYECTOS (Centros de costo / Plantas)
CREATE TABLE Proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    codigo_proyecto INT UNIQUE NOT NULL, -- Código numérico único
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 USUARIOS (Personal de la compañía)
CREATE TABLE Usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    n_documento VARCHAR(50) UNIQUE NOT NULL, -- Varchar para preservar ceros a la izquierda
    area_sofasa VARCHAR(100) NOT NULL,
    cargo_sofasa VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE, -- Activo/Inactivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.3 CATÁLOGOS NORMALIZADOS (Para eliminar Arrays de texto libre)
CREATE TABLE Cat_Tipos_Ausentismo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL -- Ej: "Enfermedad General", "Calamidad", "Luto"
);

CREATE TABLE Cat_Tipos_Situacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL -- Ej: "Fuero Sindical", "Restricción Médica"
);

CREATE TABLE Cat_Tipos_Accidente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL -- Ej: "Incidente", "Accidente", "Casi-Accidente"
);

/* ---------------------------------------------------------------------------------------
   2. TABLAS TRANSACCIONALES DE GESTIÓN HUMANA Y OPERACIÓN
   Registros mensuales por proyecto.
--------------------------------------------------------------------------------------- */

-- 2.1 PROYECCIÓN DE USUARIOS (Headcount)
CREATE TABLE Proyeccion_Usuarios_Mes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL, -- Se guarda siempre el día 1 (Ej: 2026-02-01)
    cantidad_personal_activo INT NOT NULL,
    cantidad_personal_proyectado INT NOT NULL,
    observaciones TEXT,
    
    -- Relaciones
    CONSTRAINT fk_proyeccion_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    -- Regla de Negocio: Un solo reporte por proyecto al mes
    CONSTRAINT uq_proyeccion_mes UNIQUE (id_proyecto, mes)
);

-- 2.2 ROTACIÓN DE PERSONAL
CREATE TABLE Rotacion_Personal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL,
    total_personal INT NOT NULL,
    total_retiros INT NOT NULL,
    porcentaje_rotacion DECIMAL(5,2) NOT NULL, -- (total_retiros / total_personal) * 100
    
    CONSTRAINT fk_rotacion_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT uq_rotacion_mes UNIQUE (id_proyecto, mes)
);

-- 2.3 CUMPLIMIENTO CONTROLES (Auditoría)
CREATE TABLE Cumplimiento_Controles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL,
    total_personal INT NOT NULL,
    total_cumplimiento INT NOT NULL,
    objetivo DECIMAL(5,2) DEFAULT 100.00,
    porcentaje_cumplimiento DECIMAL(5,2) NOT NULL, -- (total_cumplimiento / total_personal) * 100
    
    CONSTRAINT fk_controles_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT uq_controles_mes UNIQUE (id_proyecto, mes)
);

-- 2.4 SEGURIDAD Y SALUD (ACCIDENTES)
CREATE TABLE Accidentes_Incidentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL,
    cantidad INT DEFAULT 1,
    id_tipo_evento INT NOT NULL, -- Relación normalizada
    observaciones TEXT,
    
    CONSTRAINT fk_accidente_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT fk_accidente_tipo FOREIGN KEY (id_tipo_evento) REFERENCES Cat_Tipos_Accidente(id)
);

/* ---------------------------------------------------------------------------------------
   3. MÓDULOS COMPLEJOS (RELACIONES 1:N Y N:M)
--------------------------------------------------------------------------------------- */

-- 3.1 EVALUACIÓN DE DESEMPEÑO (ESTRUCTURA PADRE-HIJO)
-- Cabecera: El registro general del usuario
CREATE TABLE Cumplimiento_Tareas_Plazos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    id_usuario UUID NOT NULL,
    area VARCHAR(100), -- Puede venir del usuario, pero se guarda histórico
    promedio_desempeno DECIMAL(5,2), -- Promedio de los objetivos hijos
    
    CONSTRAINT fk_tareas_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT fk_tareas_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

-- Detalle: Los objetivos específicos (El reporte cualitativo)
CREATE TABLE Objetivos_Cumplimiento_Detalle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cumplimiento_padre UUID NOT NULL, -- Relación con la tabla anterior
    desempeno DECIMAL(5,2) NOT NULL,
    informe_mes TEXT CHECK (LENGTH(informe_mes) >= 350 AND LENGTH(informe_mes) <= 500), -- Validación de negocio estricta
    
    CONSTRAINT fk_objetivos_padre FOREIGN KEY (id_cumplimiento_padre) REFERENCES Cumplimiento_Tareas_Plazos(id) ON DELETE CASCADE
);

-- 3.2 AUSENTISMOS (MANEJO DE ARRAYS VÍA TABLA PUENTE)
CREATE TABLE Ausentismos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    id_usuario UUID NOT NULL,
    mes DATE NOT NULL,
    dias_total_ausencia DECIMAL(4,1) NOT NULL,
    dias_laborales_totales INT NOT NULL, -- Dato global manual
    objetivo DECIMAL(5,2),
    porcentaje_ausentismo DECIMAL(5,2), -- Calculado
    observaciones TEXT,
    
    CONSTRAINT fk_ausentismo_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT fk_ausentismo_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

-- Tabla Puente para soportar múltiples tipos de ausentismo en un solo reporte
-- Soluciona el campo "TIPO_AUSENTISMO ARRAY<>" del Excel de forma profesional
CREATE TABLE Ausentismo_Detalle_Tipo (
    id_ausentismo UUID NOT NULL,
    id_tipo_ausentismo INT NOT NULL,
    
    PRIMARY KEY (id_ausentismo, id_tipo_ausentismo),
    CONSTRAINT fk_det_ausentismo FOREIGN KEY (id_ausentismo) REFERENCES Ausentismos(id) ON DELETE CASCADE,
    CONSTRAINT fk_det_tipo FOREIGN KEY (id_tipo_ausentismo) REFERENCES Cat_Tipos_Ausentismo(id)
);

-- 3.3 SITUACIONES ESPECIALES (MANEJO DE ARRAYS VÍA TABLA PUENTE)
CREATE TABLE Situaciones_Especiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL,
    cantidad INT NOT NULL,
    cantidad_personas_base INT NOT NULL,
    porcentaje_situacion DECIMAL(5,2),
    objetivo DECIMAL(5,2) DEFAULT 0,
    observaciones TEXT,
    
    CONSTRAINT fk_situaciones_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id)
);

-- Tabla Puente para "SITUACION ARRAY<>"
CREATE TABLE Situaciones_Detalle_Tipo (
    id_situacion_esp UUID NOT NULL,
    id_tipo_situacion INT NOT NULL,
    
    PRIMARY KEY (id_situacion_esp, id_tipo_situacion),
    CONSTRAINT fk_det_sit_esp FOREIGN KEY (id_situacion_esp) REFERENCES Situaciones_Especiales(id) ON DELETE CASCADE,
    CONSTRAINT fk_det_sit_tipo FOREIGN KEY (id_tipo_situacion) REFERENCES Cat_Tipos_Situacion(id)
);

/* ---------------------------------------------------------------------------------------
   4. OTROS MÓDULOS
--------------------------------------------------------------------------------------- */

-- 4.1 IDEAS DE MEJORA
CREATE TABLE Ideas_Mejora (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    id_usuario UUID NOT NULL,
    mes DATE NOT NULL,
    descripcion TEXT CHECK (LENGTH(descripcion) >= 350 AND LENGTH(descripcion) <= 500), -- Validación estricta
    
    CONSTRAINT fk_ideas_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT fk_ideas_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

-- 4.2 CAPACITACIONES
CREATE TABLE Capacitaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_proyecto UUID NOT NULL,
    fecha TIMESTAMP NOT NULL,
    tema VARCHAR(255) NOT NULL,
    id_responsable UUID NOT NULL, -- Usuario que dictó o es responsable
    lugar VARCHAR(255),
    
    CONSTRAINT fk_capacitaciones_proyecto FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id),
    CONSTRAINT fk_capacitaciones_resp FOREIGN KEY (id_responsable) REFERENCES Usuarios(id)
);

-- 4.3 VACACIONES
CREATE TABLE Vacaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_proyecto UUID NOT NULL,
    mes DATE NOT NULL,
    dias_acumulados DECIMAL(5,2) NOT NULL, -- Consultar DB externa normalmente, aquí persistido
    observaciones TEXT,
    
    CONSTRAINT fk_vacaciones_usr FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_vacaciones_proy FOREIGN KEY (id_proyecto) REFERENCES Proyectos(id)
);

/* FIN DEL SCHEMA 
   Este script genera la estructura completa de base de datos relacional
   necesaria para soportar la aplicación SOFASA Enterprise.
*/