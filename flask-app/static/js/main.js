// ===== DATA: All phases content =====
const phases = [
  {
    id: 'fase-0',
    number: 0,
    title: 'Preparación del Entorno',
    icon: '⚙️',
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
    number: 1,
    title: 'Creación del Backend',
    icon: '🖥️',
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
    number: 2,
    title: 'Creación de la Base de Datos',
    icon: '🗄️',
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
    number: 3,
    title: 'Modelo',
    icon: '📦',
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
    number: 4,
    title: 'Controlador',
    icon: '🎮',
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
    number: 5,
    title: 'Rutas',
    icon: '🛣️',
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
    number: 6,
    title: 'Pruebas con Postman',
    icon: '🔌',
    steps: [
      {
        title: 'CREAR (POST)',
        isTable: true,
        headers: ['Config', 'Valor'],
        rows: [
          ['Método', 'POST'],
          ['URL', 'http://localhost:3000/api/productos'],
          ['Headers', 'Content-Type: application/json'],
          ['Body', '{ "nombre": "Laptop", "precio": 2500000, "cantidad": 10, "estado": "ACTIVO" }'],
          ['Respuesta', '201 Created + datos del registro']
        ]
      },
      {
        title: 'LISTAR (GET)',
        isTable: true,
        headers: ['Config', 'Valor'],
        rows: [
          ['Método', 'GET'],
          ['URL', 'http://localhost:3000/api/productos'],
          ['Respuesta', '200 OK → { "data": [...] }']
        ]
      },
      {
        title: 'OBTENER POR ID (GET)',
        isTable: true,
        headers: ['Config', 'Valor'],
        rows: [
          ['Método', 'GET'],
          ['URL', 'http://localhost:3000/api/productos/1'],
          ['Respuesta', '200 OK → { "data": { ... } }']
        ]
      },
      {
        title: 'ACTUALIZAR (PUT)',
        isTable: true,
        headers: ['Config', 'Valor'],
        rows: [
          ['Método', 'PUT'],
          ['URL', 'http://localhost:3000/api/productos/1'],
          ['Body', '{ "nombre": "Laptop Pro", "precio": 3000000 }'],
          ['Respuesta', '200 OK → { "mensaje": "Actualizado correctamente" }']
        ]
      },
      {
        title: 'ELIMINAR (DELETE)',
        isTable: true,
        headers: ['Config', 'Valor'],
        rows: [
          ['Método', 'DELETE'],
          ['URL', 'http://localhost:3000/api/productos/1'],
          ['Respuesta', '200 OK → { "mensaje": "Eliminado correctamente" }']
        ]
      }
    ]
  },
  {
    id: 'fase-7',
    number: 7,
    title: 'Frontend Angular',
    icon: '🎨',
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
    number: 8,
    title: 'CRUD Completo en Angular',
    icon: '🔄',
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
    number: 9,
    title: 'Conexión Total',
    icon: '🔗',
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
    number: 10,
    title: 'Checklist del Parcial',
    icon: '✅',
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

// ===== RENDER ENGINE =====
function renderPhases() {
  const container = document.getElementById('phases-container');
  const navList = document.getElementById('sidebar-nav');

  phases.forEach((phase, index) => {
    // Sidebar item
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${phase.id}`;
    a.innerHTML = `<span class="phase-badge">${phase.number}</span> ${phase.title}`;
    li.appendChild(a);
    navList.appendChild(li);

    // Phase card
    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase';
    phaseEl.id = phase.id;

    let headerHtml = `
      <div class="phase-header" onclick="togglePhase(this.parentElement)">
        <span class="phase-number">${phase.icon}</span>
        <span class="phase-title">FASE ${phase.number} — ${phase.title}</span>
        <span class="phase-toggle">▼</span>
      </div>
      <div class="phase-body">
        <div class="phase-content">`;

    if (phase.isChecklist) {
      headerHtml += renderChecklist(phase.items);
    } else {
      phase.steps.forEach(step => {
        headerHtml += renderStep(step);
      });
    }

    headerHtml += `</div></div>`;
    phaseEl.innerHTML = headerHtml;
    container.appendChild(phaseEl);
  });
}

function renderStep(step) {
  let html = `<div class="step">`;
  if (step.title) html += `<h4>${step.title}</h4>`;
  if (step.content) html += `<p>${step.content}</p>`;

  if (step.code) {
    const lang = detectLang(step.code);
    html += `<div class="code-block">
      <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
      <pre><code class="language-${lang}">${escapeHtml(step.code)}</code></pre>
    </div>`;
  }

  if (step.verify) {
    html += `<div class="step"><h4>✅ Verificar</h4><p>${step.verify.replace(/\n/g, '<br>')}</p></div>`;
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
  const pre = btn.nextElementSibling;
  const code = pre.textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✅ Copiado';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copiar';
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
  document.getElementById('theme-btn').textContent = next === 'dark' ? '☀️ Claro' : '🌙 Oscuro';
}

// ===== SEARCH =====
function searchGuide() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const phases = document.querySelectorAll('.phase');

  phases.forEach(phase => {
    if (!query) {
      phase.style.display = '';
      return;
    }
    const text = phase.textContent.toLowerCase();
    phase.style.display = text.includes(query) ? '' : 'none';
  });
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
const ENGINES = ['mysql','postgres','sqlserver','oracle'];
const ENGINE_LABELS = { mysql: 'MySQL', postgres: 'PostgreSQL', sqlserver: 'SQL Server', oracle: 'Oracle DB' };

let fieldCount = 0;

function renderEntityGenerator() {
  const container = document.getElementById('entity-generator-form');
  let html = `
    <div class="input-row">
      <div style="flex:2">
        <label class="field-label">Nombre de la entidad</label>
        <input type="text" id="entity-input" placeholder="Ej: producto, cliente, tarea..." autocomplete="off">
      </div>
      <div style="flex:1">
        <label class="field-label">Motor de base de datos</label>
        <select id="engine-select" class="field-select">
          ${ENGINES.map(e => `<option value="${e}">${ENGINE_LABELS[e]}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="fields-section">
      <div class="fields-header">
        <label class="field-label">Campos de la tabla</label>
        <button type="button" class="btn-add-field" onclick="addFieldRow()">+ Agregar Campo</button>
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
      <button id="generate-btn" class="btn-generate" onclick="generateForEntity()">🚀 Generar Código</button>
    </div>
  `;
  container.innerHTML = html;

  // Add default fields
  DEFAULT_FIELDS.forEach(f => addFieldRow(f));
}

function addFieldRow(data) {
  const container = document.getElementById('fields-container');
  const idx = fieldCount++;
  const name = data ? data.name : '';
  const type = data ? data.type : 'VARCHAR';
  const length = data ? data.length : '';
  const pk = data && data.pk ? 'checked' : '';
  const notNull = data && data.notNull ? 'checked' : '';
  const unique = data && data.unique ? 'checked' : '';
  const dflt = data ? data.default : '';

  // Disable PK and NOT NULL for id field
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
    <button type="button" class="btn-remove-field" onclick="removeFieldRow(${idx})" ${name === 'id' ? 'disabled' : ''}>✕</button>
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
  btn.textContent = 'Generando...';

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
      btn.textContent = '🚀 Generar Código';
      return;
    }

    result.classList.add('show');
    renderGeneratedTabs(data);
    showNotification(`Código generado para "${data.entity}" en ${data.engineName}`, 'success');
  } catch (err) {
    showNotification('Error al conectar con el servidor', 'error');
  }

  btn.disabled = false;
  btn.textContent = '🚀 Generar Código';
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
      <button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button>
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

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ===== ACTIVE SIDEBAR LINK =====
function updateActiveSidebar() {
  const links = document.querySelectorAll('.sidebar-nav a');
  let currentId = '';

  phases.forEach(phase => {
    const el = document.getElementById(phase.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 150) currentId = phase.id;
    }
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderPhases();

  // Open first phase by default
  const firstPhase = document.querySelector('.phase');
  if (firstPhase) firstPhase.classList.add('open');

  // Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-btn').textContent = savedTheme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

  // Checklist progress
  updateChecklistProgress();

  // Scroll spy
  window.addEventListener('scroll', updateActiveSidebar);

  // Search on input
  document.getElementById('search-input').addEventListener('input', searchGuide);

  // Apply syntax highlighting
  highlightBlocks(document.getElementById('phases-container'));

  // Render entity generator
  renderEntityGenerator();
});
