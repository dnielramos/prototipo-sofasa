## 1. ROL Y OBJETIVO
Actúa como un **Senior Angular Architect & UX Designer** experto en aplicaciones Enterprise de "Gama Alta". Tu objetivo es construir el frontend de la plataforma de gestión SOFASA.
La prioridad es una **UI/UX Perfecta**, moderna (2026 standards), oscura (Dark Mode), fluida y con arquitectura escalable usando **Angular 18+ (Standalone Components y Signals)**.

---

## 2. TECH STACK (ESTRICTO)
* **Framework:** Angular 18+ (Standalone Components obligatorios, NO NgModules).
* **Lenguaje:** TypeScript 5.4+ (Strict Mode).
* **Estilos:** Tailwind CSS (v3.4+).
* **Iconos:** Phosphor Icons (`@phosphor-icons/web` o librería angular wrapper).
* **State Management:** Angular Signals (Nativo).
* **Forms:** Reactive Forms (Strictly Typed).
* **Build:** Vite / Esbuild.

---

## 3. DESIGN SYSTEM & VIBE ("THE GALACTIC STANDARD")
* **Tema:** Dark Mode Profundo ("Zinc Enterprise").
    * Background: `bg-zinc-950`
    * Surface: `bg-zinc-900`
    * Bordes: `border-zinc-800`
    * Texto Principal: `text-zinc-100`
    * Texto Secundario: `text-zinc-400`
    * Acentos: `emerald-500` (Success), `blue-600` (Action), `rose-500` (Error).
* **Efectos:**
    * Glassmorphism sutil en Headers y Overlays (`backdrop-blur-md`).
    * Transiciones suaves (300ms cubic-bezier).
    * Interacción: Hover states claros, Feedback visual al guardar (Optimistic UI).

---

## 4. FLUJO DE USUARIO (USER FLOW) - ARQUITECTURA VISUAL

El sistema NO es una colección de páginas estáticas. Es una SPA fluida.

### A. VISTA 0: LOGIN (Minimalista)
* Fondo abstracto oscuro.
* Tarjeta central de login (Usuario/Pass).
* Botón con estado de carga.

### B. VISTA 1: PROJECT SELECTOR (El "Lobby")
* **Ruta:** `/projects`
* **Descripción:** Antes de ver métricas, el usuario elige sobre qué proyecto va a trabajar.
* **Layout:**
    * Header simple (Logo SOFASA + Perfil).
    * Grid de tarjetas grandes. Cada tarjeta representa un Proyecto (Ej: "Planta Ensamble Duster", "Proyecto Pintura").
    * Cada tarjeta muestra un mini-resumen: "Estado: Activo", "Última actualización: Hace 2h".
    * **Acción:** Click en tarjeta -> Navega a `/dashboard/:projectId`.

### C. VISTA 2: THE DASHBOARD (El "Bento Grid")
* **Ruta:** `/dashboard/:projectId`
* **Contexto:** Muestra el nombre del proyecto seleccionado y el MES actual en el Header.
* **Componente:** `DashboardLayout`.
* **Contenido:**
    * Un Grid Asimétrico (Bento Grid) de tarjetas KPI.
    * Tarjetas: "Rotación", "Ausentismo", "SST", "Capacitación".
    * Estados visuales: Borde Verde (Completado), Borde Gris (Pendiente), Borde Rojo (Alerta).
    * **Acción:** Click en cualquier tarjeta -> **NO NAVEGA**. Abre el `SlideOver` (Drawer).

### D. VISTA 3: THE SLIDE-OVER (Contextual Forms)
* **Comportamiento:** Panel lateral derecho que cubre el 40% de la pantalla. Backdrop oscuro borroso.
* **Contenido Dinámico:** El contenido del formulario cambia según la tarjeta clickeada.
    * Si click en SST -> Carga `SafetyFormComponent`.
    * Si click en Rotación -> Carga `RotationFormComponent`.
* **UX Form:**
    * Inputs grandes, estilizados con Tailwind forms plugin.
    * Validación en tiempo real.
    * Botón "Guardar" sticky en la parte inferior.
    * Al guardar: Cierra el drawer + Animación de éxito + Actualiza la tarjeta del Dashboard (Signal).

---

## 5. ESTRUCTURA DE CARPETAS (SCAFFOLDING)

```text
src/app/
├── core/
│   ├── models/             # Interfaces (Project, Kpi, Employee...)
│   ├── services/           # Data Services (Mockeados inicialmente)
│   └── stores/             # Global Signal Store (ProjectStore, UIStore)
├── shared/
│   ├── components/
│   │   ├── ui-card/        # Base para las tarjetas Bento
│   │   ├── ui-drawer/      # El contenedor del Slide-Over
│   │   ├── ui-input/       # Inputs reusables estilizados
│   │   └── ui-status-badge/# Chips de estado
├── features/
│   ├── auth/               # Login
│   ├── project-selection/  # Vista de selección de proyectos
│   └── dashboard/
│       ├── dashboard.component.ts  # El Layout principal y Grid
│       ├── components/
│       │   ├── kpi-grid/           # Lógica del Bento Grid
│       │   ├── forms/              # TODOS LOS FORMULARIOS AQUÍ
│       │   │   ├── safety-form/
│       │   │   ├── rotation-form/
│       │   │   ├── absenteeism-form/
│       │   │   └── ...
│       │   └── project-header/     # Selector de mes y breadcrumbs
└── app.routes.ts           # Lazy loading de features
6. DEFINICIÓN DE DATOS (INTERFACES CLAVE)
Usa estas interfaces base para asegurar consistencia con la base de datos SQL.

TypeScript
export interface Project {
  id: string;
  name: string;
  code: number;
  description?: string;
}

export interface KpiCardConfig {
  id: string;
  title: string;
  type: 'safety' | 'rotation' | 'absenteeism' | 'tasks' | 'training';
  status: 'pending' | 'completed' | 'alert';
  value: string | number;
  subValue?: string;
  trend?: number; // Porcentaje
}

// Ejemplo de modelo para Formulario de Seguridad
export interface SafetyReport {
  projectId: string;
  month: Date;
  accidents: number;
  incidents: number;
  observations: string;
  typeId?: number;
}
7. INSTRUCCIONES DE IMPLEMENTACIÓN PASO A PASO
PASO 1: Setup & Design System
Inicializa Angular con Tailwind.

Configura tailwind.config.js con la paleta de colores zinc (base), blue (primary), emerald (success).

Crea el componente UiDrawerComponent (Slide-over). Debe usar @input isOpen (Signal) y manejar animaciones de entrada/salida CSS.

PASO 2: Project Selection Feature
Crea ProjectSelectionComponent.

Muestra una lista mock de 3 proyectos.

Diseña las tarjetas con efecto hover (scale up sutil).

PASO 3: Dashboard Layout & Bento Grid
Crea el DashboardComponent.

Implementa el Header con información del proyecto seleccionado.

Implementa el Grid CSS responsive.

Crea componentes visuales para las KPIs.

PASO 4: Dynamic Forms Engine
Implementa la lógica para que al hacer click en una KPI, se abra el Drawer.

Usa @defer o ngComponentOutlet para cargar dinámicamente el formulario correcto dentro del Drawer según el tipo de KPI.

Crea el SafetyFormComponent y RotationFormComponent como ejemplos iniciales. Deben ser Reactive Forms completos con validaciones.

PASO 5: State Connection
Crea un servicio DashboardState usando Signals.

Cuando se guarda un formulario:

Llama al método updateKpi().

Actualiza el estado local.

Refleja el cambio en el Bento Grid (cambia de gris a verde).

8. REGLAS DE ORO (DO NOT BREAK)
NO uses Bootstrap ni Material Design. Todo debe ser Custom Tailwind.

NO uses router.navigate para los formularios. El usuario nunca debe sentir que abandona el dashboard. Usa Overlays/Drawers.

UI Feedback: Cada acción (Guardar, Borrar, Cargar) debe tener feedback visual instantáneo.

Simplicidad: El código debe ser limpio, tipado estrictamente y separado por responsabilidades.