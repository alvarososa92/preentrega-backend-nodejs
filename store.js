// Elige la fuente de datos: FakeStore API primero; si no responde (red caída o error 5xx),
// usa el catálogo local de iSmart. Un 4xx (ej. id inexistente) es una respuesta válida y no cae al local.
import * as api from './api.js';
import * as local from './local.js';

const isUnavailable = (error) => !error.status || error.status >= 500;

const withFallback = (name) => async (...args) => {
  try {
    return await api[name](...args);
  } catch (error) {
    if (!isUnavailable(error)) throw error;
    console.warn(`⚠ FakeStore no disponible (${error.message}). Usando catálogo local de iSmart.\n`);
    return local[name](...args);
  }
};

export const getProducts = withFallback('getProducts');
export const getProduct = withFallback('getProduct');
export const createProduct = withFallback('createProduct');
export const deleteProduct = withFallback('deleteProduct');
