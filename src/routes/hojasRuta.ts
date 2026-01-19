import { Router } from 'express';
import { 
  crearHojaRuta, 
  listarHojasRuta, 
  obtenerHojaRuta,
  actualizarHojaRuta,
  marcarCompletada,
  cambiarEstadoCumplimiento,
  obtenerEstadisticas,
  obtenerHojasPorVencer,
  cambiarUbicacion,
  cambiarEstadoCompleto,
  obtenerDashboardTiempoReal,
  actualizarEstadoHojaRuta,
  obtenerDestinos,
  eliminarHojaRuta
} from '../controllers/hojasRutaController';
import { authenticateToken } from '../middleware/auth';
import { requireWriteAccess, requireReadAccess, requireAdminAccess, canEditHR, canDeleteHR, canUnfinalizeHR } from '../middleware/authorization';
import {
  validateCreateHojaRuta,
  validateUpdateHojaRuta,
  validateGetHojaRuta,
  validateChangeEstado,
  validateChangeUbicacion,
  validateListQuery,
  sqlInjectionGuard
} from '../utils/validators';

const router = Router();

// Aplicar guardias de seguridad a todas las rutas
router.use(sqlInjectionGuard);

// ============================================
// RUTAS DE LECTURA (Todos los usuarios autenticados)
// ============================================

// Listar/buscar hojas de ruta - LECTURA
router.get(
  '/',
  authenticateToken,
  requireReadAccess,
  validateListQuery,
  listarHojasRuta
);

// Obtener estadísticas para dashboard - LECTURA
router.get(
  '/estadisticas/dashboard',
  authenticateToken,
  requireReadAccess,
  obtenerEstadisticas
);

// Obtener dashboard completo en tiempo real - LECTURA
router.get(
  '/dashboard/tiempo-real',
  authenticateToken,
  requireReadAccess,
  obtenerDashboardTiempoReal
);

// Obtener hojas por vencer - LECTURA
router.get(
  '/por-vencer/lista',
  authenticateToken,
  requireReadAccess,
  obtenerHojasPorVencer
);

// Obtener detalle de hoja de ruta - LECTURA
router.get(
  '/:id',
  authenticateToken,
  requireReadAccess,
  validateGetHojaRuta,
  obtenerHojaRuta
);

// ============================================
// RUTAS DE ESCRITURA (Solo desarrollador/admin)
// ============================================

// Crear hoja de ruta
router.post(
  '/',
  authenticateToken,
  validateCreateHojaRuta,
  crearHojaRuta
);

// Actualizar hoja de ruta completa - SOLO admin/desarrollador
router.put(
  '/:id',
  authenticateToken,
  canEditHR,
  validateUpdateHojaRuta,
  actualizarHojaRuta
);

// Marcar hoja como completada - Cualquier usuario autenticado
router.patch(
  '/:id/completar',
  authenticateToken,
  validateGetHojaRuta,
  marcarCompletada
);

// Cambiar estado de cumplimiento - Verificar si puede desmarcar finalizado
router.patch(
  '/:id/estado',
  authenticateToken,
  canUnfinalizeHR,
  validateChangeEstado,
  cambiarEstadoCumplimiento
);

// Cambiar estado completo - SOLO admin/desarrollador
router.patch(
  '/:id/estado-completo',
  authenticateToken,
  requireWriteAccess,
  validateChangeEstado,
  cambiarEstadoCompleto
);

// Cambiar ubicación de hoja de ruta - Cualquier usuario autenticado
router.patch(
  '/:id/ubicacion',
  authenticateToken,
  validateChangeUbicacion,
  cambiarUbicacion
);

// Eliminar hoja de ruta - SOLO admin/desarrollador
router.delete(
  '/:id',
  authenticateToken,
  canDeleteHR,
  eliminarHojaRuta
);

export default router;
