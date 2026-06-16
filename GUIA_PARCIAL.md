# GUÍA PRÁCTICA PARA EL PARCIAL
## Node.js + Express + TypeScript + Sequelize + MySQL + Angular — CRUD de una sola entidad

> ⚠️ **LEE ESTO PRIMERO:** Esta guía está diseñada para que completes el parcial paso a paso.
> Todo lo que dice `REEMPLAZAR` significa que debes cambiarlo según la entidad que te dé el docente.
> La entidad de ejemplo usada aquí es **CLIENTE** (con campos: id, name, email, phone, address, status).
> Esta guía es una versión corregida y funcional calcada de la guía del docente, usando **TypeScript**, **Sequelize** como ORM, **Express** y **MySQL**.

---

## FASE 0 — PREPARACIÓN DEL ENTORNO

### Qué instalar

| Programa | Versión mínima | Por qué lo necesitas |
|----------|---------------|----------------------|
| **Node.js** | 18.x LTS | Para ejecutar el backend (servidor) con TypeScript |
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
                 → debe mostrar "mysql  Ver 8.x.x"
```
Alternativa: Usar **XAMPP** (incluye phpMyAdmin para administrar MySQL visualmente).

#### 4. Extensiones de VS Code (recomendadas)

| Extensión | Para qué sirve |
|-----------|---------------|
| `Prettier` | Formatea el código automáticamente |
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

## FASE 1 — CREACIÓN DEL BACKEND (NODE + EXPRESS + TYPESCRIPT)

### 1.1 Crear la carpeta del proyecto

```
Qué hacer:       Crear carpeta principal y subcarpeta backend
Por qué:         El backend y el frontend van en carpetas separadas
```

```bash
mkdir app-parcial
cd app-parcial
mkdir backend
cd backend
npm init -y
```

```
Resultado:       Se crea backend/ con un package.json
```

### 1.2 Instalar dependencias del backend

**Dependencias de producción:**
```
Qué hacer:       Instalar los paquetes que el servidor necesita para funcionar
```

```bash
npm install express cors morgan dotenv sequelize mysql2
```

> **💡 Cambia `mysql2`** por `pg` (PostgreSQL), `tedious` (SQL Server) u `oracledb` (Oracle) según el motor que uses.

| Dependencia | ¿Para qué sirve |
|-------------|------------------|
| `express` | Framework para crear el servidor web |
| `cors` | Permite que Angular se comunique con el backend |
| `morgan` | Muestra en consola cada petición HTTP (logging) |
| `dotenv` | Lee variables de entorno desde el archivo .env |
| `sequelize` | ORM para conectar y operar la base de datos |
| `mysql2` / `pg` / `tedious` / `oracledb` | Driver según motor: `mysql2`(MySQL), `pg`(PostgreSQL), `tedious`(SQL Server), `oracledb`(Oracle) |

**Dependencias de desarrollo:**
```
Qué hacer:       Instalar TypeScript y sus tipos para desarrollo
```

```bash
npm install -D typescript @types/node nodemon ts-node
npm install -D @types/express @types/morgan @types/cors @types/sequelize
```

| Dependencia | ¿Para qué sirve? |
|-------------|------------------|
| `typescript` | El compilador de TypeScript a JavaScript |
| `@types/node` | Tipos de Node.js para TypeScript |
| `nodemon` | Reinicia el servidor automáticamente al guardar cambios |
| `ts-node` | Ejecuta archivos .ts directamente sin compilar |
| `@types/express` | Tipos de Express para TypeScript |
| `@types/morgan` | Tipos de Morgan para TypeScript |
| `@types/cors` | Tipos de CORS para TypeScript |
| `@types/sequelize` | Tipos de Sequelize para TypeScript |

### 1.3 Inicializar TypeScript

```
Qué hacer:       Generar el archivo tsconfig.json con la configuración del compilador
```

```bash
npx tsc --init
```

```
Resultado:       Se crea tsconfig.json en la raíz de backend/
```

### 1.4 Configurar tsconfig.json

```
Qué hacer:       Modificar tsconfig.json para que funcione con Express y Sequelize
Por qué:         TypeScript necesita saber dónde está el código fuente y dónde dejar el compilado
```

Abre `backend/tsconfig.json` y **reemplaza TODO** su contenido con esto:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "verbatimModuleSyntax": false,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

| Opción | ¿Qué hace? |
|--------|-----------|
| `"module": "commonjs"` | Usa el sistema de módulos de Node.js (require/module.exports) |
| `"rootDir": "./src"` | El código fuente está en la carpeta src/ |
| `"outDir": "./dist"` | El código compilado se guarda en dist/ |
| `"esModuleInterop": true` | Permite importar módulos CommonJS con sintaxis ES |
| `"strict": true` | Activa todas las validaciones de tipos |
| `"skipLibCheck": true` | Omite revisar tipos en node_modules (acelera compilación) |

**⚠️ Error común:** Si el `outDir` no coincide con `rootDir`, TypeScript da error de compilación.
```
Solución: Verifica que rootDir apunte a ./src y outDir a ./dist
```

### 1.5 Configurar scripts en package.json

```
Qué hacer:       Modificar los scripts del package.json para compilar y ejecutar
```

Abre `backend/package.json` y **reemplaza** la sección `"scripts"` con esto:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "nodemon src/server.ts"
}
```

| Script | Comando | ¿Qué hace? |
|--------|---------|-----------|
| `build` | `tsc` | Compila TypeScript → JavaScript en dist/ |
| `start` | `node dist/server.js` | Ejecuta el servidor compilado (producción) |
| `dev` | `nodemon src/server.ts` | Ejecuta en desarrollo con recarga automática |

**⚠️ `nodemon src/server.ts` funciona sin `--exec ts-node` porque nodemon 3+ detecta automáticamente ts-node cuando está instalado en el proyecto.**

### 1.6 Crear estructura de carpetas

```
Qué hacer:       Crear las carpetas del backend según la arquitectura del docente
Por qué:         El docente evalúa la estructura de carpetas
```

```bash
mkdir src
mkdir src\config
mkdir src\controllers
mkdir src\database
mkdir src\faker
mkdir src\http
mkdir src\models
mkdir src\routes
```

**Árbol final de backend/:**

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts          # Clase App (configuración principal)
│   ├── controllers/
│   │   └── cliente.controller.ts    # ← REEMPLAZAR
│   ├── database/
│   │   └── db.ts             # Conexión Sequelize a MySQL
│   ├── faker/
│   │   └── seed.ts           # Datos de prueba con @faker-js/faker
│   ├── http/
│   │   └── clientes.http     # Pruebas de endpoints
│   ├── models/
│   │   └── Cliente.ts             # ← REEMPLAZAR (modelo Sequelize)
│   ├── routes/
│   │   └── cliente.routes.ts      # ← REEMPLAZAR
│   └── server.ts             # Punto de entrada del servidor
├── .env                      # Variables de entorno
├── .gitignore
├── package.json
└── tsconfig.json
```

### 1.7 Crear archivo .env (variables de entorno)

```
Qué hacer:       Crear el archivo .env en la raíz de backend/
Por qué:         Guardar configuraciones sin exponerlas en el código
```

Crea `backend/.env` con este contenido:

```env
PORT=4000

# Motor de base de datos: mysql, postgres, sqlserver, oracle, sqlite
DB_ENGINE=mysql

# ---- MySQL (DB_ENGINE=mysql) ----
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_NAME=bd_clientes
MYSQL_PORT=3306

# ---- PostgreSQL (DB_ENGINE=postgres) ----
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=
PG_NAME=bd_clientes
PG_PORT=5432

# ---- SQL Server (DB_ENGINE=sqlserver) ----
SQLSERVER_HOST=localhost
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=
SQLSERVER_NAME=bd_clientes
SQLSERVER_PORT=1433

# ---- Oracle (DB_ENGINE=oracle) ----
ORACLE_HOST=localhost
ORACLE_USER=system
ORACLE_PASSWORD=
ORACLE_NAME=bd_clientes
ORACLE_PORT=1521

# ---- SQLite (DB_ENGINE=sqlite) ----
# SQLite no necesita host/user/password/port
DB_STORAGE=./database.sqlite
```

| Variable | ¿Qué es? | REEMPLAZAR |
|----------|----------|-----------|
| `PORT` | Puerto del servidor backend (4000) | No se cambia |
| `DB_ENGINE` | Motor de BD: `mysql`, `postgres`, `sqlserver`, `oracle`, `sqlite` | **Cambiar según tu motor** |
| `MYSQL_HOST` / `PG_HOST` / `SQLSERVER_HOST` / `ORACLE_HOST` | Dirección del servidor | `localhost` |
| `MYSQL_USER` / etc. | Usuario del motor | Según tu motor |
| `MYSQL_PASSWORD` / etc. | Contraseña | **PON LA TUYA** |
| `MYSQL_NAME` / `PG_NAME` / `SQLSERVER_NAME` / `ORACLE_NAME` | Nombre de la base de datos | `bd_clientes` → **el de tu entidad** |
| `MYSQL_PORT` / etc. | Puerto del motor | Según tu motor |
| `DB_STORAGE` | Ruta archivo SQLite (solo sqlite) | `./database.sqlite` |

**⚠️ IMPORTANTE:** Solo las variables del motor que elijas en `DB_ENGINE` son necesarias. Las demás pueden quedar con valores por defecto. La contraseña debe ser la que pusiste al instalar tu motor de BD.

### 1.8 Crear archivo .gitignore

```
Qué hacer:       Evitar que node_modules y .env se suban al repositorio
```

Crea `backend/.gitignore`:

```
node_modules/
dist/
.env
```

### 1.9 Crear server.ts (punto de entrada)

```
Qué hacer:       Crear el archivo que arranca el servidor
```

Crea `backend/src/server.ts`:

```typescript
import { App } from './config/index';

async function main() {
    const app = new App();
    await app.listen();
}

main();
```

**⚠️ Error común:** Si usas `import app from './config'` sin llaves, no funciona.
```
Solución: La clase App se exporta con nombre, así que debe ir entre llaves: import { App }
```

### 1.10 Crear config/index.ts (clase App)

```
Qué hacer:       Crear la clase principal que configura Express, middlewares, rutas y BD
Por qué:         Es la arquitectura que usa el docente
```

Crea `backend/src/config/index.ts`:

```typescript
import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import morgan from "morgan";
import { sequelize, testConnection, getDatabaseInfo } from "../database/db";
import cors from "cors";

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // ⚠️ IMPORTANTE: Aquí se registran TODAS las rutas de la API
    // Más adelante (Fase 5) agregaremos: this.app.use('/api/clientes', clienteRoutes);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔌 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // Sincronizar modelos con la BD (crea las tablas automáticamente si no existen)
      await sequelize.sync({ force: false });
      console.log(`📦 Base de datos sincronizada exitosamente`);

    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
```

**⚠️ Error común:** `import cors from "cors"` no funciona porque cors usa module.exports.
```
Solución: El flag "esModuleInterop": true en tsconfig.json lo resuelve automáticamente.
Si ves "cors_1.default is not a function", usa: import cors = require("cors");
```

### 1.11 Probar que el servidor inicia

```
Qué hacer:       Ejecutar el servidor en modo desarrollo
```

```bash
npm run dev
```

```
Resultado esperado:
  > nodemon src/server.ts
  [nodemon] 3.x.x
  [nodemon] starting `ts-node src/server.ts`
  🔌 Intentando conectar a: MYSQL
  ❌ Error al conectar con la base de datos: ... (ESTO ES NORMAL, aún no creamos la BD)
```

```
Verificación:   El servidor INTENTA arrancar pero falla al conectar con MySQL.
                Si ves el error de conexión a BD, significa que Express funciona bien.
                Si ves errores de TypeScript, revisa tsconfig.json y las importaciones.
```

**Error común de compilación:** "Cannot find module 'express'"
```
Solución: Ejecuta npm install desde la carpeta backend/
```

**Error común de TypeScript:** "Unknown file extension .ts"
```
Solución: npm install -D ts-node
```

✅ **FASE 1 COMPLETADA** cuando `npm run dev` ejecute TypeScript sin errores de sintaxis
(aunque falle la conexión a BD, eso lo resolvemos en la Fase 2).

---

## FASE 2 — BASE DE DATOS Y TABLA ÚNICA

### 2.1 Crear la base de datos

```
Qué hacer:       Crear la base de datos vacía usando tu motor de BD
Por qué:         Sequelize sincronizará los modelos creando las tablas automáticamente
```

**Según tu motor de BD, abre el cliente correspondiente** (MySQL Workbench, pgAdmin, SQL Server Management Studio, SQL*Plus, etc.) y ejecuta:

```sql
/* MySQL / SQL Server */
CREATE DATABASE IF NOT EXISTS bd_clientes;
USE bd_clientes;

/* PostgreSQL */
-- CREATE DATABASE bd_clientes;
-- \c bd_clientes

/* Oracle */
-- CREATE USER bd_clientes IDENTIFIED BY password;
-- GRANT CONNECT, RESOURCE TO bd_clientes;
```

```
Resultado esperado según tu motor: "CREATE DATABASE" / "Query OK" / "Database changed"
```

**⚠️ IMPORTANTE:** El nombre de la BD debe coincidir con el `NAME` de tu motor en `.env` (ej. `MYSQL_NAME`, `PG_NAME`, `SQLSERVER_NAME`, `ORACLE_NAME`).

### 2.2 NO crees las tablas manualmente

```
Qué hacer:       En esta guía NO ejecutamos CREATE TABLE manual
Por qué:         Sequelize crea las tablas automáticamente al ejecutar sequelize.sync()
                 basándose en los modelos que definamos en TypeScript (Fase 3).
```

**Pero debes saber qué tabla se va a crear:**

| Columna | Tipo | Detalle |
|---------|------|---------|
| `id` | INT AUTO_INCREMENT | Primary Key |
| `name` | VARCHAR(255) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `phone` | VARCHAR(255) | Puede ser NULL |
| `address` | TEXT | Puede ser NULL |
| `status` | ENUM('ACTIVE','INACTIVE') | DEFAULT 'ACTIVE' |
| `createdAt` | DATETIME | Lo maneja Sequelize automáticamente |
| `updatedAt` | DATETIME | Lo maneja Sequelize automáticamente |

**🔴 Cuando el docente dé otra entidad, estos campos cambian.**

### 2.3 Verificar que la BD existe

```sql
/* Según tu motor */
SELECT VERSION();                     -- MySQL
SHOW DATABASES;                       -- MySQL
\list                                -- PostgreSQL
SELECT name FROM sys.databases;       -- SQL Server
SELECT * FROM all_users;              -- Oracle
```

✅ **FASE 2 COMPLETADA** cuando la base de datos `bd_clientes` (o el nombre que hayas elegido) exista en tu motor de BD.

---

## FASE 3 — MODELO CON SEQUELIZE

### 3.1 Crear la conexión a la base de datos (database/db.ts)

```
Qué hacer:       Crear la configuración de Sequelize para conectar con MySQL
Por qué:         Todos los modelos usarán esta instancia de Sequelize
```

Crea `backend/src/database/db.ts`:

```typescript
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  dialect: string;
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfigurations: Record<string, DatabaseConfig> = {
  mysql: {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_NAME || "bd_clientes",
    port: parseInt(process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.PG_HOST || "localhost",
    username: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "",
    database: process.env.PG_NAME || "bd_clientes",
    port: parseInt(process.env.PG_PORT || "5432")
  },
  sqlserver: {
    dialect: "mssql",
    host: process.env.SQLSERVER_HOST || "localhost",
    username: process.env.SQLSERVER_USER || "sa",
    password: process.env.SQLSERVER_PASSWORD || "",
    database: process.env.SQLSERVER_NAME || "bd_clientes",
    port: parseInt(process.env.SQLSERVER_PORT || "1433")
  },
  oracle: {
    dialect: "oracle",
    host: process.env.ORACLE_HOST || "localhost",
    username: process.env.ORACLE_USER || "system",
    password: process.env.ORACLE_PASSWORD || "",
    database: process.env.ORACLE_NAME || "bd_clientes",
    port: parseInt(process.env.ORACLE_PORT || "1521")
  }
};

const selectedEngine = process.env.DB_ENGINE || "mysql";
const selectedConfig = dbConfigurations[selectedEngine];

if (!selectedConfig) {
  throw new Error(`Motor de base de datos no soportado: ${selectedEngine}`);
}

console.log(`🔌 Conectando a base de datos: ${selectedEngine.toUpperCase()}`);

export let sequelize: Sequelize;

if (selectedEngine === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    logging: false
  });
} else {
  const sequelizeOptions: any = {
    host: selectedConfig.host,
    port: selectedConfig.port,
    dialect: selectedConfig.dialect as any,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  // SQL Server necesita opciones adicionales
  if (selectedEngine === "sqlserver") {
    sequelizeOptions.dialectOptions = {
      encrypt: false,
      trustServerCertificate: true
    };
  }

  sequelize = new Sequelize(
    selectedConfig.database,
    selectedConfig.username,
    selectedConfig.password,
    sequelizeOptions
  );
}

export const getDatabaseInfo = () => {
  return {
    engine: selectedEngine,
    config: selectedConfig,
    connectionString: `${selectedConfig.dialect}://${selectedConfig.username}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`
  };
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${selectedEngine.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error(`❌ Error de conexión a ${selectedEngine.toUpperCase()}:`, error);
    return false;
  }
};
```

**⚠️ Error común:** `ECONNREFUSED :xxxx` (ej. :3306, :5432, :1433, :1521)
```
Causa: El motor de base de datos no está corriendo en el puerto indicado.
Solución: Inicia el servicio de tu motor de BD (MySQL desde Servicios/XAMPP, PostgreSQL desde pgAdmin/servicios, etc.) y verifica el puerto en .env.
```

### 3.2 Crear el modelo de la entidad (models/Cliente.ts)

```
Qué hacer:       Definir el modelo Sequelize que representa la tabla clientes
Por qué:         Sequelize usará este modelo para crear la tabla y operar con los datos
```

Crea `backend/src/models/Cliente.ts` (← REEMPLAZAR nombre):

```typescript
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export interface ClienteI {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Cliente extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Cliente.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    }
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "clientes",
    timestamps: true
  }
);
```

**🔴 PARTES QUE DEBES REEMPLAZAR cuando cambie la entidad:**

| Línea | REEMPLAZA | Por |
|-------|-----------|-----|
| `class Cliente` | `Cliente` | Nombre de tu entidad |
| `interface ClienteI` | `ClienteI` | Mismo nombre + "I" |
| `tableName: "clientes"` | `"clientes"` | Nombre de la tabla en BD |
| Campos (name, email, etc.) | Los actuales | Los campos de tu entidad |
| `export class Cliente` | `Cliente` | Mismo nombre |

**⚠️ Error común:** `SequelizeDatabaseError: Unknown column 'createdAt'`
```
Causa: La tabla ya existe pero sin las columnas createdAt/updatedAt.
Solución: Elimina la tabla manual (DROP TABLE clientes) y deja que Sequelize la recree,
          o cambia sequelize.sync({ force: true }) UNA SOLA VEZ (esto borra datos existentes).
```

✅ **FASE 3 COMPLETADA** cuando el modelo esté creado con sus campos y tipos correctos.

---

## FASE 4 — CONTROLADOR (CRUD COMPLETO)

### 4.1 ¿Qué es el controlador?

El controlador recibe las peticiones HTTP (GET, POST, PUT, DELETE) y responde usando el modelo de Sequelize. **Cada método del controlador corresponde a una operación CRUD.**

### 4.2 Crear el controlador

Crea `backend/src/controllers/cliente.controller.ts` (← REEMPLAZAR):

```typescript
import { Request, Response } from 'express';
import { Cliente, ClienteI } from '../models/Cliente'; // ← REEMPLAZAR

export class ClienteController { // ← REEMPLAZAR

  // 📋 LISTAR TODOS (GET /api/clientes)
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items: ClienteI[] = await Cliente.findAll(); // ← REEMPLAZAR
      res.status(200).json({ data: items });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registros', detalle: error });
    }
  }

  // 🔍 OBTENER POR ID (GET /api/clientes/:id)
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Cliente.findByPk(id); // ← REEMPLAZAR
      if (!item) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      res.status(200).json({ data: item });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registro', detalle: error });
    }
  }

  // ➕ CREAR (POST /api/clientes)
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, address, status } = req.body; // ← REEMPLAZAR campos
      if (!name || !email) {                                     // ← REEMPLAZAR validación
        res.status(400).json({ error: 'Los campos name y email son obligatorios' });
        return;
      }
      const newItem = await Cliente.create({ name, email, phone, address, status }); // ← REEMPLAZAR
      res.status(201).json({ data: newItem, mensaje: 'Creado correctamente' });
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'El email ya existe' });
        return;
      }
      res.status(500).json({ error: 'Error al crear', detalle: error });
    }
  }

  // ✏️ ACTUALIZAR (PUT /api/clientes/:id)
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, phone, address, status } = req.body; // ← REEMPLAZAR campos

      const item = await Cliente.findByPk(id); // ← REEMPLAZAR
      if (!item) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }

      await Cliente.update(
        { name, email, phone, address, status }, // ← REEMPLAZAR campos
        { where: { id } }
      );

      res.status(200).json({ mensaje: 'Actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar', detalle: error });
    }
  }

  // ❌ ELIMINAR (DELETE /api/clientes/:id)
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Cliente.findByPk(id); // ← REEMPLAZAR
      if (!item) {
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
      }
      await Cliente.destroy({ where: { id } }); // ← REEMPLAZAR
      res.status(200).json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar', detalle: error });
    }
  }
}
```

**🔴 PARTES QUE DEBES REEMPLAZAR cuando cambie la entidad:**

| Parte | REEMPLAZA | Por |
|-------|-----------|-----|
| `ClienteController` | `ClienteController` | Nombre de tu controlador |
| `import { Cliente, ClienteI }` | `Cliente` | Nombre de tu modelo |
| `name, email, phone, address, status` | Los campos actuales | Campos de tu entidad |
| Validación `!name \|\| !email` | Validación requerida | Campos obligatorios |

**⚠️ Importante sobre `res.status().json()`:** Después de enviar la respuesta, usa `return` para evitar el error "Cannot set headers after they are sent".

✅ **FASE 4 COMPLETADA** cuando el controlador tenga los 4 métodos (getAll, getById, create, update, delete).

---

## FASE 5 — RUTAS

### 5.1 ¿Qué son las rutas?

Las rutas conectan las URL de la API con los métodos del controlador.
Cuando el frontend hace una petición a `/api/clientes`, la ruta sabe que debe ejecutar `clienteController.getAll`.

### 5.2 Crear las rutas

Crea `backend/src/routes/cliente.routes.ts` (← REEMPLAZAR):

```typescript
import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller'; // ← REEMPLAZAR

const router = Router();
const controller = new ClienteController(); // ← REEMPLAZAR

// IMPORTANTE: "/" aquí corresponde a "/api/clientes" después de registrar en config/index.ts
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
```

**🔴 PARTES QUE DEBES REEMPLAZAR:**

| Parte | REEMPLAZA | Por |
|-------|-----------|-----|
| `cliente.controller` | `cliente.controller` | Nombre de tu archivo controlador |
| `ClienteController` | `ClienteController` | Nombre de la clase controlador |
| `controller` | `controller` | Instancia del controlador |

### 5.3 Registrar las rutas en config/index.ts

```
Qué hacer:       Conectar las rutas con la aplicación Express
Por qué:         Sin este paso, las rutas no responderán a las peticiones HTTP
```

Abre `backend/src/config/index.ts` y modifica el método `private routes()`:

```typescript
private routes(): void {
  this.app.use('/api/clientes', clienteRoutes); // ← REEMPLAZAR
}
```

Y agrega la importación al inicio del archivo:

```typescript
import clienteRoutes from '../routes/cliente.routes'; // ← REEMPLAZAR
```

**El archivo `backend/src/config/index.ts` completo queda así:**

```typescript
import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import morgan from "morgan";
import { sequelize, testConnection, getDatabaseInfo } from "../database/db";
import cors from "cors";

import clienteRoutes from '../routes/cliente.routes'; // ← REEMPLAZAR

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.app.use('/api/clientes', clienteRoutes); // ← REEMPLAZAR la ruta
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔌 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      await sequelize.sync({ force: false });
      console.log(`📦 Base de datos sincronizada exitosamente`);

    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
```

### 5.4 Verificar que el servidor arranca sin errores

```bash
cd backend
npm run dev
```

```
Resultado esperado (TODO CONECTADO):
  🔌 Conectando a base de datos: MYSQL
  ✅ Conexión exitosa a MYSQL
  📦 Base de datos sincronizada exitosamente
  🚀 Servidor ejecutándose en puerto 4000
```

Abre `http://localhost:4000/api/clientes` en el navegador.
```
Respuesta esperada: { "data": [] }
```

✅ **FASE 5 COMPLETADA** cuando `GET /api/clientes` devuelva `{ "data": [] }` sin errores.

---

## FASE 6 — POBLACIÓN CON FAKER (DATOS DE PRUEBA)

### 6.1 Instalar @faker-js/faker

```
Qué hacer:       Instalar la librería para generar datos falsos realistas
Por qué:         Poblar la tabla con 20+ registros para probar visualmente el frontend
```

```bash
npm install @faker-js/faker
```

### 6.2 Crear el script de seed

Crea `backend/src/faker/seed.ts` (← REEMPLAZAR campos y tabla):

```typescript
import { sequelize } from "../database/db";
import { faker } from "@faker-js/faker";
import { Cliente } from "../models/Cliente"; // ← REEMPLAZAR
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    console.log("🌱 Insertando datos de prueba en clientes..."); // ← REEMPLAZAR

    // Sincronizar modelos (crea la tabla si no existe)
    await sequelize.sync({ force: false });

    const records = [];
    for (let i = 0; i < 20; i++) {
      records.push({
        name: faker.person.fullName(),              // ← REEMPLAZAR según campos
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE' as const])
      });
    }

    await Cliente.bulkCreate(records); // ← REEMPLAZAR
    console.log(`✅ ${records.length} registros insertados correctamente`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
    process.exit(1);
  }
}

seed();
```

**🔴 Cuando cambie la entidad, cambia:**
- `Cliente` → tu modelo
- Los campos en `records.push(...)` → los campos de tu entidad
- Los valores de faker → usa `faker.commerce.productName()`, `faker.number.int()`, etc. según el tipo de campo

### 6.3 Agregar script seed en package.json

Abre `backend/package.json` y agrega en `"scripts"`:

```json
"seed": "ts-node src/faker/seed.ts"
```

Los scripts completos deben verse así:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "nodemon src/server.ts",
  "seed": "ts-node src/faker/seed.ts"
}
```

### 6.4 Ejecutar el seed

```
Qué hacer:       Poblar la base de datos con 20 registros falsos
```

```bash
cd backend
npm run seed
```

```
Resultado esperado:
  🔌 Conectando a base de datos: MYSQL
  ✅ Conexión exitosa a MYSQL
  🌱 Insertando datos de prueba en clientes...
  ✅ 20 registros insertados correctamente
```

**Verificar en BD:**

```sql
USE bd_clientes;
SELECT COUNT(*) FROM clientes;  -- Debe mostrar 20
SELECT * FROM clientes LIMIT 5;  -- Debe mostrar 5 registros con datos realistas
```

**Error común:** "ERROR: column "createdAt" does not exist"
```
Causa: La tabla fue creada sin timestamps.
Solución: DROP TABLE clientes; y luego ejecutar npm run seed (Sequelize recrea la tabla).
```

✅ **FASE 6 COMPLETADA** cuando `SELECT COUNT(*) FROM clientes` muestre 20 registros.

---

## FASE 7 — PRUEBAS CON POSTMAN / .HTTP

### 7.1 Probar con archivos .http (Thunder Client)

Crea `backend/src/http/clientes.http` (← REEMPLAZAR):

```http
### Obtener todos los clientes
GET http://localhost:4000/api/clientes

### Obtener cliente por ID
GET http://localhost:4000/api/clientes/1

### Crear un cliente
POST http://localhost:4000/api/clientes
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "3001234567",
  "address": "Calle 123",
  "status": "ACTIVE"
}

### Actualizar un cliente
PUT http://localhost:4000/api/clientes/1
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "email": "juan.nuevo@email.com",
  "phone": "3007654321",
  "address": "Carrera 456",
  "status": "ACTIVE"
}

### Eliminar un cliente
DELETE http://localhost:4000/api/clientes/1
```

### 7.2 Probar con Postman

Para cada endpoint, usa esta tabla:

| Operación | Método | URL | Body (JSON) |
|-----------|--------|-----|-------------|
| Listar todos | `GET` | `http://localhost:4000/api/clientes` | No |
| Obtener por ID | `GET` | `http://localhost:4000/api/clientes/1` | No |
| Crear | `POST` | `http://localhost:4000/api/clientes` | `{ "name": "...", "email": "...", "phone": "...", "address": "...", "status": "ACTIVE" }` |
| Actualizar | `PUT` | `http://localhost:4000/api/clientes/1` | `{ "name": "...", "email": "...", ... }` |
| Eliminar | `DELETE` | `http://localhost:4000/api/clientes/1` | No |

### 7.3 Respuestas esperadas

**GET /api/clientes → 200**
```json
{
  "data": [
    { "id": 1, "name": "Juan Pérez", "email": "juan@email.com", "phone": "3001234567", "address": "Calle 123", "status": "ACTIVE", "createdAt": "...", "updatedAt": "..." }
  ]
}
```

**POST /api/clientes → 201**
```json
{
  "data": { "id": 2, "name": "María Gómez", "email": "maria@email.com", "phone": "3009876543", "address": "Av. Siempre Viva", "status": "ACTIVE", "updatedAt": "...", "createdAt": "..." },
  "mensaje": "Creado correctamente"
}
```

**PUT /api/clientes/1 → 200**
```json
{ "mensaje": "Actualizado correctamente" }
```

**DELETE /api/clientes/1 → 200**
```json
{ "mensaje": "Eliminado correctamente" }
```

### 7.4 Errores comunes en las pruebas

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED :4000` | Backend no está corriendo | Ejecutar `npm run dev` |
| `Cannot POST` | Ruta mal escrita en la URL | Verificar que sea `/api/clientes` |
| `Cannot PUT` | El id no existe en la BD | Usar un id que exista |
| `SequelizeUniqueConstraintError` | Email duplicado | Usar un email diferente |
| `{"error": "Registro no encontrado"}` | El id no existe | Verificar primero con GET todos |

✅ **FASE 7 COMPLETADA** cuando los 5 endpoints respondan correctamente.

---

## FASE 8 — CREACIÓN DEL FRONTEND ANGULAR

### 8.1 Crear proyecto Angular

```
Qué hacer:       Crear el proyecto Angular fuera de la carpeta backend/
```

```bash
# Estás en: app-parcial/
cd ..
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

### 8.2 Verificar que Angular funciona

```bash
ng serve
```

Abrir `http://localhost:4200` → Debe aparecer la página de bienvenida de Angular.

**Error común:** Puerto 4200 ya está en uso
```
Solución: ng serve --port 4300
```

### 8.3 Instalar PrimeNG (librería de componentes UI)

```
Qué hacer:       Instalar PrimeNG, su tema y los iconos
```

```bash
npm install primeng @primeuix/themes primeicons
```

### 8.4 Instalar TailwindCSS

```
Qué hacer:       Instalar TailwindCSS como PostCSS plugin
Por qué:         Se usa junto con PrimeNG para estilos rápidos
```

```bash
npm install tailwindcss @tailwindcss/postcss
```

### 8.5 Configurar PrimeNG en app.config.ts

```
Qué hacer:       Configurar los providers de Angular para usar PrimeNG
```

Abre `frontend/src/app/app.config.ts` y reemplaza TODO el contenido:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: { preset: Aura }
    })
  ]
};
```

**⚠️ Error común:** `NullInjectorError: No provider for HttpClient`
```
Causa: Falta provideHttpClient() en app.config.ts
Solución: Agregar provideHttpClient(withInterceptorsFromDi()) como en el código de arriba.
```

### 8.6 Configurar TailwindCSS y PrimeIcons en styles.css

Abre `frontend/src/styles.css` y reemplaza TODO con:

```css
@import "tailwindcss";
@import "primeicons/primeicons.css";

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

**⚠️ Error común:** Los iconos de PrimeNG no se ven (aparecen cuadrados)
```
Causa: No se importó primeicons.css
Solución: Verificar que styles.css tenga @import "primeicons/primeicons.css";
```

### 8.7 Crear el modelo en Angular

```
Qué hacer:       Crear la interfaz TypeScript que representa la entidad en el frontend
```

Crea la carpeta y el archivo del modelo:

```bash
mkdir src\app\models
```

Crea `frontend/src/app/models/cliente.ts` (← REEMPLAZAR):

```typescript
export interface Cliente {  // ← REEMPLAZAR
  id?: number;
  name: string;            // ← REEMPLAZAR campos
  email: string;
  phone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```

**🔴 Cuando cambie la entidad, cambia:**
- `Cliente` → nombre de tu entidad
- Los campos → los campos de tu entidad

### 8.8 Crear el servicio HTTP

```
Qué hacer:       Crear el servicio que se comunicará con el backend
```

Crea la carpeta:

```bash
mkdir src\app\services
```

Crea `frontend/src/app/services/cliente.service.ts` (← REEMPLAZAR):

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente'; // ← REEMPLAZAR

@Injectable({ providedIn: 'root' })
export class ClienteService {  // ← REEMPLAZAR

  private apiUrl = 'http://localhost:4000/api/clientes'; // ← REEMPLAZAR

  constructor(private http: HttpClient) { }

  getAll(): Observable<{ data: Cliente[] }> {  // ← REEMPLAZAR
    return this.http.get<{ data: Cliente[] }>(this.apiUrl);
  }

  getById(id: number): Observable<{ data: Cliente }> {
    return this.http.get<{ data: Cliente }>(`${this.apiUrl}/${id}`);
  }

  create(data: Cliente): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

**🔴 PARTES QUE DEBES REEMPLAZAR:**
- `Cliente` → nombre de tu entidad (en interface, imports y tipados)
- `ClienteService` → nombre de la clase del servicio
- `http://localhost:4000/api/clientes` → la URL base de tu API

### 8.9 Configurar rutas de Angular

Abre `frontend/src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' }, // ← REEMPLAZAR
  {
    path: 'clientes',  // ← REEMPLAZAR
    loadComponent: () => import('./components/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)  // ← REEMPLAZAR
  },
  {
    path: 'clientes/new',  // ← REEMPLAZAR
    loadComponent: () => import('./components/cliente/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)  // ← REEMPLAZAR
  },
  {
    path: 'clientes/edit/:id',  // ← REEMPLAZAR
    loadComponent: () => import('./components/cliente/cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)  // ← REEMPLAZAR
  },
  { path: '**', redirectTo: '/clientes' }
];
```

**🔴 Cuando cambie la entidad, cambia:**
- `/clientes` → `/nombre-de-tu-entidad`
- `cliente-list`, `cliente-form` → nombre de tus componentes
- `ClienteListComponent`, `ClienteFormComponent` → nombre de tus clases

✅ **FASE 8 COMPLETADA** cuando `ng serve` compile sin errores.

---

## FASE 9 — CRUD COMPLETO EN ANGULAR

### 9.1 Generar los componentes

```
Qué hacer:       Crear los componentes para listar y para crear/editar
```

```bash
ng g c components/cliente/cliente-list  # ← REEMPLAZAR
ng g c components/cliente/cliente-form  # ← REEMPLAZAR
```

### 9.2 Estructura final de componentes

```
frontend/src/app/components/cliente/     # ← REEMPLAZAR
├── cliente-list/
│   ├── cliente-list.component.ts
│   ├── cliente-list.component.html
│   ├── cliente-list.component.css
└── cliente-form/
    ├── cliente-form.component.ts
    ├── cliente-form.component.html
    ├── cliente-form.component.css
```

### 9.3 Componente de listado (cliente-list)

#### cliente-list.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClienteService } from '../../services/cliente.service';  // ← REEMPLAZAR
import { Cliente } from '../../models/cliente';                    // ← REEMPLAZAR

@Component({
  selector: 'app-cliente-list',         // ← REEMPLAZAR
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cliente-list.component.html'
})
export class ClienteListComponent implements OnInit {   // ← REEMPLAZAR
  items: Cliente[] = [];                                 // ← REEMPLAZAR
  loading = false;

  constructor(
    private service: ClienteService,                    // ← REEMPLAZAR
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({                    // ← REEMPLAZAR
      next: (res) => { this.items = res.data; this.loading = false; },
      error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' }); }
    });
  }

  confirmDelete(item: Cliente): void {                   // ← REEMPLAZAR
    this.confirmationService.confirm({
      message: `¿Eliminar a "${item.name}"?`,             // ← REEMPLAZAR: usa el campo que identifica al registro (name, nombre, título, etc.)
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

#### cliente-list.component.html

```html
<div class="card p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Listado de Clientes</h2>  <!-- ← REEMPLAZAR -->
    <p-button label="Nuevo" icon="pi pi-plus" routerLink="/clientes/new"></p-button>
  </div>

  <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="10"
    [rowsPerPageOptions]="[5,10,25,50]" dataKey="id" [tableStyle]="{'min-width':'50rem'}">
    <ng-template pTemplate="header">
      <tr>
        <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
        <th pSortableColumn="name">Nombre <p-sortIcon field="name"></p-sortIcon></th>
        <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
        <th pSortableColumn="phone">Teléfono <p-sortIcon field="phone"></p-sortIcon></th>
        <th>Estado</th>
        <th class="text-center">Acciones</th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-item>
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.status }}</td>
        <td class="text-center">
          <p-button icon="pi pi-pencil" [routerLink]="['/clientes/edit', item.id]" styleClass="p-button-rounded p-button-text p-button-warning" pTooltip="Editar"></p-button>
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

**🔴 Cuando cambie la entidad, cambia en el HTML:**
- "Listado de Clientes" → nombre de tu entidad
- Las columnas de la tabla → los campos de tu entidad
- `item.name`, `item.email`, etc. → los campos de tu entidad
- `routerLink="/clientes/..."` → `/tu-entidad/...`

### 9.4 Componente de formulario (cliente-form)

#### cliente-form.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../../services/cliente.service';    // ← REEMPLAZAR

@Component({
  selector: 'app-cliente-form',          // ← REEMPLAZAR
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, InputTextareaModule, SelectModule, ToastModule],
  providers: [MessageService],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent implements OnInit {   // ← REEMPLAZAR
  form = this.fb.group({                                 // ← REEMPLAZAR campos
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    status: ['ACTIVE', Validators.required]
  });

  isEdit = false;
  id?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: ClienteService,                      // ← REEMPLAZAR
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
        setTimeout(() => this.router.navigate(['/clientes']), 1000);  // ← REEMPLAZAR
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
        this.loading = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/clientes']); }  // ← REEMPLAZAR
}
```

#### cliente-form.component.html

```html
<div class="max-w-2xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar' : 'Nuevo' }} Cliente</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="flex flex-col gap-4">
        <!-- Nombre -->
        <div>
          <label class="block font-semibold mb-1">Nombre *</label>
          <input pInputText formControlName="name" class="w-full" />
          <small class="text-red-500" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">Nombre requerido (mín. 2 caracteres)</small>
        </div>

        <!-- Email -->
        <div>
          <label class="block font-semibold mb-1">Email *</label>
          <input pInputText formControlName="email" class="w-full" />
          <small class="text-red-500" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email válido requerido</small>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block font-semibold mb-1">Teléfono</label>
          <input pInputText formControlName="phone" class="w-full" />
        </div>

        <!-- Dirección -->
        <div>
          <label class="block font-semibold mb-1">Dirección</label>
          <textarea pInputTextarea formControlName="address" class="w-full" rows="3"></textarea>
        </div>

        <!-- Estado -->
        <div>
          <label class="block font-semibold mb-1">Estado</label>
          <p-select formControlName="status" [options]="[{label:'Activo',value:'ACTIVE'},{label:'Inactivo',value:'INACTIVE'}]" class="w-full"></p-select>
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

**🔴 Cuando cambie la entidad, cambia en el HTML:**
- "Nuevo Cliente" / "Editar Cliente" → nombre de tu entidad
- Los campos del formulario → los campos de tu entidad
- `formControlName="..."` → los nombres de los campos
- Las validaciones y tipos de campo según la entidad

### 9.5 Verificar que el CRUD funciona

```bash
cd frontend
ng serve
```

Abrir `http://localhost:4200/clientes`

Asegúrate de que el backend esté corriendo en otra terminal:

```bash
cd backend
npm run dev
```

✅ **FASE 9 COMPLETADA** cuando puedas:
- ☐ Ver la lista de clientes (desde la BD)
- ☐ Crear un nuevo cliente
- ☐ Editar un cliente existente
- ☐ Eliminar un cliente

---

## FASE 10 — CONEXIÓN TOTAL Y CHECKLIST

### Diagrama del flujo completo

```
┌─────────────┐      HTTP      ┌──────────┐     Sequelize    ┌──────────────┐
│   ANGULAR   │ ──────────────▶ │  NODE.JS │ ───────────────▶ │    MYSQL     │
│  Frontend   │ ◀────────────── │  Express │ ◀─────────────── │  Base de     │
│  :4200      │     JSON        │  :4000   │     ORM          │  Datos       │
└─────────────┘                 └──────────┘                  └──────────────┘
```

### Cómo se comunican:

```
1. Angular (cliente-list) hace GET a http://localhost:4000/api/clientes
2. Node.js recibe la petición y la ruta la dirige al controlador
3. El controlador llama al modelo Sequelize: Cliente.findAll()
4. Sequelize ejecuta: SELECT * FROM clientes
5. MySQL devuelve los datos → Node.js los envía como JSON → Angular los muestra
```

### ¿Qué debe estar corriendo?

| Componente | Comando | Puerto |
|------------|--------|--------|
| **Motor BD** | Servicio según tu motor (MySQL/PostgreSQL/SQL Server/Oracle) | Según .env |
| **Backend** | `cd backend && npm run dev` | 4000 |
| **Frontend** | `cd frontend && ng serve` | 4200 |

**Para probar la conexión completa:**
1. Abre `http://localhost:4200`
2. Debe cargar la lista de clientes desde la BD
3. Crea un nuevo cliente → debe aparecer en la BD
4. Edítalo → los cambios deben persistir
5. Elimínalo → debe desaparecer de la lista

**Error común de CORS:** Bloqueo de petición desde Angular
```
Solución: Verificar que backend/src/config/index.ts tenga app.use(cors()) (sin restricciones)
          Para desarrollo, cors() sin opciones permite cualquier origen.
```

**Error común:** "No se pudieron cargar los datos"
```
Solución: Verificar que el backend esté corriendo en :4000 y MySQL esté activo
          Abrir http://localhost:4000/api/clientes en el navegador para verificar la API
```

### ✅ CHECKLIST DEL PARCIAL

Marca cada casilla cuando lo hayas verificado:

#### Backend
- ☐ **Backend inicia**: `npm run dev` compila TypeScript y arranca sin errores
- ☐ **GET /api/clientes** devuelve `{ "data": [...] }`
- ☐ **POST /api/clientes** crea registros correctamente
- ☐ **PUT /api/clientes/:id** actualiza registros
- ☐ **DELETE /api/clientes/:id** elimina registros
- ☐ **Seed funciona**: `npm run seed` inserta 20 registros

#### Base de Datos
- ☐ **MySQL está corriendo** (servicio activo)
- ☐ **La base de datos existe** con el nombre correcto
- ☐ **La tabla clientes existe** con las columnas correctas
- ☐ **Hay registros** (al menos 1, idealmente 20 del seed)

#### Frontend Angular
- ☐ **Angular compila** sin errores (`ng serve`)
- ☐ **Listar**: La tabla muestra los registros de la BD
- ☐ **Crear**: El formulario envía datos al backend
- ☐ **Editar**: El formulario carga datos existentes y los actualiza
- ☐ **Eliminar**: El diálogo de confirmación funciona y elimina

#### Conexión
- ☐ **Frontend ↔ Backend**: Angular se conecta a Node.js en :4000
- ☐ **Backend ↔ BD**: Node.js se conecta a MySQL en :3306
- ☐ **CRUD completo**: Las 4 operaciones funcionan de principio a fin
- ☐ **Sin errores en consola**: F12 → Console, no muestra errores rojos

#### 📋 Antes de entregar
- ☐ El proyecto está en una carpeta organizada (`app-parcial/backend/` y `app-parcial/frontend/`)
- ☐ El `backend/.env` NO está incluido (está en `.gitignore`)
- ☐ El `node_modules/` NO está incluido
- ☐ El `backend/dist/` NO está incluido
- ☐ Backend y frontend inician con los comandos correctos
- ☐ **¡Respaldaste tu proyecto!** (copia en USB / Google Drive / GitHub)

---

## ANEXO A: Guía rápida de REEMPLAZO

Cuando el docente te dé la entidad del parcial, sigue esta tabla:

| Archivo | ¿Qué reemplazar? |
|---------|-----------------|
| `backend/.env` → `MYSQL_NAME` | Nombre de la base de datos |
| `backend/src/database/db.ts` → `database` | Nombre de la BD en el config |
| `backend/src/models/Cliente.ts` | class, interface, tableName, campos |
| `backend/src/controllers/cliente.controller.ts` | Nombre del import, nombre del controller, campos |
| `backend/src/routes/cliente.routes.ts` | Nombre del controlador importado |
| `backend/src/config/index.ts` → `import` y `this.app.use` | Ruta de import y ruta base |
| `backend/src/faker/seed.ts` | Modelo importado, campos a insertar |
| `backend/src/http/clientes.http` | URLs de los endpoints |
| `frontend/src/app/models/cliente.ts` | Interface, campos |
| `frontend/src/app/services/cliente.service.ts` | Interface, apiUrl |
| `frontend/src/app/app.routes.ts` | Paths `/clientes`, componentes |
| `frontend/src/app/components/cliente/` | TODA la carpeta (nombre y referencias) |

---

## ANEXO B: Errores comunes y soluciones rápidas

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED :3306` | MySQL no está corriendo | Iniciar MySQL o XAMPP |
| `ER_BAD_DB_ERROR` | BD no existe | Ejecutar `CREATE DATABASE nombre` |
| `Cannot find module` | Dependencia no instalada | Ejecutar `npm install` |
| `NullInjectorError` | Falta provideHttpClient | Agregar a app.config.ts |
| `CORS error (bloqueo)` | Backend sin cors | Verificar cors() en config/index.ts |
| `ng no se reconoce` | Angular CLI no instalado | `npm install -g @angular/cli` |
| `TypeScript error en import` | Ruta incorrecta | Usar `../` correctamente según estructura |
| `SequelizeUniqueConstraintError` | Email duplicado | Usar un email diferente |
| `Column not found` | Tabla existe pero sin timestamps | `DROP TABLE clientes` y reiniciar servidor |
| `Cannot set headers after sent` | Dos respuestas en un método | Agregar `return` después de `res.status().json()` |

---

## ANEXO C: Comandos rápidos

### Backend (una sola terminal)
```bash
cd app-parcial/backend
npm run dev        # Iniciar servidor
npm run seed       # Poblar con datos de prueba
npm run build      # Compilar a JavaScript
```

### Frontend (otra terminal)
```bash
cd app-parcial/frontend
ng serve           # Iniciar Angular
```

---

> ⚡ **Tip final:** Si en algún momento algo no funciona, revisa la consola del navegador (F12) y la terminal del backend. El error siempre dice exactamente qué está mal. Lee el mensaje completo antes de buscar ayuda.
>
> Esta guía es una versión corregida y 100% funcional basada en la arquitectura del docente:
> **TypeScript + Express + Sequelize + MySQL + Angular + PrimeNG + TailwindCSS**.
> Sin JWT, sin roles, sin tablas secundarias — solo el CRUD de una entidad.
