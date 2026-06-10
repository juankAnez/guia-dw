# GUÍA PRÁCTICA PARA EL PARCIAL
## Node.js + Express + MySQL + Angular — CRUD de una sola entidad

> ⚠️ **LEE ESTO PRIMERO:** Esta guía está diseñada para que completes el parcial paso a paso.
> Todo lo que dice `REEMPLAZAR` significa que debes cambiarlo según la entidad que te dé el docente.
> La entidad de ejemplo usada aquí es **PRODUCTO** (con campos: id, nombre, descripción, precio, cantidad, estado).

---

## FASE 0 — PREPARACIÓN DEL ENTORNO

### Qué instalar

| Programa | Versión mínima | Por qué lo necesitas |
|----------|---------------|----------------------|
| **Node.js** | 18.x LTS | Para ejecutar el backend (servidor) |
| **Angular CLI** | 18.x | Para crear y compilar el frontend |
| **MySQL** | 8.x | Base de datos donde se guardarán los datos |
| **VS Code** | Última | Editor de código recomendado |
| **Postman** o **Thunder Client** | Cualquiera | Para probar la API del backend |

### Instalación paso a paso

#### 1. Node.js
```
Qué hacer:       Ir a https://nodejs.org y descargar la versión LTS (18.x o 20.x)
Por qué:         Node.js es el entorno que ejecutará tu servidor backend
Comando exacto:  No aplica (es instalador gráfico)
Resultado:       Se instala Node.js y npm automáticamente
Verificar:       node -v    → debe mostrar v18.x.x o v20.x.x
                 npm -v     → debe mostrar 9.x.x o 10.x.x
```

**Error común:** "node no se reconoce como comando"
```
Solución: Cerrar y reabrir VS Code / terminal. Si sigue, reiniciar PC.
```

#### 2. Angular CLI
```
Qué hacer:       Instalar Angular CLI globalmente
Por qué:         Es la herramienta para crear proyectos Angular
Comando exacto:  npm install -g @angular/cli
Resultado:       Aparece una barra de progreso y luego mensaje de éxito
Verificar:       ng version
                 → debe mostrar "Angular CLI: 18.x.x"
```

**Error común:** Permisos denegados en Windows
```
Solución: Ejecutar PowerShell o CMD "Como Administrador" y repetir el comando
```

#### 3. MySQL
```
Qué hacer:       Descargar MySQL Installer de https://dev.mysql.com/downloads/installer/
                 Durante la instalación, elegir "MySQL Server" y recordar la contraseña root
Por qué:         MySQL será la base de datos donde se almacenarán los registros
Comando exacto:  No aplica (instalación gráfica)
Verificar:       mysql --version
                 → debe mostrar "mysql Ver 8.x.x"
```
Alternativa: Usar **XAMPP** (incluye phpMyAdmin para administrar MySQL visualmente).

#### 4. Extensiones de VS Code (recomendadas)

| Extensión | Para qué sirve |
|-----------|---------------|
| `Prettier` | Formatea el código automáticamente |
| `ES7+ React/Redux/React-Native snippets` | Atajos JS útiles |
| `MySQL` (de cweijan) | Conectar y ver la BD desde VS Code |
| `Thunder Client` | Probar endpoints sin salir del editor |

### Verificación final del entorno

Ejecuta estos comandos uno por uno y verifica que todos funcionen:

```bash
node -v        # → v18.x.x o v20.x.x
npm -v         # → 9.x.x o 10.x.x
ng version     # → Angular CLI: 18.x.x
mysql --version  # → mysql Ver 8.x.x
```

✅ **FASE 0 COMPLETADA** cuando los 4 comandos muestren números de versión sin errores.

---

## FASE 1 — CREACIÓN DEL BACKEND

### 1.1 Crear el proyecto

```
Qué hacer:       Crear carpeta para el proyecto y un subdirectorio backend
Por qué:         Separar backend del frontend en carpetas diferentes
Comando exacto:
```
```bash
mkdir app-parcial
cd app-parcial
mkdir backend
cd backend
npm init -y
```
```
Resultado:       Se crea la carpeta backend/ con un archivo package.json
```

### 1.2 Instalar dependencias

```bash
npm install express mysql2 cors dotenv
npm install -D nodemon
```

| Dependencia | ¿Para qué sirve? |
|-------------|------------------|
| `express` | Framework para crear el servidor web |
| `mysql2` | Conector con la base de datos MySQL |
| `cors` | Permite que Angular se comunique con el backend |
| `dotenv` | Lee variables de entorno desde un archivo .env |
| `nodemon` | Reinicia el servidor automáticamente al guardar cambios |

### 1.3 Estructura de carpetas

Dentro de la carpeta `backend/`, crea esta estructura:

```
backend/
├── node_modules/       # (se crea automática al instalar)
├── src/
│   ├── config/
│   │   └── db.js       # Conexión a la base de datos
│   ├── controllers/
│   │   └── producto.controller.js   # ← REEMPLAZAR según tu entidad
│   ├── models/
│   │   └── producto.model.js        # ← REEMPLAZAR según tu entidad
│   ├── routes/
│   │   └── producto.routes.js       # ← REEMPLAZAR según tu entidad
│   └── app.js           # Configuración del servidor
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── server.js            # Punto de entrada
```

<details>
<summary>📁 Cómo crear todas las carpetas de una vez (click para expandir)</summary>

```bash
mkdir -p src/config src/controllers src/models src/routes
```
</details>

### 1.4 Archivo .env (variables de entorno)

```
Qué hacer:       Crear el archivo .env en la raíz de backend/
Por qué:         Guardar configuraciones sin exponerlas en el código (seguridad)
```

Crea `backend/.env` con este contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=   # ← PON AQUÍ TU CONTRASEÑA DE MySQL
DB_NAME=bd_productos    # ← REEMPLAZAR: nombre de tu base de datos
DB_PORT=3306
```

**⚠️ IMPORTANTE:** `DB_PASSWORD` debe ser la contraseña que pusiste al instalar MySQL.
Si no tienes contraseña, déjalo vacío: `DB_PASSWORD=`

### 1.5 Conexión a la base de datos

Crea `backend/src/config/db.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bd_productos',  // ← REEMPLAZAR
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 1.6 Servidor Express

Crea `backend/src/app.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes'); // ← REEMPLAZAR

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productoRoutes); // ← REEMPLAZAR

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

module.exports = app;
```

Crea `backend/server.js`:

```javascript
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

### 1.7 Scripts en package.json

Abre `backend/package.json` y reemplaza la sección `"scripts"` con esto:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 1.8 .gitignore

Crea `backend/.gitignore`:

```
node_modules/
.env
```

### 1.9 Probar que el servidor inicia

```
Qué hacer:       Ejecutar el servidor
Comando exacto:
```
```bash
npm run dev
```
```
Resultado esperado:
  > nodemon server.js
  [nodemon] starting `node server.js`
  Servidor corriendo en http://localhost:3000

Verificación:   Abrir http://localhost:3000 en el navegador
                → Debe mostrar: { "mensaje": "API funcionando correctamente" }
```

**Error común:** "port 3000 already in use"
```
Solución: Cambiar el puerto en .env (ej: PORT=3001)
         O cerrar el programa que esté usando el puerto 3000
```

✅ **FASE 1 COMPLETADA** cuando al abrir http://localhost:3000 veas el mensaje JSON.

---

## FASE 2 — CREACIÓN DE LA BASE DE DATOS

### 2.1 Crear la base de datos

Abre MySQL (puede ser desde la terminal o phpMyAdmin) y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS bd_productos;  /* ← REEMPLAZAR nombre */
USE bd_productos;
```

```
Qué hacer:       Crear la base de datos vacía
Por qué:         Ahí se guardará la tabla con los registros
Resultado:       "Query OK, 1 row affected"
Verificar:       SHOW DATABASES; → debe aparecer bd_productos en la lista
```

### 2.2 Crear la tabla principal

```sql
CREATE TABLE productos (          /* ← REEMPLAZAR nombre de la tabla */
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,         /* ← REEMPLAZAR campos */
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL DEFAULT 0,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**⚠️ ¿Qué debes REEMPLAZAR aquí cuando el docente dé la entidad?**
- `productos` → el nombre de tu tabla (ej: `clientes`, `tareas`, `libros`)
- `nombre` → primer campo de tu entidad
- `descripcion` → segundo campo
- `precio` , `cantidad` → campos adicionales
- `estado` y los campos `created_at` / `updated_at` los puedes dejar siempre

### 2.3 Verificar que la tabla se creó bien

```sql
DESCRIBE productos;  /* ← REEMPLAZAR */
```

Debe mostrar todas las columnas con sus tipos de datos.

```sql
SELECT * FROM productos;  /* ← Debe mostrar "Empty set" (aún sin datos) */
```

✅ **FASE 2 COMPLETADA** cuando `DESCRIBE productos` muestre todas las columnas creadas correctamente.

---

## FASE 3 — MODELO

### ¿Qué es el modelo?

El modelo es el archivo que define **cómo se conecta y consulta** la base de datos desde Node.js. Cada función del modelo ejecuta una consulta SQL. **No es una clase ni un ORM complejo**, solo funciones que usan `mysql2`.

### ¿Qué partes cambian según la tabla?

Solo cambian:
- El nombre de la tabla
- Los nombres de las columnas
- Los valores que se insertan/actualizan

### Plantilla del modelo

Crea `backend/src/models/producto.model.js` (← REEMPLAZAR nombre):

```javascript
const pool = require('../config/db');

const tableName = 'productos'; // ← REEMPLAZAR: nombre de tu tabla
const allowedFields = ['nombre', 'descripcion', 'precio', 'cantidad', 'estado']; // ← REEMPLAZAR

const ProductoModel = { // ← REEMPLAZAR nombre del objeto

  // OBTENER TODOS
  getAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
    return rows;
  },

  // OBTENER POR ID
  getById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  },

  // CREAR
  create: async (data) => {
    const [result] = await pool.query(`INSERT INTO ${tableName} SET ?`, [data]);
    return { id: result.insertId, ...data };
  },

  // ACTUALIZAR
  update: async (id, data) => {
    await pool.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [data, id]);
    return { id, ...data };
  },

  // ELIMINAR
  delete: async (id) => {
    const [result] = await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = ProductoModel; // ← REEMPLAZAR
```

**🔴 PARTES QUE DEBES REEMPLAZAR cuando cambie la entidad:**
| Línea | REEMPLAZA | Por |
|-------|-----------|-----|
| `const tableName` | `'productos'` | Nombre de tu tabla |
| `allowedFields` | los campos | Los campos de tu entidad |
| `ProductoModel` | `ProductoModel` | Nombre de tu modelo |
| `module.exports` | `ProductoModel` | Mismo nombre |

El resto del código **NO se toca**.

---

## FASE 4 — CONTROLADOR

### ¿Qué es el controlador?

El controlador recibe las peticiones HTTP (GET, POST, PUT, DELETE) y responde usando el modelo. **Cada método del controlador corresponde a una operación CRUD.**

### Plantilla del controlador

Crea `backend/src/controllers/producto.controller.js` (← REEMPLAZAR):

```javascript
const ProductoModel = require('../models/producto.model'); // ← REEMPLAZAR

const ProductoController = { // ← REEMPLAZAR

  // 📋 LISTAR TODOS (GET /api/productos)
  getAll: async (req, res) => {
    try {
      const items = await ProductoModel.getAll(); // ← REEMPLAZAR
      res.json({ data: items });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registros', detalle: error.message });
    }
  },

  // 🔍 OBTENER POR ID (GET /api/productos/:id)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await ProductoModel.getById(id); // ← REEMPLAZAR
      if (!item) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ data: item });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registro', detalle: error.message });
    }
  },

  // ➕ CREAR (POST /api/productos)
  create: async (req, res) => {
    try {
      // ← REEMPLAZAR: validar los campos que espera tu entidad
      const { nombre, descripcion, precio, cantidad, estado } = req.body;
      if (!nombre || !precio) {
        return res.status(400).json({ error: 'Los campos nombre y precio son obligatorios' });
      }
      const newItem = await ProductoModel.create({ nombre, descripcion, precio, cantidad, estado }); // ← REEMPLAZAR
      res.status(201).json({ data: newItem, mensaje: 'Creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear', detalle: error.message });
    }
  },

  // ✏️ ACTUALIZAR (PUT /api/productos/:id)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, cantidad, estado } = req.body; // ← REEMPLAZAR
      const item = await ProductoModel.getById(id); // ← REEMPLAZAR
      if (!item) return res.status(404).json({ error: 'Registro no encontrado' });
      await ProductoModel.update(id, { nombre, descripcion, precio, cantidad, estado }); // ← REEMPLAZAR
      res.json({ mensaje: 'Actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
    }
  },

  // ❌ ELIMINAR (DELETE /api/productos/:id)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await ProductoModel.delete(id); // ← REEMPLAZAR
      if (!eliminado) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
    }
  }
};

module.exports = ProductoController; // ← REEMPLAZAR
```

**🔴 PARTES QUE DEBES REEMPLAZAR:**
- `ProductoModel` → Nombre de tu modelo (importado y en cada uso)
- `ProductoController` → Nombre del controlador
- `nombre, descripcion, precio, cantidad, estado` → Los campos de TU entidad

---

## FASE 5 — RUTAS

### ¿Qué son las rutas?

Las rutas conectan las URL de la API con los métodos del controlador.
Cuando el frontend hace una petición a `/api/productos`, la ruta sabe que debe ejecutar `ProductoController.getAll`.

### Plantilla de rutas

Crea `backend/src/routes/producto.routes.js` (← REEMPLAZAR):

```javascript
const router = require('express').Router();
const controller = require('../controllers/producto.controller'); // ← REEMPLAZAR

// IMPORTANTE: El nombre de la ruta "/productos" debe coincidir con Angular
router.get('/productos', controller.getAll);       // ← REEMPLAZAR
router.get('/productos/:id', controller.getById);  // ← REEMPLAZAR
router.post('/productos', controller.create);      // ← REEMPLAZAR
router.put('/productos/:id', controller.update);   // ← REEMPLAZAR
router.delete('/productos/:id', controller.delete);// ← REEMPLAZAR

module.exports = router;
```

**🔴 PARTES QUE DEBES REEMPLAZAR:**
- `producto.controller` → nombre del archivo controlador
- `/productos` → nombre de tu entidad en plural (ej: `/clientes`, `/tareas`, `/libros`)

### Registrar las rutas en app.js

Abre `backend/src/app.js` y verifica que la línea `app.use('/api', productoRoutes)` use el mismo nombre de ruta que definiste arriba.

### Verificar que las rutas funcionan

```
Qué hacer:       Iniciar el servidor si no está corriendo
Comando exacto:
```
```bash
cd backend
npm run dev
```
```
Verificación:   Abrir http://localhost:3000/api/productos  (← REEMPLAZAR)
                → Debe mostrar: { "data": [] }
                (array vacío porque aún no hay datos en la BD)
```

✅ **FASE 5 COMPLETADA** cuando `GET /api/productos` devuelva `{ "data": [] }` sin errores.

---

## FASE 6 — PRUEBAS CON POSTMAN

Abre Postman (o Thunder Client en VS Code) y prueba cada endpoint:

### 6.1 Crear un registro (POST)

| Configuración | Valor |
|--------------|-------|
| **Método** | `POST` |
| **URL** | `http://localhost:3000/api/productos` ← REEMPLAZAR |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | |
```json
{
  "nombre": "Laptop HP",
  "descripcion": "Laptop de 15 pulgadas",
  "precio": 2500000,
  "cantidad": 10,
  "estado": "ACTIVO"
}
```
```
Respuesta esperada (201):
  {
    "data": {
      "id": 1,
      "nombre": "Laptop HP",
      "descripcion": "Laptop de 15 pulgadas",
      "precio": 2500000,
      "cantidad": 10,
      "estado": "ACTIVO"
    },
    "mensaje": "Creado correctamente"
  }
```

**Error común:** "Cannot set headers after they are sent"
```
Solución: En el controlador, asegúrate de usar return después de res.status().json()
```

### 6.2 Listar todos (GET)

| Configuración | Valor |
|--------------|-------|
| **Método** | `GET` |
| **URL** | `http://localhost:3000/api/productos` ← REEMPLAZAR |
```
Respuesta esperada (200):
  {
    "data": [
      { "id": 1, "nombre": "Laptop HP", ... }
    ]
  }
```

### 6.3 Obtener por ID (GET)

| Configuración | Valor |
|--------------|-------|
| **Método** | `GET` |
| **URL** | `http://localhost:3000/api/productos/1` ← REEMPLAZAR |
```
Respuesta esperada (200):
  { "data": { "id": 1, "nombre": "Laptop HP", ... } }
```

### 6.4 Actualizar (PUT)

| Configuración | Valor |
|--------------|-------|
| **Método** | `PUT` |
| **URL** | `http://localhost:3000/api/productos/1` ← REEMPLAZAR |
| **Body (raw JSON)** | |
```json
{
  "nombre": "Laptop HP Actualizada",
  "precio": 2600000,
  "cantidad": 8,
  "estado": "ACTIVO"
}
```
```
Respuesta esperada (200):
  { "mensaje": "Actualizado correctamente" }
```

### 6.5 Eliminar (DELETE)

| Configuración | Valor |
|--------------|-------|
| **Método** | `DELETE` |
| **URL** | `http://localhost:3000/api/productos/1` ← REEMPLAZAR |
```
Respuesta esperada (200):
  { "mensaje": "Eliminado correctamente" }
```

### 6.6 Verificar eliminación

```bash
GET http://localhost:3000/api/productos  # El registro ya no debe aparecer
```

✅ **FASE 6 COMPLETADA** cuando los 5 endpoints (POST, GET, GET/:id, PUT, DELETE) respondan correctamente.

---

## FASE 7 — CREACIÓN DEL FRONTEND ANGULAR

### 7.1 Crear proyecto Angular

```bash
# Estás en: app-parcial/
cd ..  # si estás en backend/
ng new frontend --standalone --routing --style=css
```

Cuando pregunte:
- `? Would you like to add Angular routing?` → **Y** (sí)
- `? Which stylesheet format?` → **CSS**

```bash
cd frontend
```

```
Qué hace este comando: Crea un proyecto Angular con:
  - --standalone: componentes independientes (sin NgModules)
  - --routing: incluye el sistema de rutas
  - --style=css: hojas de estilo en CSS plano
```

### 7.2 Verificar que Angular funciona

```bash
ng serve
```

Abrir `http://localhost:4200` → Debe aparecer la página de bienvenida de Angular.

**Error común:** "端口 4200 已被使用" (puerto ocupado)
```
Solución: ng serve --port 4300
```

### 7.3 Instalar PrimeNG (librería de componentes UI)

```bash
npm install primeng @primeuix/themes primeicons
```

### 7.4 Configurar PrimeNG

Abre `frontend/src/app/app.config.ts` y reemplaza TODO el contenido:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: { preset: Aura }
    })
  ]
};
```

Abre `frontend/src/styles.css` y reemplaza TODO con:

```css
@import "tailwindcss";
@import "primeicons/primeicons.css";

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

### 7.5 Crear el modelo en Angular

Crea la carpeta y el archivo del modelo:

```
Qué hacer:       Crear frontend/src/app/models/producto.ts (← REEMPLAZAR)
```

```typescript
export interface Producto {  // ← REEMPLAZAR
  id?: number;
  nombre: string;           // ← REEMPLAZAR campos
  descripcion: string;
  precio: number;
  cantidad: number;
  estado: 'ACTIVO' | 'INACTIVO';
}
```

### 7.6 Crear el servicio HTTP

Crea `frontend/src/app/services/producto.service.ts` (← REEMPLAZAR):

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto'; // ← REEMPLAZAR

@Injectable({ providedIn: 'root' })
export class ProductoService {  // ← REEMPLAZAR

  private apiUrl = 'http://localhost:3000/api/productos'; // ← REEMPLAZAR

  constructor(private http: HttpClient) { }

  getAll(): Observable<{ data: Producto[] }> {  // ← REEMPLAZAR
    return this.http.get<{ data: Producto[] }>(this.apiUrl);
  }

  getById(id: number): Observable<{ data: Producto }> {
    return this.http.get<{ data: Producto }>(`${this.apiUrl}/${id}`);
  }

  create(data: Producto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

**🔴 PARTES QUE DEBES REEMPLAZAR:**
- `Producto` → nombre de tu entidad (en interface, imports y tipados)
- `producto.service` → nombre del archivo
- `ProductoService` → nombre de la clase
- `http://localhost:3000/api/productos` → la URL base de tu API

### 7.7 Configurar rutas de Angular

Abre `frontend/src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' }, // ← REEMPLAZAR
  {
    path: 'productos',  // ← REEMPLAZAR
    loadChildren: () => import('./components/producto/producto.routes').then(m => m.routes)  // ← REEMPLAZAR
  },
  { path: '**', redirectTo: '/productos' }
];
```

✅ **FASE 7 COMPLETADA** cuando `ng serve` compile sin errores.

---

## FASE 8 — CRUD COMPLETO EN ANGULAR

### 8.1 Generar los componentes

```bash
ng g m components/producto --routing  # ← REEMPLAZAR
```

Esto crea la carpeta `components/producto/`.

Luego generar los 4 componentes del CRUD:

```bash
ng g c components/producto/producto-list   # ← REEMPLAZAR
ng g c components/producto/producto-form   # ← REEMPLAZAR
```

### 8.2 Estructura final de componentes

```
frontend/src/app/components/producto/      # ← REEMPLAZAR
├── producto.routes.ts      # Rutas hijas
├── producto-list/
│   ├── producto-list.ts
│   └── producto-list.html
└── producto-form/
    ├── producto-form.ts
    └── producto-form.html
```

<details>
<summary>📄 producto.routes.ts (click para ver)</summary>

```typescript
import { Routes } from '@angular/router';
import { ProductoList } from './producto-list/producto-list';
import { ProductoForm } from './producto-form/producto-form';

export const routes: Routes = [
  { path: '', component: ProductoList },
  { path: 'new', component: ProductoForm },
  { path: 'edit/:id', component: ProductoForm }
];
```
</details>

<details>
<summary>📄 producto-list.ts (click para ver)</summary>

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './producto-list.html'
})
export class ProductoList implements OnInit {
  items: Producto[] = [];
  loading = false;

  constructor(
    private service: ProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res) => { this.items = res.data; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' }); }
    });
  }

  confirmDelete(item: Producto): void {
    this.confirmationService.confirm({
      message: `¿Eliminar "${item.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(item.id!)
    });
  }

  delete(id: number): void {
    this.service.delete(id).subscribe({
      next: () => { this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' }); this.load(); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
    });
  }
}
```
</details>

<details>
<summary>📄 producto-list.html (click para ver)</summary>

```html
<div class="card p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Listado de Productos</h2>
    <p-button label="Nuevo" icon="pi pi-plus" routerLink="/productos/new"></p-button>
  </div>

  <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="10"
    [rowsPerPageOptions]="[5,10,25,50]" dataKey="id" [tableStyle]="{'min-width':'50rem'}">
    <ng-template pTemplate="header">
      <tr>
        <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
        <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
        <th pSortableColumn="precio">Precio <p-sortIcon field="precio"></p-sortIcon></th>
        <th pSortableColumn="cantidad">Cantidad <p-sortIcon field="cantidad"></p-sortIcon></th>
        <th>Estado</th>
        <th class="text-center">Acciones</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-item>
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.nombre }}</td>
        <td>{{ item.precio | currency }}</td>
        <td>{{ item.cantidad }}</td>
        <td>{{ item.estado }}</td>
        <td class="text-center">
          <p-button icon="pi pi-pencil" [routerLink]="['/productos/edit', item.id]" styleClass="p-button-rounded p-button-text p-button-warning" pTooltip="Editar"></p-button>
          <p-button icon="pi pi-trash" (onClick)="confirmDelete(item)" styleClass="p-button-rounded p-button-text p-button-danger" pTooltip="Eliminar"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template pTemplate="emptymessage">
      <tr><td colspan="6" class="text-center p-4">No hay registros</td></tr>
    </ng-template>
  </p-table>
</div>
<p-confirmDialog></p-confirmDialog>
<p-toast></p-toast>
```
</details>

<details>
<summary>📄 producto-form.ts (click para ver)</summary>

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule, ToastModule],
  providers: [MessageService],
  templateUrl: './producto-form.html'
})
export class ProductoForm implements OnInit {
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    estado: ['ACTIVO', Validators.required]
  });

  isEdit = false;
  id?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.loadItem();
    }
  }

  loadItem(): void {
    this.service.getById(this.id!).subscribe({
      next: (res) => this.form.patchValue(res.data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el registro' })
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const obs = this.isEdit
      ? this.service.update(this.id!, this.form.value as any)
      : this.service.create(this.form.value as any);

    obs.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Registro ${this.isEdit ? 'actualizado' : 'creado'} correctamente` });
        setTimeout(() => this.router.navigate(['/productos']), 1000);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
        this.loading = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/productos']); }
}
```
</details>

<details>
<summary>📄 producto-form.html (click para ver)</summary>

```html
<div class="max-w-2xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar' : 'Nuevo' }} Producto</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="flex flex-col gap-4">
        <!-- Nombre -->
        <div>
          <label class="block font-semibold mb-1">Nombre *</label>
          <input pInputText formControlName="nombre" class="w-full" />
          <small class="text-red-500" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">Nombre requerido (mín. 2 caracteres)</small>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block font-semibold mb-1">Descripción</label>
          <input pInputText formControlName="descripcion" class="w-full" />
        </div>

        <!-- Precio y Cantidad -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Precio *</label>
            <p-inputNumber formControlName="precio" mode="currency" currency="COP" locale="es-CO" class="w-full" />
            <small class="text-red-500" *ngIf="form.get('precio')?.invalid && form.get('precio')?.touched">Precio requerido (mín. 1)</small>
          </div>
          <div>
            <label class="block font-semibold mb-1">Cantidad *</label>
            <p-inputNumber formControlName="cantidad" [min]="0" class="w-full" />
          </div>
        </div>

        <!-- Estado -->
        <div>
          <label class="block font-semibold mb-1">Estado</label>
          <p-select formControlName="estado" [options]="[{label:'Activo',value:'ACTIVO'},{label:'Inactivo',value:'INACTIVO'}]" class="w-full"></p-select>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-8">
        <p-button type="submit" label="Guardar" icon="pi pi-save" [loading]="loading" [disabled]="form.invalid"></p-button>
        <p-button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" (onClick)="cancel()"></p-button>
      </div>
    </form>
  </div>
</div>
<p-toast></p-toast>
```
</details>

### 8.3 Verificar que el CRUD funciona

```bash
cd frontend
ng serve
```

Abrir `http://localhost:4200/productos`

✅ **FASE 8 COMPLETADA** cuando puedas:
- ☐ Ver la lista de productos (desde la BD)
- ☐ Crear un nuevo producto
- ☐ Editar un producto existente
- ☐ Eliminar un producto

---

## FASE 9 — CONEXIÓN TOTAL

### Diagrama del flujo completo

```
┌─────────────┐      HTTP      ┌──────────┐     SQL     ┌──────────────┐
│   ANGULAR   │ ──────────────▶ │  NODE.JS │ ──────────▶ │    MYSQL     │
│  Frontend   │ ◀────────────── │  Express │ ◀────────── │  Base de     │
│  :4200      │     JSON        │  :3000   │   Datos     │  Datos       │
└─────────────┘                 └──────────┘             └──────────────┘
```

### Cómo se comunican:

```
1. Angular (producto-list) hace GET a http://localhost:3000/api/productos
2. Node.js recibe la petición y la ruta la dirige al controlador
3. El controlador llama al modelo que ejecuta: SELECT * FROM productos
4. MySQL devuelve los datos → Node.js los envía como JSON → Angular los muestra
```

### Checklist para la conexión

| Componente | Debe estar corriendo en |
|-----------|------------------------|
| **MySQL** | Servicio de Windows (MySQL80) o XAMPP |
| **Backend** | Terminal 1: `cd backend && npm run dev` → http://localhost:3000 |
| **Frontend** | Terminal 2: `cd frontend && ng serve` → http://localhost:4200 |

**Para probar la conexión completa:**
1. Abre `http://localhost:4200`
2. Debe cargar la lista de productos desde la BD
3. Crea un nuevo producto → debe aparecer en la BD
4. Edítalo → los cambios deben persistir
5. Elimínalo → debe desaparecer de la lista

**Error común:** "NullInjectorError: No provider for HttpClient"
```
Solución: Agregar provideHttpClient() en app.config.ts (ver Fase 7.4)
```

**Error común de CORS:** Bloqueo de petición desde Angular
```
Solución: Verificar que backend/src/app.js tenga:
  app.use(cors({ origin: 'http://localhost:4200' }));
```

✅ **FASE 9 COMPLETADA** cuando el frontend Angular se comunique exitosamente con el backend y la BD.

---

## FASE 10 — CHECKLIST DEL PARCIAL

Marca cada casilla cuando lo hayas verificado:

### Backend
- ☐ **Backend inicia**: `npm run dev` funciona sin errores
- ☐ **GET /api/productos** devuelve `{ "data": [...] }`
- ☐ **POST /api/productos** crea registros correctamente
- ☐ **PUT /api/productos/:id** actualiza registros
- ☐ **DELETE /api/productos/:id** elimina registros

### Base de Datos
- ☐ **MySQL está corriendo** (servicio activo)
- ☐ **La base de datos existe** con el nombre correcto
- ☐ **La tabla existe** con las columnas correctas

### Frontend Angular
- ☐ **Angular compila** sin errores (`ng serve`)
- ☐ **Listar**: La tabla muestra los registros de la BD
- ☐ **Crear**: El formulario envía datos al backend
- ☐ **Editar**: El formulario carga datos existentes y los actualiza
- ☐ **Eliminar**: El diálogo de confirmación funciona y elimina

### Conexión
- ☐ **Frontend ↔ Backend**: Angular se conecta a Node.js
- ☐ **Backend ↔ BD**: Node.js se conecta a MySQL
- ☐ **CRUD completo**: Las 4 operaciones funcionan de principio a fin
- ☐ **Sin errores en consola**: F12 → Console, no muestra errores rojos

### 📋 Antes de entregar
- ☐ El proyecto está en una carpeta organizada
- ☐ El `backend/.env` NO está incluido (está en `.gitignore`)
- ☐ El `node_modules/` NO está incluido
- ☐ Backend y frontend inician con los comandos correctos
- ☐ **¡Respaldaste tu proyecto!** (copia en USB / Google Drive / GitHub)

---

## ANEXO A: Datos de prueba con Faker (opcional)

Si quieres generar datos de prueba automáticamente, crea `backend/src/faker/seed.js`:

Primero instala faker:
```bash
npm install @faker-js/faker
```

Luego crea el archivo `backend/src/faker/seed.js` (← REEMPLAZAR campos):

```javascript
const pool = require('../config/db');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

async function seed() {
  const tableName = 'productos'; // ← REEMPLAZAR

  console.log(`Insertando datos de prueba en ${tableName}...`);

  for (let i = 0; i < 20; i++) {
    await pool.query(`INSERT INTO ${tableName} SET ?`, {
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      precio: parseFloat(faker.commerce.price({ min: 1000, max: 5000000 })),
      cantidad: faker.number.int({ min: 1, max: 100 }),
      estado: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO'])
    });
  }

  console.log('✅ Datos de prueba insertados correctamente');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
```

Agrega este script al `package.json`:
```json
"seed": "node src/faker/seed.js"
```

Ejecutar:
```bash
npm run seed
```

---

## ANEXO B: Guía rápida de REEMPLAZO

Cuando el docente te dé la entidad del parcial, sigue esta tabla:

| Archivo | ¿Qué reemplazar? |
|---------|-----------------|
| `.env` → `DB_NAME` | Nombre de la base de datos |
| `backend/src/config/db.js` | database en pool |
| `backend/src/models/producto.model.js` | tableName, allowedFields, nombre del objeto |
| `backend/src/controllers/producto.controller.js` | imports, nombre del objeto, nombres de campos |
| `backend/src/routes/producto.routes.js` | nombre del archivo controlador, ruta `/productos` |
| `backend/src/app.js` | import de rutas, app.use |
| `frontend/src/app/models/producto.ts` | interface, campos |
| `frontend/src/app/services/producto.service.ts` | interface, apiUrl |
| `frontend/src/app/app.routes.ts` | path `/productos` |
| `frontend/src/app/components/producto/` | TODA la carpeta (nombre y referencias) |

---

## ANEXO C: Errores comunes y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED :3306` | MySQL no está corriendo | Iniciar MySQL o XAMPP |
| `ER_BAD_DB_ERROR` | BD no existe | Ejecutar CREATE DATABASE |
| `ER_TABLE_NOT_FOUND` | Tabla no existe | Ejecutar CREATE TABLE |
| `Cannot find module` | Dependencia no instalada | Ejecutar `npm install` |
| `NullInjectorError` | Falta provideHttpClient | Agregar a app.config.ts |
| `CORS error` | Backend no permite Angular | Verificar cors() en app.js |
| `ng no se reconoce` | Angular CLI no instalado | `npm install -g @angular/cli` |

---

> ⚡ **Tip final:** Si en algún momento algo no funciona, revisa la consola del navegador (F12) y la terminal del backend. El error siempre dice exactamente qué está mal. Lee el mensaje completo antes de buscar ayuda.
