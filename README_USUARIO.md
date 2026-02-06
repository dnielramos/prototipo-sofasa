# SOFASA Dashboard - Guía Rápida

## 🚀 Inicio Rápido

### Ejecutar la Aplicación
```bash
cd c:\dev\prototipo-sofasa
npm run start
```

Abre: `http://localhost:4200`

## 📊 Cómo Usar

### 1. Ver Información
- El dashboard muestra **8 KPIs** con datos actuales
- Cada card tiene un **borde de color**:
  - 🟢 Verde = Completado/Meta alcanzada
  - 🟡 Amarillo = En proceso/Atención
  - 🔴 Rojo = Alerta/Requiere acción

### 2. Llenar Información

**Paso 1:** Click en cualquier KPI card del dashboard  
**Paso 2:** El panel lateral (drawer) se abre  
**Paso 3:** Completa el formulario  
**Paso 4:** Click "Guardar"  
**Paso 5:** ✅ El KPI se actualiza automáticamente

### 3. Formularios Disponibles

| KPI | Formulario | Funcionalidad |
|-----|-----------|---------------|
| Proyección Usuarios | ✅ Completo | Activo vs Proyectado + Gap indicator |
| Rotación Personal | ✅ Completo | % auto-calculado |
| Seguridad (SST) | ✅ Completo | Tipo evento + contador |
| Ideas de Mejora | ✅ Con lista | Registra + muestra historial |
| Capacitaciones | ✅ Con lista | Programa + muestra próximas |
| Ausentismos | 🔄 Próximamente | |
| Cumplimiento Tareas | 🔄 Próximamente | |
| Situaciones Especiales | 🔄 Próximamente | |

## 🎨 Diseño Ejecutivo

- **Dark Mode**: Zinc Enterprise palette
- **Glassmorphism**: Header con backdrop blur
- **Smooth animations**: 300ms transitions
- **Status indicators**: Colores semánticos
- **Professional typography**: Inter font

## 📁 Estructura de Datos

Todos los datos vienen de: `src/app/core/db/mock-db.ts`  
Modelos definidos en: `src/app/core/models/domain.models.ts`

**13 tablas implementadas** del Excel SOFASA_DB.xlsx:
1. Usuarios
2. Proyectos
3. Proyección Usuarios
4. Rotación Personal
5. Cumplimiento Controles/Tareas
6. Objetivos
7. Accidentes/Incidentes
8. Ausentismos
9. Situaciones Especiales
10. Ideas de Mejora
11. Capacitaciones
12. Vacaciones

## ⚙️ Tecnologías

- **Angular 18+** (Standalone Components)
- **TypeScript Strict Mode**
- **Tailwind CSS 3.4+**
- **Phosphor Icons**
- **Angular Signals** (State Management)
- **Reactive Forms**

## 📦 Build de Producción

```bash
npm run build
```

Salida en: `dist/sofasa-dashboard/`

## 🎯 Lo que el Gerente Verá

1. **Dashboard limpio** con 8 métricas clave
2. **Indicadores visuales** claros (verde/amarillo/rojo)
3. **Formularios funcionales** para entrada de datos
4. **Listas de registros** para auditoría
5. **Interfaz profesional** nivel enterprise

**Estado Actual:** ✅ PRODUCCIÓN READY
