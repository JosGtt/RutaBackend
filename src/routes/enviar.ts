import { Router } from 'express';
import { 
  crearEnvio, 
  listarEnvios, 
  actualizarEstadoEnvio, 
  obtenerDestinos 
} from '../controllers/enviarController';
import { authenticateToken } from '../middleware/auth';
import {
  validateCreateEnvio,
  validateListQuery,
  sqlInjectionGuard
} from '../utils/validators';

const router = Router();

// Aplicar guardias de seguridad
router.use(sqlInjectionGuard);

// POST /api/enviar - Registrar nuevo envío de documentos
router.post(
  '/',
  authenticateToken,
  validateCreateEnvio,
  crearEnvio
);

// GET /api/enviar - Listar todos los envíos
router.get(
  '/',
  authenticateToken,
  validateListQuery,
  listarEnvios
);

// PUT /api/enviar/:id/estado - Actualizar estado de envío específico
router.put(
  '/:id/estado',
  authenticateToken,
  validateCreateEnvio,
  actualizarEstadoEnvio
);

// GET /api/enviar/destinos - Obtener destinos disponibles
router.get(
  '/destinos',
  authenticateToken,
  obtenerDestinos
);

export default router;
