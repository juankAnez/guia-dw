# Guía Práctica para el Parcial

Aplicación web interactiva con la guía de estudio optimizada para el parcial de **Desarrollo Web y Bases de Datos II**. Incluye un generador de código multi-motor (MySQL, PostgreSQL, SQL Server, Oracle).

## Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML + CSS + JavaScript vanilla
- **Íconos:** Font Awesome 6
- **Código:** highlight.js

## Funcionalidades

- Guía completa con 11 fases: desde preparación del entorno hasta checklist del parcial
- Navegación por secciones Backend / Frontend con sidebar jerárquica
- Generador de código SQL, Sequelize, controlador, rutas y Angular
- Soporte multi-base de datos: MySQL, PostgreSQL, SQL Server, Oracle
- Búsqueda en tiempo real
- Modo oscuro / claro

## Ejecutar local

```bash
cd flask-app
pip install -r requirements.txt
python app.py
```

Abrir `http://localhost:5000`

## Desplegar

La app está lista para **Render**, **Railway** o **PythonAnywhere**.

```bash
# Construir para producción
cd flask-app
gunicorn app:app
```
