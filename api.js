// Capa de acceso a la API de FakeStore (clase 6: fetch + async/await, clase 8: capas)
// La URL se puede sobreescribir con la variable de entorno FAKESTORE_URL (útil para pruebas)
const BASE_URL = process.env.FAKESTORE_URL ?? 'https://fakestoreapi.com';

// fetch no lanza error en 404/500 (clase 6), por eso chequeamos response.ok
async function request(path, config = {}) {
  const response = await fetch(`${BASE_URL}${path}`, config);
  if (!response.ok) {
    const error = new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export const getProducts = () => request('/products');

export const getProduct = (id) => request(`/products/${id}`);

export const createProduct = (product) =>
  request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
