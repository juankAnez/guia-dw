// ===== DATA: All phases content =====
const phases = [
  {
    id: 'fase-0',
    number: 1,
    title: 'Preparación del Entorno',
    icon: 'fa-laptop-code',
    steps: [
      {
        title: 'Instalar Node.js',
        content: 'Descargar la versión LTS (18.x o 20.x) desde https://nodejs.org',
        code: 'node -v\nnpm -v',
        verify: 'node -v → v18.x.x o v20.x.x\nnpm -v → 9.x.x o 10.x.x'
      },
      {
        title: 'Instalar Angular CLI',
        content: 'Herramienta para crear y compilar proyectos Angular',
        code: 'npm install -g @angular/cli',
        verify: 'ng version\n→ Angular CLI: 18.x.x'
      },
      {
        title: 'Instalar MySQL',
        content: 'Descargar MySQL Installer de dev.mysql.com/downloads/installer/ o usar XAMPP',
        code: 'mysql --version',
        verify: 'mysql Ver 8.x.x'
      },
      {
        title: 'Extensiones VS Code recomendadas',
        content: 'Prettier - Formateo de código\nThunder Client - Probar APIs\nMySQL (cweijan) - Ver BD desde VS Code',
        isTable: true,
        headers: ['Extensión', 'Para qué sirve'],
        rows: [
          ['Prettier', 'Formatea el código automáticamente'],
          ['Thunder Client', 'Probar endpoints sin salir del editor'],
          ['MySQL', 'Conectar y ver la BD desde VS Code']
        ]
      }
    ]
  },
  {
    id: 'fase-1',
    number: 2,
    title: 'Creación del Backend',
    icon: 'fa-server',
    hasGenerator: true,
    steps: [
      {
        title: 'Crear proyecto',
        content: 'Crea la carpeta del proyecto y el subdirectorio backend',
        code: 'mkdir app-parcial\ncd app-parcial\nmkdir backend\ncd backend\nnpm init -y'
      },
      {
        title: 'Instalar dependencias',
        isTable: true,
        headers: ['Dependencia', 'Para qué sirve'],
        rows: [
          ['express', 'Framework para crear el servidor web'],
          ['mysql2', 'Conector con la base de datos MySQL'],
          ['cors', 'Permite que Angular se comunique con el backend'],
          ['dotenv', 'Lee variables de entorno desde .env'],
          ['nodemon (-D)', 'Reinicia el servidor automáticamente al guardar']
        ]
      },
      {
        title: 'Comando de instalación',
        code: 'npm install express mysql2 cors dotenv\nnpm install -D nodemon'
      },
      {
        title: 'Estructura de carpetas',
        content: 'Crea esta estructura dentro de backend/',
        code: 'backend/\n├── node_modules/\n├── src/\n│   ├── config/\n│   │   └── db.js\n│   ├── controllers/\n│   │   └── producto.controller.js  ← REEMPLAZAR\n│   ├── models/\n│   │   └── producto.model.js       ← REEMPLAZAR\n│   ├── routes/\n│   │   └── producto.routes.js      ← REEMPLAZAR\n│   └── app.js\n├── .env\n├── .gitignore\n├── package.json\n└── server.js'
      },
      {
        title: 'Crear carpetas (atajo)',
        code: 'mkdir -p src/config src/controllers src/models src/routes'
      },
      {
        title: 'Variables de entorno (.env)',
        content: 'Crea backend/.env. <span class="replace-marker">⚠️ REEMPLAZA</span> DB_PASSWORD con tu contraseña MySQL',
        code: 'PORT=3000\nDB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=   ← TU CONTRASEÑA\nDB_NAME=bd_productos    ← REEMPLAZAR\nDB_PORT=3306'
      },
      {
        title: 'Conexión BD (src/config/db.js)',
        code: `const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bd_productos',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;`
      },
      {
        title: 'Servidor Express (src/app.js)',
        code: `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

module.exports = app;`
      },
      {
        title: 'Punto de entrada (server.js)',
        code: `const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
});`
      },
      {
        title: 'Scripts en package.json',
        content: 'Reemplazar la sección "scripts" en package.json',
        code: '"scripts": {\n  "start": "node server.js",\n  "dev": "nodemon server.js"\n}'
      },
      {
        title: '.gitignore',
        content: 'Crear backend/.gitignore',
        code: 'node_modules/\n.env'
      },
      {
        title: 'Probar que el servidor inicia',
        content: 'Ejecuta el servidor y verifica en el navegador',
        code: 'npm run dev',
        verify: 'Abrir http://localhost:3000 → {"mensaje":"API funcionando correctamente"}'
      }
    ]
  },
  {
    id: 'fase-2',
    number: 3,
    title: 'Creación de la Base de Datos',
    icon: 'fa-database',
    steps: [
      {
        title: 'Crear la base de datos',
        content: 'Abre MySQL (terminal o phpMyAdmin) y ejecuta:',
        code: 'CREATE DATABASE IF NOT EXISTS bd_productos;\nUSE bd_productos;',
        verify: 'SHOW DATABASES; → bd_productos aparece en la lista'
      },
      {
        title: 'Crear la tabla principal',
        content: '<span class="replace-marker">⚠️ REEMPLAZA</span> "productos" por el nombre de TU tabla y los campos según tu entidad',
        code: `CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL DEFAULT 0,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`,
        verify: 'DESCRIBE productos;\n→ Muestra todas las columnas con sus tipos'
      },
      {
        title: 'Verificar',
        code: 'SELECT * FROM productos;',
        verify: 'Debe mostrar "Empty set" (aún sin datos)'
      }
    ]
  },
  {
    id: 'fase-3',
    number: 4,
    title: 'Modelo',
    icon: 'fa-cube',
    steps: [
      {
        title: '¿Qué es el modelo?',
        content: 'El modelo define cómo se conecta y consulta la base de datos desde Node.js. Cada función ejecuta una consulta SQL.'
      },
      {
        title: 'Plantilla del modelo',
        content: 'Crea <code>backend/src/models/producto.model.js</code>. <span class="replace-marker">⚠️ REEMPLAZA:</span> tableName, allowedFields y nombre del objeto',
        code: `const pool = require('../config/db');

const tableName = 'productos'; // ← REEMPLAZAR
const allowedFields = ['nombre', 'descripcion', 'precio', 'cantidad', 'estado']; // ← REEMPLAZAR

const ProductoModel = {
  getAll: async () => {
    const [rows] = await pool.query(\`SELECT * FROM \${tableName}\`);
    return rows;
  },
  getById: async (id) => {
    const [rows] = await pool.query(\`SELECT * FROM \${tableName} WHERE id = ?\`, [id]);
    return rows[0];
  },
  create: async (data) => {
    const [result] = await pool.query(\`INSERT INTO \${tableName} SET ?\`, [data]);
    return { id: result.insertId, ...data };
  },
  update: async (id, data) => {
    await pool.query(\`UPDATE \${tableName} SET ? WHERE id = ?\`, [data, id]);
    return { id, ...data };
  },
  delete: async (id) => {
    const [result] = await pool.query(\`DELETE FROM \${tableName} WHERE id = ?\`, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = ProductoModel;`
      }
    ]
  },
  {
    id: 'fase-4',
    number: 5,
    title: 'Controlador',
    icon: 'fa-gamepad',
    steps: [
      {
        title: '¿Qué es el controlador?',
        content: 'Recibe las peticiones HTTP y responde usando el modelo. Cada método corresponde a una operación CRUD.'
      },
      {
        title: 'Plantilla del controlador',
        content: 'Crea <code>backend/src/controllers/producto.controller.js</code>. <span class="replace-marker">⚠️ REEMPLAZA</span> nombres y campos',
        code: `const ProductoModel = require('../models/producto.model');

const ProductoController = {
  getAll: async (req, res) => {
    try {
      const items = await ProductoModel.getAll();
      res.json({ data: items });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registros' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await ProductoModel.getById(id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      res.json({ data: item });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener' });
    }
  },

  create: async (req, res) => {
    try {
      const { nombre, descripcion, precio, cantidad, estado } = req.body;
      if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
      }
      const newItem = await ProductoModel.create({ nombre, descripcion, precio, cantidad, estado });
      res.status(201).json({ data: newItem, mensaje: 'Creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await ProductoModel.getById(id);
      if (!item) return res.status(404).json({ error: 'No encontrado' });
      await ProductoModel.update(id, req.body);
      res.json({ mensaje: 'Actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await ProductoModel.delete(id);
      if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
      res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};

module.exports = ProductoController;`
      }
    ]
  },
  {
    id: 'fase-5',
    number: 6,
    title: 'Rutas',
    icon: 'fa-route',
    steps: [
      {
        title: '¿Qué son las rutas?',
        content: 'Conectan las URL de la API con los métodos del controlador.'
      },
      {
        title: 'Plantilla de rutas',
        content: 'Crea <code>backend/src/routes/producto.routes.js</code>. <span class="replace-marker">⚠️ REEMPLAZA</span> "/productos" por tu entidad',
        code: `const router = require('express').Router();
const controller = require('../controllers/producto.controller');

router.get('/productos', controller.getAll);
router.get('/productos/:id', controller.getById);
router.post('/productos', controller.create);
router.put('/productos/:id', controller.update);
router.delete('/productos/:id', controller.delete);

module.exports = router;`
      },
      {
        title: 'Registrar rutas en app.js',
        content: 'Verifica que app.js tenga: <code>app.use(\'/api\', productoRoutes)</code>'
      },
      {
        title: 'Verificar',
        code: 'npm run dev',
        verify: 'GET http://localhost:3000/api/productos → {"data":[]}'
      }
    ]
  },
  {
    id: 'fase-6',
    number: 7,
    title: 'Pruebas con REST Client',
    icon: 'fa-paper-plane',
    steps: [
      {
        title: '¿Qué es REST Client?',
        content: 'Extensión de VS Code que permite probar APIs HTTP desde archivos <code>.http</code>. Crea <code>backend/entidad.http</code> <span class="replace-marker">⚠️ REEMPLAZA</span> "productos" por tu entidad en plural:'
      },
      {
        title: 'Ejemplo de archivo .http',
        code: `### LISTAR TODOS (GET)
GET http://localhost:3000/api/productos

### OBTENER POR ID (GET)
GET http://localhost:3000/api/productos/1

### CREAR (POST)
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "nombre": "Laptop",
  "precio": 2500000,
  "cantidad": 10,
  "estado": "ACTIVO"
}

### ACTUALIZAR (PUT)
PUT http://localhost:3000/api/productos/1
Content-Type: application/json

{
  "nombre": "Laptop Pro",
  "precio": 3000000
}

### ELIMINAR (DELETE)
DELETE http://localhost:3000/api/productos/1`
      },
      {
        title: 'Cómo usar',
        content: '1. Instala la extensión <strong>REST Client</strong> en VS Code<br>2. Abre el archivo <code>entidad.http</code><br>3. Haz clic en <strong>"Send Request"</strong> que aparece arriba de cada bloque <code>###</code><br>4. Revisa la respuesta en el panel que se abre a la derecha'
      },
      {
        title: 'Endpoints del CRUD',
        isTable: true,
        headers: ['Endpoint', 'Método', 'Descripción'],
        rows: [
          ['/api/productos', 'GET', 'Listar todos los registros'],
          ['/api/productos/1', 'GET', 'Obtener un registro por ID'],
          ['/api/productos', 'POST', 'Crear un nuevo registro'],
          ['/api/productos/1', 'PUT', 'Actualizar un registro existente'],
          ['/api/productos/1', 'DELETE', 'Eliminar un registro']
        ]
      }
    ]
  },
  {
    id: 'fase-7',
    number: 8,
    title: 'Frontend Angular',
    icon: 'fa-paint-brush',
    steps: [
      {
        title: 'Crear proyecto Angular',
        content: 'Desde app-parcial/ (fuera de backend/)',
        code: 'cd app-parcial\nng new frontend --standalone --routing --style=css'
      },
      {
        title: 'Verificar que funciona',
        code: 'cd frontend\nng serve',
        verify: 'Abrir http://localhost:4200 → página de bienvenida de Angular'
      },
      {
        title: 'Instalar PrimeNG',
        code: 'npm install primeng @primeuix/themes primeicons'
      },
      {
        title: 'Configurar app.config.ts',
        code: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
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
    providePrimeNG({ theme: { preset: Aura } })
  ]
};`
      },
      {
        title: 'Configurar styles.css',
        code: '@import "tailwindcss";\n@import "primeicons/primeicons.css";\n\nbody { margin: 0; font-family: "Segoe UI", sans-serif; }'
      },
      {
        title: 'Modelo Angular',
        content: 'Crea <code>frontend/src/app/models/producto.ts</code>',
        code: `export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  estado: 'ACTIVO' | 'INACTIVO';
}`
      },
      {
        title: 'Servicio HTTP',
        content: 'Crea <code>frontend/src/app/services/producto.service.ts</code>. <span class="replace-marker">⚠️ REEMPLAZA</span> URL y tipos',
        code: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: Producto[] }> {
    return this.http.get<{ data: Producto[] }>(this.apiUrl);
  }
  getById(id: number): Observable<{ data: Producto }> {
    return this.http.get<{ data: Producto }>(\`\${this.apiUrl}/\${id}\`);
  }
  create(data: Producto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  update(id: number, data: Producto): Observable<any> {
    return this.http.put(\`\${this.apiUrl}/\${id}\`, data);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(\`\${this.apiUrl}/\${id}\`);
  }
}`
      },
      {
        title: 'Rutas de Angular (app.routes.ts)',
        code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  {
    path: 'productos',
    loadChildren: () => import('./components/producto/producto.routes').then(m => m.routes)
  },
  { path: '**', redirectTo: '/productos' }
];`
      }
    ]
  },
  {
    id: 'fase-8',
    number: 9,
    title: 'CRUD Completo en Angular',
    icon: 'fa-sync',
    steps: [
      {
        title: 'Generar módulo y componentes',
        code: 'ng g m components/producto --routing\nng g c components/producto/producto-list\nng g c components/producto/producto-form'
      },
      {
        title: 'producto.routes.ts',
        code: `import { Routes } from '@angular/router';
import { ProductoList } from './producto-list/producto-list';
import { ProductoForm } from './producto-form/producto-form';

export const routes: Routes = [
  { path: '', component: ProductoList },
  { path: 'new', component: ProductoForm },
  { path: 'edit/:id', component: ProductoForm }
];`
      },
      {
        title: 'producto-list.ts',
        code: `import { Component, OnInit } from '@angular/core';
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
      error: () => { this.loading = false; }
    });
  }

  confirmDelete(item: Producto): void {
    this.confirmationService.confirm({
      message: \`¿Eliminar "\${item.nombre}"?\`,
      header: 'Confirmar',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(item.id!)
    });
  }

  delete(id: number): void {
    this.service.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Eliminado' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error' })
    });
  }
}`
      },
      {
        title: 'producto-list.html',
        code: `<div class="card p-6">
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
          <p-button icon="pi pi-pencil" [routerLink]="['/productos/edit', item.id]"
            styleClass="p-button-rounded p-button-text p-button-warning" pTooltip="Editar"></p-button>
          <p-button icon="pi pi-trash" (onClick)="confirmDelete(item)"
            styleClass="p-button-rounded p-button-text p-button-danger" pTooltip="Eliminar"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template pTemplate="emptymessage">
      <tr><td colspan="6" class="text-center p-4">No hay registros</td></tr>
    </ng-template>
  </p-table>
</div>
<p-confirmDialog></p-confirmDialog>
<p-toast></p-toast>`
      },
      {
        title: 'producto-form.ts',
        code: `import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule,
    InputTextModule, InputNumberModule, SelectModule, ToastModule],
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
    if (idParam) { this.isEdit = true; this.id = +idParam; this.loadItem(); }
  }

  loadItem(): void {
    this.service.getById(this.id!).subscribe({
      next: (res) => this.form.patchValue(res.data)
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
        this.messageService.add({ severity: 'success', summary: 'Éxito',
          detail: \`Registro \${this.isEdit ? 'actualizado' : 'creado'} correctamente\` });
        setTimeout(() => this.router.navigate(['/productos']), 1000);
      },
      error: () => { this.loading = false; }
    });
  }

  cancel(): void { this.router.navigate(['/productos']); }
}`
      },
      {
        title: 'producto-form.html',
        code: `<div class="max-w-2xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Editar' : 'Nuevo' }} Producto</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block font-semibold mb-1">Nombre *</label>
          <input pInputText formControlName="nombre" class="w-full" />
          <small class="text-red-500" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">
            Nombre requerido
          </small>
        </div>
        <div>
          <label class="block font-semibold mb-1">Descripción</label>
          <input pInputText formControlName="descripcion" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Precio *</label>
            <p-inputNumber formControlName="precio" mode="currency" currency="COP" locale="es-CO" class="w-full" />
          </div>
          <div>
            <label class="block font-semibold mb-1">Cantidad *</label>
            <p-inputNumber formControlName="cantidad" [min]="0" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-1">Estado</label>
          <p-select formControlName="estado"
            [options]="[{label:'Activo',value:'ACTIVO'},{label:'Inactivo',value:'INACTIVO'}]"
            class="w-full"></p-select>
        </div>
      </div>
      <div class="flex justify-center gap-4 mt-8">
        <p-button type="submit" label="Guardar" icon="pi pi-save" [loading]="loading" [disabled]="form.invalid"></p-button>
        <p-button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" (onClick)="cancel()"></p-button>
      </div>
    </form>
  </div>
</div>
<p-toast></p-toast>`
      },
      {
        title: 'Verificar CRUD completo',
        content: 'Abrir http://localhost:4200/productos',
        verify: '☐ Listar muestra datos\n☐ Crear guarda en BD\n☐ Editar actualiza\n☐ Eliminar borra'
      }
    ]
  },
  {
    id: 'fase-9',
    number: 10,
    title: 'Conexión Total',
    icon: 'fa-link',
    steps: [
      {
        title: 'Diagrama del flujo',
        content: 'Frontend (Angular :4200) → HTTP/JSON → Backend (Node.js :3000) → SQL → MySQL',
        code: `┌─────────────┐      HTTP      ┌──────────┐     SQL     ┌──────────────┐
│   ANGULAR   │ ──────────────▶ │  NODE.JS │ ──────────▶ │    MYSQL     │
│  Frontend   │ ◀────────────── │  Express │ ◀────────── │  Base de     │
│  :4200      │     JSON        │  :3000   │   Datos     │  Datos       │
└─────────────┘                 └──────────┘             └──────────────┘`
      },
      {
        title: 'Componentes que deben estar corriendo',
        isTable: true,
        headers: ['Componente', 'Comando', 'Puerto'],
        rows: [
          ['MySQL', 'Servicio de Windows o XAMPP', '3306'],
          ['Backend', 'cd backend && npm run dev', '3000'],
          ['Frontend', 'cd frontend && ng serve', '4200']
        ]
      },
      {
        title: 'Probar conexión completa',
        content: '1. Abre http://localhost:4200\n2. Debe cargar la lista de la BD\n3. Crea un registro → debe aparecer\n4. Edítalo → cambios deben persistir\n5. Elimínalo → debe desaparecer'
      }
    ]
  },
  {
    id: 'fase-10',
    number: 11,
    title: 'Checklist del Parcial',
    icon: 'fa-check-circle',
    isChecklist: true,
    items: [
      { id: 'chk-backend', text: 'Backend inicia sin errores (npm run dev)' },
      { id: 'chk-angular', text: 'Angular compila sin errores (ng serve)' },
      { id: 'chk-mysql', text: 'MySQL está corriendo y la BD existe' },
      { id: 'chk-get', text: 'GET /api/productos devuelve datos' },
      { id: 'chk-post', text: 'POST /api/productos crea registros' },
      { id: 'chk-put', text: 'PUT /api/productos/:id actualiza' },
      { id: 'chk-delete', text: 'DELETE /api/productos/:id elimina' },
      { id: 'chk-list', text: 'Angular muestra lista desde la BD' },
      { id: 'chk-create-ui', text: 'Formulario de creación funciona' },
      { id: 'chk-edit-ui', text: 'Formulario de edición funciona' },
      { id: 'chk-delete-ui', text: 'Eliminación con confirmación funciona' },
      { id: 'chk-errors', text: 'Sin errores en consola del navegador (F12)' },
      { id: 'chk-env', text: '.env NO está incluido (en .gitignore)' },
      { id: 'chk-node', text: 'node_modules NO está incluido' },
      { id: 'chk-backup', text: 'Proyecto respaldado (USB / GitHub)' }
    ]
  }
];

// ===== GLOBAL STATE =====
let currentEntityName = '';
let generatedEntityData = null;

// ===== SIDEBAR GROUPS =====
const sidebarGroups = [
  { name: 'Backend', icon: 'fa-server', phases: [0, 1, 2, 3, 4, 5, 6] },
  { name: 'Frontend', icon: 'fa-paint-brush', phases: [7, 8, 9, 10] }
];

// ===== NAVIGATION =====
function showDashboard() {
  document.getElementById('dashboard-view').style.display = 'block';
  document.getElementById('phase-view').style.display = 'none';
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  const dashLink = document.querySelector('.sidebar-dashboard a');
  if (dashLink) dashLink.classList.add('active');
  document.querySelector('.search-box').style.display = 'none';
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.step').forEach(s => { s.style.display = ''; s.classList.remove('step-highlight'); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPhase(index) {
  document.getElementById('dashboard-view').style.display = 'none';
  const phaseView = document.getElementById('phase-view');
  phaseView.style.display = 'block';
  document.querySelector('.search-box').style.display = '';

  const phase = phases[index];
  phaseView.innerHTML = buildPhaseCard(phase);

  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.sidebar-nav a[data-phase="${index}"]`);
  if (link) link.classList.add('active');

  phaseView.querySelectorAll('.phase').forEach(p => p.classList.add('open'));
  highlightBlocks(phaseView);

  if (phase.hasGenerator) {
    renderEntityGeneratorInline();
  }

  addAnimateOnScroll();
  initScrollAnimations();
  closeMobileSidebar();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== SIDEBAR RENDER =====
function renderSidebar() {
  const navList = document.getElementById('sidebar-nav');

  sidebarGroups.forEach((group, gi) => {
    const groupLi = document.createElement('li');
    groupLi.className = 'sidebar-group';

    const header = document.createElement('div');
    header.className = 'sidebar-group-header';
    header.innerHTML = `<i class="fas ${group.icon} group-icon"></i> ${group.name} <i class="fas fa-chevron-right group-toggle"></i>`;
    header.onclick = function() { toggleSidebarGroup(this); };
    groupLi.appendChild(header);

    const subUl = document.createElement('ul');
    subUl.className = 'sidebar-subnav';

    group.phases.forEach(pi => {
      const phase = phases[pi];
      const subLi = document.createElement('li');
      const subA = document.createElement('a');
      subA.href = '#';
      subA.setAttribute('data-phase', pi);
      subA.setAttribute('role', 'menuitem');
      subA.innerHTML = `<span class="phase-badge"><i class="fas ${phase.icon}"></i></span> ${phase.title}`;
      subA.onclick = function(e) {
        e.preventDefault();
        showPhase(pi);
      };
      subLi.appendChild(subA);
      subUl.appendChild(subLi);
    });

    groupLi.appendChild(subUl);
    navList.appendChild(groupLi);
  });
}

function toggleSidebarGroup(el) {
  el.parentElement.classList.toggle('open');
}

// ===== BUILD PHASE CARD =====
function buildPhaseCard(phase) {
  let html = `<div class="phase open" id="${phase.id}">`;
  html += `
    <div class="phase-header" onclick="togglePhase(this.parentElement)">
      <span class="phase-number"><i class="fas ${phase.icon}"></i></span>
      <span class="phase-title">FASE ${phase.number} — ${phase.title}</span>
      <span class="phase-toggle"><i class="fas fa-chevron-down"></i></span>
    </div>
    <div class="phase-body">`;

  if (phase.hasGenerator) {
    html += `<div id="entity-generator-placeholder"></div>`;
  }

  html += `<div class="phase-content" id="guide-container">`;

  if (phase.isChecklist) {
    html += renderChecklist(phase.items);
  } else {
    phase.steps.forEach(step => {
      html += renderStep(step);
    });
  }

  html += renderPhaseNavigation(phase);
  html += `</div></div></div>`;
  return html;
}

function renderPhaseNavigation(phase) {
  const currentIndex = phases.findIndex(p => p.id === phase.id);
  const prevPhase = currentIndex > 0 ? phases[currentIndex - 1] : null;
  const nextPhase = currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null;

  let html = `<div class="phase-nav">`;
  if (prevPhase) {
    html += `<button class="phase-nav-btn prev" onclick="showPhase(${currentIndex - 1})">
      <i class="fas fa-arrow-left"></i> <span>${prevPhase.title}</span>
    </button>`;
  }
  if (nextPhase) {
    html += `<button class="phase-nav-btn next" onclick="showPhase(${currentIndex + 1})">
      <span>${nextPhase.title}</span> <i class="fas fa-arrow-right"></i>
    </button>`;
  }
  html += `</div>`;
  return html;
}

function renderEntityGeneratorInline() {
  const placeholder = document.getElementById('entity-generator-placeholder');
  if (!placeholder) return;
  const template = document.getElementById('entity-generator-template');
  if (!template) return;
  placeholder.innerHTML = template.innerHTML;
  renderEntityGenerator();
}

// ===== STEP RENDER =====
function renderStep(step) {
  let html = `<div class="step">`;
  if (step.title) html += `<h4>${step.title}</h4>`;
  if (step.content) {
    let contentHtml = step.content.replace(/⚠️?/g, '<i class="fas fa-exclamation-triangle" style="color:var(--warning);font-size:0.7rem;"></i>');
    // Make replace-marker spans into toggle buttons
    contentHtml = contentHtml.replace(
      /<span class="replace-marker">(.*?)<\/span>/g,
      '<button class="replace-marker replace-marker-btn" onclick="toggleReplaceMarker(this)" title="Click para alternar entre entidad predeterminada y tu entidad">$1</button>'
    );
    html += `<p>${contentHtml}</p>`;
  }

  if (step.code) {
    const lang = detectLang(step.code);
    const hasGenKey = step.title && STEP_GEN_KEY_MAP[step.title];
    // Steps without content but with matching key get a standalone replace button
    if (hasGenKey && !step.content) {
      html += `<p><button class="replace-marker replace-marker-btn" onclick="toggleReplaceMarker(this)" title="Click para reemplazar con tu entidad"><i class="fas fa-exclamation-triangle" style="color:var(--warning);font-size:0.7rem;"></i> REEMPLAZA</button></p>`;
    }
    html += `<div class="code-block" data-original-code="${escapeAttr(step.code)}">
      <span class="code-lang">${lang}</span>
      <button class="copy-btn" onclick="copyCode(this)" title="Copiar"><i class="fas fa-copy"></i></button>
      <pre><code class="language-${lang}">${escapeHtml(step.code)}</code></pre>
    </div>`;
  }

  if (step.verify) {
    let verifyHtml = step.verify.replace(/\n/g, '<br>');
    verifyHtml = verifyHtml.replace(/☐/g, '<i class="far fa-square" style="margin-right:0.25rem;"></i>');
    html += `<div class="step"><h4><i class="fas fa-check-circle" style="color:var(--success);font-size:0.9rem;"></i> Verificar</h4><p>${verifyHtml}</p></div>`;
  }

  if (step.isTable && step.headers && step.rows) {
    html += `<table class="guide-table"><thead><tr>`;
    step.headers.forEach(h => { html += `<th>${h}</th>`; });
    html += `</tr></thead><tbody>`;
    step.rows.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => { html += `<td>${cell}</td>`; });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `</div>`;
  return html;
}

function escapeAttr(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== STEP TITLE → GENERATED CODE KEY MAPPING =====
const STEP_GEN_KEY_MAP = {
  'Variables de entorno (.env)': 'env',
  'Crear la tabla principal': 'sql',
  'Plantilla del modelo': 'model',
  'Plantilla del controlador': 'controller',
  'Plantilla de rutas': 'routes',
  'Servicio HTTP': 'angularService',
  'Modelo Angular': 'angularModel',
  'Rutas de Angular (app.routes.ts)': 'angularAppRoutes',
  'producto.routes.ts': 'angularComponentRoutes',
  'producto-list.ts': 'angularListComponent',
  'producto-list.html': 'angularListTemplate',
  'producto-form.ts': 'angularFormComponent',
  'producto-form.html': 'angularFormTemplate'
};

const GEN_KEY_LANG = {
  'env': 'bash',
  'sql': 'sql',
  'model': 'javascript',
  'controller': 'javascript',
  'routes': 'javascript',
  'angularService': 'typescript',
  'angularModel': 'typescript',
  'angularAppRoutes': 'typescript',
  'angularComponentRoutes': 'typescript',
  'angularListComponent': 'typescript',
  'angularListTemplate': 'html',
  'angularFormComponent': 'typescript',
  'angularFormTemplate': 'html'
};

// ===== TOGGLE REPLACE MARKER =====
function toggleReplaceMarker(btn) {
  const entity = currentEntityName.trim();
  if (!entity) {
    showNotification('Primero ingresa el nombre de tu entidad en el Generador de Código (Fase 2)', 'info');
    return;
  }

  const step = btn.closest('.step');
  if (!step) return;
  const codeBlock = step.querySelector('.code-block');
  if (!codeBlock) return;

  const codeEl = codeBlock.querySelector('code');
  if (!codeEl) return;

  const originalCode = codeBlock.getAttribute('data-original-code');
  const isShowingOriginal = codeBlock.getAttribute('data-replaced') !== 'true';

  const entityCap = entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();

  // Determine gen key from step title
  const stepTitleEl = step.querySelector('h4');
  const stepTitle = stepTitleEl ? stepTitleEl.textContent.trim() : '';
  const genKey = STEP_GEN_KEY_MAP[stepTitle];

  function applyHighlight(el, code, lang) {
    if (hljs) {
      const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
      el.className = `language-${lang} hljs`;
      el.innerHTML = result.value;
    } else {
      el.className = `language-${lang}`;
      el.textContent = code;
    }
  }

  if (isShowingOriginal) {
    // Use generated code when available (full fields + types, guide-matching structure)
    if (generatedEntityData && genKey && generatedEntityData[genKey]) {
      const generated = generatedEntityData[genKey];
      const lang = GEN_KEY_LANG[genKey] || detectLang(generated);
      applyHighlight(codeEl, generated, lang);
    } else {
      // Fallback: string replacement (name only, preserves original fields)
      const entityUpper = entity.toUpperCase();
      const entityLower = entity.toLowerCase();
      let replaced = originalCode;
      replaced = replaced.replace(/PRODUCTOS/g, entityUpper + 'S');
      replaced = replaced.replace(/PRODUCTO/g, entityUpper);
      replaced = replaced.replace(/Productos/g, entityCap + 's');
      replaced = replaced.replace(/Producto/g, entityCap);
      replaced = replaced.replace(/productos/g, entityLower + 's');
      replaced = replaced.replace(/producto/g, entityLower);
      replaced = replaced.replace(/bd_productos/g, 'bd_' + entityLower + 's');
      replaced = replaced.replace(/\[REEMPLAZAR\]/g, entityCap);
      replaced = replaced.replace(/\s*←\s*REEMPLAZAR/g, '');
      const lang = detectLang(replaced);
      applyHighlight(codeEl, replaced, lang);
    }
    codeBlock.setAttribute('data-replaced', 'true');
    btn.classList.add('replaced');
    btn.innerHTML = `<i class="fas fa-undo" style="font-size:0.65rem;"></i> Volver a Producto`;
    showNotification(`Código cambiado a "${entityCap}"`, 'success');
  } else {
    // Restore original
    const lang = detectLang(originalCode);
    applyHighlight(codeEl, originalCode, lang);
    codeBlock.setAttribute('data-replaced', 'false');
    btn.classList.remove('replaced');
    btn.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:var(--warning);font-size:0.7rem;"></i> REEMPLAZA`;
    showNotification('Código restaurado a "Producto" (predeterminado)', 'info');
  }
}

function renderChecklist(items) {
  let html = `<ul class="checklist" id="checklist">`;
  items.forEach(item => {
    const checked = localStorage.getItem(item.id) === 'true';
    html += `<li class="${checked ? 'checked' : ''}" onclick="toggleCheck(this, '${item.id}')">
      <input type="checkbox" ${checked ? 'checked' : ''}>
      <span class="check-text">${item.text}</span>
    </li>`;
  });
  html += `</ul>`;
  return html;
}

function detectLang(code) {
  if (/^(CREATE|SELECT|INSERT|UPDATE|DELETE|ALTER|DROP|SHOW|DESCRIBE)\b/im.test(code)) return 'sql';
  if (/^(const|let|var|import|require|function|module|export)\b/m.test(code)) return 'javascript';
  if (/^(mkdir|cd|npm|ng|node)\b/m.test(code)) return 'bash';
  if (/^\s*[{\[]/m.test(code) && /:|\]/m.test(code)) return 'json';
  if (/^</m.test(code)) return 'xml';
  return 'javascript';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightBlocks(parent) {
  parent.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

// ===== INTERACTIONS =====
function togglePhase(el) {
  el.classList.toggle('open');
}

function copyCode(btn) {
  const block = btn.closest('.code-block');
  const pre = block ? block.querySelector('pre') : btn.nextElementSibling;
  const code = pre ? pre.textContent : '';
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = '<i class="fas fa-check" style="color:#22c55e"></i>';
    btn.classList.add('copied');
    showNotification('¡Copiado al portapapeles!', 'success');
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i>';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    showNotification('Error al copiar', 'error');
  });
}

function toggleCheck(el, id) {
  const checkbox = el.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  el.classList.toggle('checked');
  localStorage.setItem(id, checkbox.checked);
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const items = document.querySelectorAll('#checklist li');
  const checked = document.querySelectorAll('#checklist li.checked');
  const pct = items.length > 0 ? Math.round((checked.length / items.length) * 100) : 0;
  const el = document.getElementById('checklist-progress');
  if (el) el.textContent = `${checked.length}/${items.length} (${pct}%)`;
}

// ===== THEME TOGGLE =====
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const themeBtn = document.getElementById('theme-btn');
  if (next === 'dark') {
    themeBtn.innerHTML = '<i class="fas fa-sun"></i> <span>Claro</span>';
  } else {
    themeBtn.innerHTML = '<i class="fas fa-moon"></i> <span>Oscuro</span>';
  }
}

// ===== SEARCH =====
function searchGuide() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const phaseView = document.getElementById('phase-view');
  const dashboardView = document.getElementById('dashboard-view');
  const searchBox = document.querySelector('.search-box');

  if (!query) {
    document.querySelectorAll('.step').forEach(s => s.style.display = '');
    document.querySelectorAll('.step-highlight').forEach(s => s.classList.remove('step-highlight'));
    return;
  }

  const onPhase = phaseView.style.display !== 'none';
  if (!onPhase) {
    searchGuideGlobal(query);
    return;
  }

  const steps = phaseView.querySelectorAll('.step');
  let found = false;
  steps.forEach(s => {
    const match = s.textContent.toLowerCase().includes(query);
    s.style.display = match ? '' : 'none';
    if (match) { found = true; s.classList.add('step-highlight'); }
    else { s.classList.remove('step-highlight'); }
  });

  if (!found) {
    searchGuideGlobal(query);
  }
}

function searchGuideGlobal(query) {
  const dashboardView = document.getElementById('dashboard-view');

  for (let i = 0; i < phases.length; i++) {
    const phaseText = [];
    const p = phases[i];
    if (p.steps) {
      p.steps.forEach(s => {
        if (s.title) phaseText.push(s.title);
        if (s.content) phaseText.push(s.content);
        if (s.code) phaseText.push(s.code);
        if (s.verify) phaseText.push(s.verify);
      });
    }
    if (p.items) {
      p.items.forEach(item => phaseText.push(item.text));
    }
    const allText = phaseText.join(' ').toLowerCase();
    if (allText.includes(query)) {
      showPhase(i);
      setTimeout(() => {
        const steps = document.querySelectorAll('.step');
        let foundAny = false;
        steps.forEach(s => {
          const match = s.textContent.toLowerCase().includes(query);
          s.style.display = match ? '' : 'none';
          if (match) { foundAny = true; s.classList.add('step-highlight'); }
        });
        if (!foundAny) {
          document.querySelectorAll('.step').forEach(s => s.style.display = '');
        }
      }, 100);
      showNotification(`Resultados en "${p.title}"`, 'success');
      return;
    }
  }
  showNotification(`"${query}" no encontrado en la guía`, 'info');
}

// ===== ENTITY GENERATOR =====
const DEFAULT_FIELDS = [
  { name: 'id', type: 'INTEGER', length: '', pk: true, notNull: true, unique: false, default: '' },
  { name: 'nombre', type: 'VARCHAR', length: '100', pk: false, notNull: true, unique: false, default: '' },
  { name: 'descripcion', type: 'TEXT', length: '', pk: false, notNull: false, unique: false, default: '' },
  { name: 'precio', type: 'DECIMAL', length: '10,2', pk: false, notNull: true, unique: false, default: '' },
  { name: 'cantidad', type: 'INTEGER', length: '', pk: false, notNull: true, unique: false, default: '0' },
  { name: 'estado', type: 'VARCHAR', length: '20', pk: false, notNull: false, unique: false, default: "'ACTIVO'" }
];

const TYPE_OPTIONS = ['INTEGER','BIGINT','VARCHAR','TEXT','DECIMAL','DATE','TIMESTAMP','BOOLEAN'];
const ENGINES = ['mysql','postgres','sqlserver','oracle','sqlite'];
const ENGINE_LABELS = { mysql: 'MySQL', postgres: 'PostgreSQL', sqlserver: 'SQL Server', oracle: 'Oracle DB', sqlite: 'SQLite' };

let fieldCount = 0;

function renderEntityGenerator() {
  const container = document.getElementById('entity-generator-form');
  if (!container) return;
  fieldCount = 0;
  let html = `
    <div class="input-row">
      <div style="flex:2">
        <label class="field-label">Nombre de la entidad</label>
        <input type="text" id="entity-input" placeholder="Ej: producto, cliente, tarea..." autocomplete="off" value="${currentEntityName}" oninput="currentEntityName = this.value.trim().toLowerCase()">
      </div>
      <div style="flex:1">
        <label class="field-label">Motor de base de datos</label>
        <select id="engine-select" class="field-select">
          ${ENGINES.map(e => `<option value="${e}">${ENGINE_LABELS[e]}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="input-row">
      <button id="apply-entity-btn" class="btn-apply" onclick="applyEntityToGuide()" title="Reemplaza PRODUCTO/Producto/producto en la guía por tu entidad">
        <i class="fas fa-check"></i> Aplicar Entidad a la Guía
      </button>
    </div>

    <div class="fields-section">
      <div class="fields-header">
        <label class="field-label">Campos de la tabla</label>
        <button type="button" class="btn-add-field" onclick="addFieldRow()"><i class="fas fa-plus"></i> Agregar Campo</button>
      </div>
      <div class="fields-grid fields-header-row">
        <span class="field-hdr">Nombre</span>
        <span class="field-hdr">Tipo</span>
        <span class="field-hdr">Longitud</span>
        <span class="field-hdr">PK</span>
        <span class="field-hdr">NOT NULL</span>
        <span class="field-hdr">UNIQUE</span>
        <span class="field-hdr">Default</span>
        <span class="field-hdr"></span>
      </div>
      <div id="fields-container"></div>
    </div>

    <div style="text-align:center;margin-top:1rem;">
      <button id="generate-btn" class="btn-generate" onclick="generateForEntity()"><i class="fas fa-play"></i> Generar Código</button>
    </div>
  `;
  container.innerHTML = html;

  DEFAULT_FIELDS.forEach(f => addFieldRow(f));
}

function addFieldRow(data) {
  const container = document.getElementById('fields-container');
  if (!container) return;
  const idx = fieldCount++;
  const name = data ? data.name : '';
  const type = data ? data.type : 'VARCHAR';
  const length = data ? data.length : '';
  const pk = data && data.pk ? 'checked' : '';
  const notNull = data && data.notNull ? 'checked' : '';
  const unique = data && data.unique ? 'checked' : '';
  const dflt = data ? data.default : '';

  const idField = name === 'id';

  const row = document.createElement('div');
  row.className = 'fields-grid field-row';
  row.id = `field-row-${idx}`;
  row.innerHTML = `
    <input type="text" class="f-name" value="${name}" placeholder="campo" ${idField ? 'readonly' : ''}>
    <select class="f-type">${TYPE_OPTIONS.map(t => `<option value="${t}" ${t === type ? 'selected' : ''}>${t}</option>`).join('')}</select>
    <input type="text" class="f-length" value="${length}" placeholder="255" ${idField ? 'readonly' : ''}>
    <input type="checkbox" class="f-pk" ${pk} ${idField ? 'disabled checked' : ''}>
    <input type="checkbox" class="f-notnull" ${notNull} ${idField ? 'disabled checked' : ''}>
    <input type="checkbox" class="f-unique" ${unique}>
    <input type="text" class="f-default" value="${dflt}" placeholder="valor">
    <button type="button" class="btn-remove-field" onclick="removeFieldRow(${idx})" ${name === 'id' ? 'disabled' : ''}><i class="fas fa-times"></i></button>
  `;
  container.appendChild(row);
}

function removeFieldRow(idx) {
  const row = document.getElementById(`field-row-${idx}`);
  if (row) row.remove();
}

function collectFields() {
  const rows = document.querySelectorAll('.field-row');
  const fields = [];
  rows.forEach(row => {
    const name = row.querySelector('.f-name').value.trim();
    if (!name) return;
    fields.push({
      name: name,
      type: row.querySelector('.f-type').value,
      length: row.querySelector('.f-length').value.trim(),
      pk: row.querySelector('.f-pk').checked,
      notNull: row.querySelector('.f-notnull').checked,
      unique: row.querySelector('.f-unique').checked,
      default: row.querySelector('.f-default').value.trim()
    });
  });
  return fields;
}

async function generateForEntity() {
  const entity = document.getElementById('entity-input').value.trim().toLowerCase();
  currentEntityName = entity;
  const engine = document.getElementById('engine-select').value;
  const fields = collectFields();
  const btn = document.getElementById('generate-btn');
  const result = document.getElementById('generated-result');

  if (!entity) {
    showNotification('Ingresa el nombre de la entidad', 'error');
    return;
  }
  if (fields.length === 0) {
    showNotification('Agrega al menos un campo a la tabla', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, engine, fields })
    });
    const data = await response.json();

    if (data.error) {
      showNotification(data.error, 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-play"></i> Generar Código';
      return;
    }

    generatedEntityData = data;
    result.classList.add('show');
    renderGeneratedTabs(data);
    showNotification(`Código generado para "${data.entity}" en ${data.engineName}`, 'success');
  } catch (err) {
    showNotification('Error al conectar con el servidor', 'error');
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-play"></i> Generar Código';
}

function renderGeneratedTabs(data) {
  const container = document.getElementById('generated-result');
  const tabs = [
    { id: 'sql', label: `SQL (${data.engineName})`, content: data.sql },
    { id: 'dbConfig', label: 'Conexión BD', content: data.dbConfig },
    { id: 'model', label: 'Modelo', content: data.model },
    { id: 'controller', label: 'Controlador', content: data.controller },
    { id: 'routes', label: 'Rutas', content: data.routes },
    { id: 'angular-model', label: 'Modelo Angular', content: data.angularModel },
    { id: 'angular-service', label: 'Service Angular', content: data.angularService },
    { id: 'seed', label: 'Faker (seed)', content: data.seed },
    { id: 'http-client', label: 'REST Client (.http)', content: data.httpClient },
    { id: 'env', label: '.env', content: data.env },
    { id: 'deps', label: 'Dependencias', content: data.dependencies }
  ];

  let html = `<h4 style="margin-bottom:0.5rem;">
    Código generado para: <strong>${data.entityCapitalized}</strong> 
    <span style="font-weight:normal;color:var(--text-secondary);font-size:0.8rem;">
      (${data.engineName} · ${data.plural})
    </span>
  </h4>`;
  html += `<div class="tabs">`;
  tabs.forEach((tab, i) => {
    html += `<button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="switchGeneratedTab(this, '${tab.id}')">${tab.label}</button>`;
  });
  html += `</div>`;

  tabs.forEach((tab, i) => {
    const lang = tab.id === 'sql' ? 'sql' : tab.id === 'env' || tab.id === 'deps' ? 'bash' : 'javascript';
    html += `<div class="code-block ${i === 0 ? 'active' : ''}" id="gen-${tab.id}">
      <span class="code-lang">${lang}</span>
      <button class="copy-btn" onclick="copyCode(this)" title="Copiar"><i class="fas fa-copy"></i></button>
      <pre><code class="language-${lang}">${escapeHtml(tab.content)}</code></pre>
    </div>`;
  });

  container.innerHTML = html;
  highlightBlocks(container);
}

function switchGeneratedTab(btn, tabId) {
  document.querySelectorAll('#generated-result .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#generated-result .code-block').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`gen-${tabId}`).classList.add('active');
}

// ===== SYNC GUIDE ENTITY =====
function syncGuideEntity(entityName) {
  const container = document.getElementById('guide-container');
  if (!container) return;

  if (!container.hasAttribute('data-original-html')) {
    container.setAttribute('data-original-html', container.innerHTML);
  }

  const originalHtml = container.getAttribute('data-original-html');
  currentEntityName = entityName;
  const entityUpper = entityName.toUpperCase();
  const entityCap = entityName.charAt(0).toUpperCase() + entityName.slice(1).toLowerCase();
  const entityLower = entityName.toLowerCase();

  if (!entityName.trim()) {
    container.innerHTML = originalHtml;
    highlightBlocks(container);
    return;
  }

  let html = originalHtml;
  html = html.replace(/PRODUCTO/g, entityUpper);
  html = html.replace(/Producto/g, entityCap);
  html = html.replace(/producto/g, entityLower);
  html = html.replace(/\[REEMPLAZAR\]/g, entityCap);

  container.innerHTML = html;
  highlightBlocks(container);
}

// ===== APPLY ENTITY TO GUIDE =====
function applyEntityToGuide() {
  const entity = document.getElementById('entity-input').value.trim().toLowerCase();
  if (!entity) {
    showNotification('Primero ingresa el nombre de la entidad', 'error');
    return;
  }

  const container = document.getElementById('guide-container');
  if (!container) {
    showNotification('Abre una sección de la guía primero (ej. Fase 2)', 'info');
    return;
  }

  if (!container.hasAttribute('data-original-html')) {
    container.setAttribute('data-original-html', container.innerHTML);
  }

  // Save original codes before HTML string replacements corrupt them
  const savedOriginalCodes = [];
  container.querySelectorAll('.code-block').forEach(block => {
    savedOriginalCodes.push(block.getAttribute('data-original-code'));
  });

  const originalHtml = container.getAttribute('data-original-html');
  currentEntityName = entity;

  const entityUpper = entity.toUpperCase();
  const entityCap = entity.charAt(0).toUpperCase() + entity.slice(1);
  const entityLower = entity.toLowerCase();
  const entityPlural = pluralizeWord(entity);

  let html = originalHtml;
  html = html.replace(/PRODUCTOS/g, entityUpper + 'S');
  html = html.replace(/PRODUCTO/g, entityUpper);
  html = html.replace(/Productos/g, entityCap + 's');
  html = html.replace(/Producto/g, entityCap);
  html = html.replace(/productos/g, entityLower + 's');
  html = html.replace(/producto/g, entityLower);
  html = html.replace(/bd_productos/g, 'bd_' + entityLower + 's');
  html = html.replace(/\[REEMPLAZAR\]/g, entityCap);
  html = html.replace(/\s*←\s*REEMPLAZAR/g, '');

  container.innerHTML = html;
  // Restore original data-original-code after string replacement corrupted them
  container.querySelectorAll('.code-block').forEach((block, i) => {
    if (savedOriginalCodes[i]) {
      block.setAttribute('data-original-code', savedOriginalCodes[i]);
    }
  });
  highlightBlocks(container);
  ensureCopyButtons(container);
  showNotification(`Guía actualizada a "${entityCap}"`, 'success');
}

function pluralizeWord(word) {
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) return word + 'es';
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  return word + 's';
}

// ===== ENSURE COPY BUTTONS ON ALL CODE BLOCKS =====
function ensureCopyButtons(container) {
  container.querySelectorAll('.code-block').forEach(block => {
    if (block.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.title = 'Copiar';
    btn.innerHTML = '<i class="fas fa-copy"></i>';
    btn.onclick = function() { copyCode(this); };
    block.appendChild(btn);
  });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ===== CHECKLIST PROGRESS DISPLAY =====
function addChecklistProgress() {
  const checklist = document.getElementById('checklist');
  if (!checklist) return;
  const progress = document.createElement('div');
  progress.id = 'checklist-progress';
  progress.style.cssText = 'text-align:right;font-size:0.8rem;color:var(--text-secondary);margin-top:0.5rem;';
  checklist.parentNode.insertBefore(progress, checklist.nextSibling);
  updateChecklistProgress();
}

// ===== MOBILE SIDEBAR =====
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<i class="fas fa-bars"></i>';
  toggle.setAttribute('aria-label', 'Abrir menú de navegación');
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function addAnimateOnScroll() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((el, i) => {
    el.style.transitionDelay = `${i * 30}ms`;
    el.classList.add('animate-on-scroll');
  });
}

// ===== IMPROVED NOTIFICATION =====
const originalNotify = showNotification;
showNotification = function(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  let timeout = setTimeout(() => el.remove(), 3000);
  el.addEventListener('mouseenter', () => clearTimeout(timeout));
  el.addEventListener('mouseleave', () => {
    timeout = setTimeout(() => el.remove(), 3000);
  });
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();

  document.querySelector('.sidebar-header').addEventListener('click', () => { showDashboard(); closeMobileSidebar(); });

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('theme-btn');
  themeBtn.innerHTML = savedTheme === 'dark'
    ? '<i class="fas fa-sun"></i> <span>Claro</span>'
    : '<i class="fas fa-moon"></i> <span>Oscuro</span>';

  document.getElementById('search-input').addEventListener('input', searchGuide);

  showDashboard();

  addChecklistProgress();
  initScrollAnimations();

  fetch('/api/stats')
    .then(r => r.json())
    .then(data => {
      const el = document.getElementById('visitor-count');
      if (el) el.innerHTML = `<i class="fas fa-users"></i> ${data.total} persona${data.total !== 1 ? 's' : ''} han usado esta guía`;
    })
    .catch(() => {});
});
