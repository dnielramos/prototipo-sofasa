/* 
 * REPRESENTACION DE TABLAS CATÁLOGO (SQL) 
 * Mapeo directo a la estructura BCNF de la Base de Datos
 */

export const CAT_TIPOS_ACCIDENTE = [
    { id: 1, nombre: 'Incidente' },
    { id: 2, nombre: 'Accidente' },
    { id: 3, nombre: 'Casi-Accidente' },
    { id: 4, nombre: 'Condición Insegura' }
];

export const CAT_TIPOS_AUSENTISMO = [
    { id: 1, nombre: 'Enfermedad General' },
    { id: 2, nombre: 'Calamidad Doméstica' },
    { id: 3, nombre: 'Licencia Luto' },
    { id: 4, nombre: 'Permiso No Remunerado' },
    { id: 5, nombre: 'Accidente Laboral' },
    { id: 6, nombre: 'Licencia Paternidad/Maternidad' }
];

export const CAT_TIPOS_SITUACION = [
    { id: 1, nombre: 'Permiso Sindical' },
    { id: 2, nombre: 'Restricción Médica' },
    { id: 3, nombre: 'Fuero de Maternidad' },
    { id: 4, nombre: 'Pre-pensionado' },
    { id: 5, nombre: 'Licencia No Remunerada' },
    { id: 6, nombre: 'Fuero Sindical' }
];
