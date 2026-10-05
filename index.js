// Punto de entrada: interpreta los comandos de la terminal (clase 5: process.argv)
import { getProducts, getProduct, createProduct, deleteProduct } from './store.js';

const USAGE = `
Uso:
  npm run start GET products
  npm run start GET products/<productId>
  npm run start POST products <title> <price> <category>
  npm run start DELETE products/<productId>
`;

// Destructuring del array de argumentos (clase 4) ignorando node y la ruta del archivo
const [method, resource = '', ...params] = process.argv.slice(2);
// "products/15" -> ['products', '15'] (métodos de strings)
const [entity, id] = resource.split('/');

async function main() {
  if (entity !== 'products') {
    console.log(`Comando no reconocido: ${method ?? ''} ${resource}`.trim());
    console.log(USAGE);
    return;
  }

  switch (method) {
    case 'GET': {
      const result = id ? await getProduct(id) : await getProducts();
      console.log(result);
      break;
    }
    case 'POST': {
      const [title, price, category] = params;
      if (!title || isNaN(Number(price)) || !category) {
        console.log('POST requiere <title> <price> <category> (price numérico)');
        console.log(USAGE);
        return;
      }
      const created = await createProduct({ title, price: Number(price), category });
      console.log('Producto creado:', created);
      break;
    }
    case 'DELETE': {
      if (!id) {
        console.log('DELETE requiere products/<productId>');
        console.log(USAGE);
        return;
      }
      const deleted = await deleteProduct(id);
      console.log('Producto eliminado:', deleted);
      break;
    }
    default:
      console.log(`Método no soportado: ${method}`);
      console.log(USAGE);
  }
}

// Las peticiones asíncronas siempre dentro de try/catch (clase 6)
try {
  await main();
} catch (error) {
  console.error('Error:', error.message);
}
