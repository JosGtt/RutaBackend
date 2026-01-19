import express, { Router } from 'express';
import {
  agregarProgreso,
  agregarProgresoMultiple,
  obtenerHistorialProgreso,
  obtenerUltimoProgreso,
  obtenerTodoProgreso,
  actualizarProgreso,
  eliminarProgreso
} from '../controllers/progresoController';
import { authenticateToken } from '../middleware/auth';
import { canDeleteProgreso } from '../middleware/authorization';

const router: Router = express.Router();

// Rutas protegidas
router.use(authenticateToken);

// POST - Agregar progreso a una sola hoja
// Body: { hoja_ruta_id, ubicacion_anterior, ubicacion_actual, notas? }
router.post('/agregar', agregarProgreso);

// POST - Agregar progreso a múltiples hojas (RÁPIDO)
// Body: { hojas: [{ hoja_ruta_id, ubicacion_anterior, ubicacion_actual, notas? }, ...] }
router.post('/agregar-multiple', agregarProgresoMultiple);

// GET - Obtener historial completo de una hoja
router.get('/historial/:hoja_ruta_id', obtenerHistorialProgreso);

// GET - Obtener último progreso de una hoja
router.get('/ultimo/:hoja_ruta_id', obtenerUltimoProgreso);

// GET - Obtener todo el progreso (dashboard)
router.get('/', obtenerTodoProgreso);

// PUT - Actualizar un progreso - SOLO admin/desarrollador
router.put('/:progreso_id', canDeleteProgreso, actualizarProgreso);

// DELETE - Eliminar un progreso - SOLO admin/desarrollador
router.delete('/:progreso_id', canDeleteProgreso, eliminarProgreso);

export default router;
