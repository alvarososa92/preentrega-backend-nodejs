# Anteproyecto — Pre-entrega Backend Node.js

## 1. Contexto

**iSmart** es una tienda de accesorios de celulares (fundas MagSafe, cargadores USB-C,
cables Lightning). Hoy el catálogo se gestiona a mano. El objetivo es una herramienta
de terminal que permita consultar, crear y eliminar productos contra una API REST,
usando la FakeStore API como backend de práctica, tal como pide la consigna.

## 2. Objetivo

Construir una CLI en Node.js que interprete comandos del tipo
`npm run start <MÉTODO> <recurso> [...datos]` y realice la petición HTTP
correspondiente, mostrando el resultado en consola.

## 3. Alcance (requerimientos de la consigna)

| # | Requerimiento | Cómo se cumple |
|---|---|---|
| 1 | `npm init -y`, `"type": "module"`, script `start`, `index.js` como entrada | `package.json` |
| 2a | `GET products` → lista completa | `getProducts()` en `api.js` |
| 2b | `GET products/<id>` → un producto | `getProduct(id)` |
| 2c | `POST products <title> <price> <category>` → crea y muestra el id | `createProduct({...})` |
| 2d | `DELETE products/<id>` → elimina y muestra la respuesta | `deleteProduct(id)` |

Fuera de alcance: `PUT`, persistencia local, interfaz interactiva.

## 4. Diseño

Tres capas (clase 8, separación de responsabilidades):

- **`index.js`** — presentación/control. Lee `process.argv`, valida, decide
  qué función llamar y hace `console.log` del resultado.
- **`store.js`** — selección de fuente de datos. Intenta FakeStore; si hay error de
  red o 5xx, avisa y usa el catálogo local. Un 4xx se propaga como error normal.
- **`api.js`** / **`local.js`** — acceso a datos con la misma interfaz
  (`getProducts`, `getProduct`, `createProduct`, `deleteProduct`). `api.js` envuelve
  `fetch` y chequea `response.ok`; `local.js` lee y escribe `data/products.json` con `fs`.

Motivación del fallback: FakeStore es un proyecto personal que se cae por semanas
(estuvo caída durante todo el desarrollo). El profesor debe poder clonar el repo y
ejecutar la herramienta sin depender de un tercero.

Flujo:

```
npm run start POST products Funda-MagSafe 35000 fundas
        │
        ▼ process.argv.slice(2)
['POST', 'products', 'Funda-MagSafe', '35000', 'fundas']
        │
        ▼ const [method, resource, ...params]   (destructuring, clase 4)
        ▼ resource.split('/')                   (métodos de string)
        ▼ switch (method)                       → createProduct({ title, price, category })
        ▼ fetch POST + JSON.stringify           (clase 6)
        ▼ console.log('Producto creado:', { id: 21, ... })
```

## 5. Conceptos del curso aplicados

| Clase | Concepto | Dónde |
|---|---|---|
| 2 | `node index.js`, punto de entrada | `package.json` → `start` |
| 3 | Funciones flecha, `slice`, template literals | `index.js`, `api.js` |
| 4 | Destructuring de arrays, spread, `??` | `index.js`, `api.js` |
| 5 | `npm init`, scripts, `process.argv`, `import/export`, `fs`, `path`, `__dirname` en ESM | todo, `local.js` |
| 6 | `fetch`, `async/await`, `try/catch`, `response.ok` | `api.js`, `index.js` |
| 7 | Métodos HTTP, header `Content-Type`, status codes | `api.js` |
| 8 | Capas, API REST, consigna | estructura |

## 6. Plan de trabajo

1. ✅ Configuración inicial (`package.json`, ESM, script `start`).
2. ✅ `api.js` con las 4 operaciones sobre `fetch`.
3. ✅ `index.js`: parseo de argumentos, validación, mensaje de uso.
4. ✅ Pruebas de los 4 comandos + casos inválidos (comando desconocido, precio no
   numérico, id inexistente → 404).
5. ✅ `README.md` con instrucciones y ejemplos con productos reales de iSmart.

## 7. Pruebas realizadas

| Comando | Resultado esperado | Estado |
|---|---|---|
| `GET products` | array de productos | ✅ |
| `GET products/15` | objeto del producto 15 | ✅ |
| `POST products Funda-MagSafe 35000 fundas` | objeto con `id` nuevo | ✅ |
| `DELETE products/7` | respuesta de la API | ✅ |
| `PATCH products` | "Método no soportado" + ayuda | ✅ |
| `POST products Remera abc remeras` | error de precio + ayuda | ✅ |
| `GET products/999` | `Error HTTP 404` | ✅ |

| FakeStore caída (521) + `GET products/3` | aviso + producto del catálogo local | ✅ |
| FakeStore caída + `POST` / `DELETE` | aviso + modifica `data/products.json` | ✅ |

Nota: durante todo el desarrollo FakeStore devolvía `HTTP 521` (servidor caído). Las
pruebas contra la API real se hicieron con un mock local; las del fallback, con la API
caída de verdad.

## 8. Posibles mejoras (proyecto final)

- Comando `PUT products/<id>` para actualizar.
- Filtrar por categoría (`GET products/category/<cat>`).
- Reemplazar FakeStore por una API propia de iSmart (ej. Cloudflare Worker + KV) y
  que el catálogo local sea solo respaldo.
