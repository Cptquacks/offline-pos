# KEPLER — Suite de Gestión Offline para MIPYMES

[![Versión](https://img.shields.io/badge/versi%C3%B3n-1.1.5-blue.svg)](https://github.com/Cptquacks/offline-pos)
[![Plataforma](https://img.shields.io/badge/plataforma-Windows%20%7C%20Linux-lightgrey.svg)]()
[![Licencia](https://img.shields.io/badge/licencia-Propietaria-red.svg)]()

**KEPLER** es una aplicación de escritorio **100% offline** diseñada para la gestión integral de pequeños y medianos negocios. Centraliza ventas, inventario, empleados, proveedores y análisis económico en un solo lugar, sin depender de conexión a internet.

---

## 📋 Módulos y Características

### 🏪 Kiosko (Punto de Venta)
- Carrito de compras con cantidades y total en tiempo real.
- Registro de ventas y descuento automático de stock.
- Gestión de devoluciones y reembolsos.
- Historial de tickets de compra.
- Búsqueda difusa y filtrado por categorías.

### 📦 Inventario
- CRUD completo de productos (nombre, precio, stock, categoría, moneda, caducidad).
- **Importación masiva desde Excel/CSV** con mapeo visual de columnas.
- **Exportación a Excel** con fechas reales y formato correcto.
- Filtro por etiquetas y búsqueda por similitud de texto.
- Cálculo automático de precio de venta a partir de costo y margen de ganancia.
- Gestión de categorías (tags) desde Ajustes.

### 👥 Empleados
- Registro de personal: nombre, CI, salario, cargo, fechas de contrato, contacto.
- Cálculo automático del gasto total en salarios.
- Control de contratos (inicio/fin) y estado activo/inactivo.
- Notas internas por empleado.
- Importación/exportación de datos.

### 🚚 Proveedores
- Gestión de proveedores: nombre, gasto, moneda, fecha de contrato, periodicidad de recompra.
- Indicador de días restantes para la próxima recompra.
- Gasto total separado por moneda (CUP, USD, MXN, EUR).
- Contactos y notas asociadas.
- Importación/exportación.

### 💰 Economía
- Panel de control diario con la traza actual (ventas, reembolsos, ganancias).
- **Cierre de caja manual** y **cierre automático** al iniciar un nuevo día.
- Normalización de trazas para mantener el historial ligero.
- Gráficos interactivos:
  - Predicción de ventas (regresión lineal).
  - Ventas vs. Devoluciones (barras).
  - Ganancia bruta y neta (con referencia en cero para valores negativos).
  - Gasto de empleados (por persona y por cargo).
  - Gasto de proveedores (CUP/USD).
- Importación de días históricos.

### 🔧 Ajustes
- Gestión de categorías (tags) para productos.
- Gestión de cargos (roles) para empleados.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Electron** | Entorno de escritorio multiplataforma |
| **React 19** | Interfaz de usuario |
| **Vite 8** | Bundler y servidor de desarrollo |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Zustand** | Gestión de estado global |
| **Recharts** | Gráficos y visualización de datos |
| **SheetJS (xlsx)** | Importación/exportación de Excel/CSV |
| **React Router 7** | Navegación entre vistas |
| **FontAwesome** | Iconografía |

---

## ⚙️ Requisitos Previos

- **Node.js** 18 o superior.
- **npm** 9 o superior.
- **Wine** (solo si compilas para Windows desde Linux).

---

## 🚀 Instalación y Uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cptquacks/offline-pos.git
cd offline-pos

# 2. Instalar dependencias
npm install

# 3. Modo desarrollo (Vite + Electron con recarga en caliente)
npm run dev
```

### Compilar para producción

```bash
# Windows (genera un .exe portable en /release)
npm run build:win

# Linux (genera un AppImage en /release)
npm run build:linux
```

---

## 📁 Estructura del Proyecto

```
offline-pos/
├── public/                # Archivos estáticos (iconos, etc.)
├── src/
│   ├── assets/            # Recursos (imágenes, fuentes)
│   ├── components/        # Componentes reutilizables de React
│   ├── context/           # Contextos de React (DialogContext, etc.)
│   ├── electron/          # Proceso principal de Electron (main, preload, servicios)
│   ├── stores/            # Stores de Zustand (productos, trazas, empleados, etc.)
│   ├── utils/             # Utilidades (fechas, strings, almacenamiento, etc.)
│   ├── views/             # Vistas principales de la aplicación
│   ├── App.jsx            # Componente raíz
│   └── main.jsx           # Punto de entrada del renderer
├── index.html             # HTML base
├── package.json           # Dependencias y scripts
└── vite.config.js         # Configuración de Vite
```

---

## 🔐 Licencia

**Software propietario.**  
© 2026 **Shard Development Team**. Todos los derechos reservados.

Este software se distribuye bajo un sistema de licencias de pago único. No está permitida su redistribución, modificación o uso comercial sin autorización expresa del equipo desarrollador.

---

## 👥 Créditos

Desarrollado con esfuerzo por **Shard Development Team**.

- **Cptquacks** — Desarrollo principal.

---

> **Nota:** KEPLER funciona completamente offline. Todos los datos se almacenan localmente en la carpeta de usuario del sistema operativo (`%APPDATA%/Kepler` en Windows, `~/.config/Kepler` en Linux).
> **Nota 2:** Hice este README.md con DeepSeek