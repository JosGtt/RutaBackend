import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
  username?: string;
}

// Roles jerárquicos (mayor número = más permisos)
const ROLE_HIERARCHY: { [key: string]: number } = {
  'usuario': 1,
  'admin': 2,
  'desarrollador': 3
};

// Verificar si el usuario tiene al menos el rol requerido
const hasMinimumRole = (userRole: string | undefined, minimumRole: string): boolean => {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
};

// Middleware para verificar permisos de escritura (crear/editar/eliminar)
export const requireWriteAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  console.log('🔐 Verificando permisos de escritura:', {
    userId: req.userId,
    userRole: userRole,
    method: req.method,
    path: req.path
  });
  
  // Solo desarrolladores y admin pueden modificar datos
  if (userRole !== 'desarrollador' && userRole !== 'admin') {
    console.log('❌ Acceso denegado: Usuario sin permisos de escritura');
    return res.status(403).json({ 
      error: 'No tienes permisos para realizar esta acción',
      requiredRole: ['desarrollador', 'admin'],
      yourRole: userRole
    });
  }
  
  console.log('✅ Permisos de escritura verificados correctamente');
  next();
};

// Middleware para verificar permisos de lectura (todos los usuarios autenticados)
export const requireReadAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  console.log('📖 Verificando permisos de lectura:', {
    userId: req.userId,
    userRole: userRole
  });
  
  // Todos los usuarios autenticados pueden leer
  if (!userRole) {
    console.log('❌ Acceso denegado: Usuario no autenticado');
    return res.status(401).json({ 
      error: 'Usuario no autenticado' 
    });
  }
  
  console.log('✅ Permisos de lectura verificados correctamente');
  next();
};

// Middleware para verificar permisos de administrador
export const requireAdminAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  console.log('👑 Verificando permisos de administrador:', {
    userId: req.userId,
    userRole: userRole
  });
  
  // Solo desarrolladores y admin pueden acceder a funciones administrativas
  if (userRole !== 'desarrollador' && userRole !== 'admin') {
    console.log('❌ Acceso denegado: Se requieren permisos de administrador');
    return res.status(403).json({ 
      error: 'Se requieren permisos de administrador para esta acción',
      requiredRole: ['desarrollador', 'admin'],
      yourRole: userRole
    });
  }
  
  console.log('✅ Permisos de administrador verificados correctamente');
  next();
};

// Función auxiliar para verificar roles
export const hasRole = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Verificar si usuario puede editar HR (admin o desarrollador)
export const canEditHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  if (!hasMinimumRole(userRole, 'admin')) {
    return res.status(403).json({ 
      error: 'No tienes permisos para editar hojas de ruta',
      requiredRole: ['admin', 'desarrollador'],
      yourRole: userRole
    });
  }
  next();
};

// Verificar si usuario puede eliminar HR (solo admin o desarrollador)
export const canDeleteHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  if (!hasMinimumRole(userRole, 'admin')) {
    return res.status(403).json({ 
      error: 'No tienes permisos para eliminar hojas de ruta',
      requiredRole: ['admin', 'desarrollador'],
      yourRole: userRole
    });
  }
  next();
};

// Verificar si usuario puede eliminar progreso (solo admin o desarrollador)
export const canDeleteProgreso = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  
  if (!hasMinimumRole(userRole, 'admin')) {
    return res.status(403).json({ 
      error: 'No tienes permisos para eliminar progreso',
      requiredRole: ['admin', 'desarrollador'],
      yourRole: userRole
    });
  }
  next();
};

// Verificar si usuario puede cambiar estado de finalizado a en_proceso (solo admin o desarrollador)
export const canUnfinalizeHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userRole = req.userRole;
  const { estado } = req.body;
  
  // Si está intentando cambiar de finalizada a en_proceso, solo admin/desarrollador
  if (estado === 'en_proceso') {
    if (!hasMinimumRole(userRole, 'admin')) {
      return res.status(403).json({ 
        error: 'Solo administradores pueden reabrir hojas finalizadas',
        requiredRole: ['admin', 'desarrollador'],
        yourRole: userRole
      });
    }
  }
  next();
};

export { hasMinimumRole };
};

// Función auxiliar para verificar si puede editar
export const canEdit = (userRole: string): boolean => {
  return hasRole(userRole, ['desarrollador', 'admin']);
};

// Función auxiliar para verificar si puede crear
export const canCreate = (userRole: string): boolean => {
  return hasRole(userRole, ['desarrollador', 'admin', 'usuario']);
};

// Función auxiliar para verificar si puede leer
export const canRead = (userRole: string): boolean => {
  return hasRole(userRole, ['desarrollador', 'admin', 'usuario']);
};

export default {
  requireWriteAccess,
  requireReadAccess,
  requireAdminAccess,
  hasRole,
  canEdit,
  canCreate,
  canRead
};