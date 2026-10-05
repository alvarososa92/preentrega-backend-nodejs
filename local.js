// Catálogo local de iSmart en data/products.json (clase 5: módulos nativos fs y path).
// Misma interfaz que api.js, para usarlo cuando FakeStore no responde.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'data', 'products.json');

const read = async () => JSON.parse(await readFile(FILE, 'utf-8'));
const write = (products) => writeFile(FILE, JSON.stringify(products, null, 2));

export const getProducts = () => read();

export const getProduct = async (id) => {
  const product = (await read()).find((p) => p.id === Number(id));
  if (!product) throw new Error(`Producto ${id} no encontrado`);
  return product;
};

export const createProduct = async (product) => {
  const products = await read();
  const id = Math.max(0, ...products.map((p) => p.id)) + 1;
  const created = { id, ...product };
  await write([...products, created]);
  return created;
};

export const deleteProduct = async (id) => {
  const products = await read();
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new Error(`Producto ${id} no encontrado`);
  await write(products.filter((p) => p.id !== product.id));
  return product;
};
