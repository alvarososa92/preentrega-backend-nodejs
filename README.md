# iSmart CLI — Gestión de productos desde la terminal

Herramienta de línea de comandos para administrar el catálogo de **iSmart**, tienda de
accesorios de celulares (fundas, cargadores y cables), consumiendo la
[FakeStore API](https://fakestoreapi.com/docs) con Node.js.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo, sin dependencias externas).

## Instalación

```bash
cd Anteproyecto
npm install   # no instala nada, solo valida el package.json
```

## Comandos

| Acción | Comando |
|---|---|
| Listar todos los productos | `npm run start GET products` |
| Consultar un producto | `npm run start GET products/15` |
| Crear un producto | `npm run start POST products <title> <price> <category>` |
| Eliminar un producto | `npm run start DELETE products/7` |

Ejemplos con productos reales de iSmart:

```bash
npm run start POST products Funda-MagSafe-iPhone-14 35000 fundas
npm run start POST products Cargador-Taco-20W 35000 cargadores
npm run start POST products Cable-USB-C-a-Lightning 23800 cables
```

> El título va sin espacios (o entre comillas) porque cada espacio separa un argumento.
> FakeStore no persiste los cambios: el `POST` devuelve el producto con un `id` nuevo
> y el `DELETE` devuelve el producto eliminado, pero el catálogo original no se modifica.

## Estructura

```
Anteproyecto/
├── package.json        "type": "module" y script start
├── index.js            punto de entrada: lee process.argv y decide qué hacer
├── store.js            elige la fuente de datos: FakeStore o catálogo local
├── api.js              acceso a FakeStore API con fetch (GET / POST / DELETE)
├── local.js            acceso al catálogo local con fs (misma interfaz que api.js)
├── data/products.json  catálogo real de iSmart (15 productos)
└── README.md
```

## Si FakeStore está caída

FakeStore se cae seguido (ver [issues del proyecto](https://github.com/keikaavousi/fake-store-api/issues)).
Para que la herramienta funcione siempre, `store.js` intenta primero la API y, si no
responde (error de red o 5xx), avisa por consola y usa el catálogo local de iSmart en
`data/products.json`. En ese modo el `POST` y el `DELETE` sí modifican el archivo.

```
⚠ FakeStore no disponible (Error HTTP 521). Usando catálogo local de iSmart.
```

Un 404 de la API (id inexistente) se muestra como error y **no** cae al catálogo local.

## Manejo de errores

- Comando o método desconocido → muestra la ayuda de uso.
- `POST` con datos incompletos o precio no numérico → mensaje y ayuda.
- Respuesta HTTP 4xx (ej. 404) → `Error HTTP <código>`.
- API caída o sin conexión → aviso y fallback al catálogo local.

La URL de la API se puede cambiar con la variable de entorno `FAKESTORE_URL`.
