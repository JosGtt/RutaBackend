import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar pool usando DATABASE_URL si existe (para Render/Neon)
let poolConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL (Render, Heroku, Neon)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
  };
  logger.info('Usando DATABASE_URL para conexión PostgreSQL');
} else {
  // Usar variables individuales (desarrollo local)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
  };

  // Habilitar SSL en producción
  if (NODE_ENV === 'production') {
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
    logger.info('SSL habilitado para conexión PostgreSQL');
  }
}

const pool = new Pool(poolConfig);

// Event listeners
pool.on('connect', () => {
  logger.debug('Conexión establecida con PostgreSQL');
});

pool.on('error', (err: Error) => {
  logger.error({
    message: 'Error no esperado en pool de conexiones PostgreSQL',
    error: err.message,
    stack: err.stack
  });
});

pool.on('remove', () => {
  logger.debug('Cliente removido del pool');
});

// Validar conexión al inicializar
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    logger.error({
      message: 'Error conectando a PostgreSQL',
      error: err.message,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
  } else {
    logger.info({
      message: 'Conexión exitosa a PostgreSQL',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      timestamp: result.rows[0].now
    });
  }
});

export default pool;