# Eco-Garden API & Frontend 🌱

**Eco-Garden** es una aplicación web completa (API RESTful + Frontend) diseñada para ayudar a los entusiastas de la jardinería urbana a planificar y gestionar sus huertas. La aplicación proporciona un catálogo detallado de cultivos basado en datos del **INTA ProHuerta**, permitiendo a los usuarios registrarse, crear "lotes de cultivo" y hacer un seguimiento del progreso de cada planta individualmente.

---

## Consigna del Trabajo Práctico Integrador

- **Carrera:** Back End con NodeJs – comisión 202504
- **Profesora:** Sofia Sachetti
- **Objetivo:** Desarrollar y desplegar una API RESTful completa que cumpla con buenas prácticas de desarrollo profesional, organizada en módulos y con funcionalidades esenciales para un sistema realista.

### Funcionalidades y Requisitos Técnicos

#### 1. Configuración y Estructura del Proyecto (2 puntos)

- **Estructura modular:** Crear una arquitectura clara separada en Rutas, Controladores, Modelos y Servicios/Utilidades.
- **Variables de Entorno:** Configurar un archivo `.env` para manejar datos sensibles (claves, puerto) y asegurarse de que no se suba al repositorio (`.gitignore`).

#### 2. Endpoints de la API (3 puntos)

Implementar un CRUD completo y un sistema de autenticación:

- `POST /users/register`: Registrar usuarios con contraseñas hasheadas.
- `POST /users/login`: Autenticar usuarios y devolver un token JWT.
- `GET /items`: Listar todos los elementos del sistema.
- `POST /items`: Agregar un nuevo elemento.
- `PUT /items/:id`: Editar un elemento existente.
- `DELETE /items/:id`: Eliminar un elemento.

#### 3. Seguridad y Validaciones (3 puntos)

- **Middlewares:** Implementar middlewares para:
    - Validar tokens de autenticación en rutas protegidas.
    - Manejar errores de forma centralizada.
- **Consultas `case insensitive`:** Asegurar que las búsquedas y filtros no sean sensibles a mayúsculas/minúsculas para mejorar la experiencia de usuario.

#### 4. Despliegue en Render (2 puntos)

- **Repositorio:** Subir el proyecto completo a GitHub.
- **Configuración en Render:**
    - Conectar el repositorio a un nuevo "Web Service".
    - **Build Command:** `npm install && npx tsc` (o similar para compilar TypeScript).
    - **Start Command:** `node dist/server.js` (o la ruta al archivo de inicio compilado).
- **Verificación:** Confirmar que la API funcione correctamente en la URL pública proporcionada por Render.

#### 5. Frontend (Opcional)

- Crear una interfaz estática (`HTML`, `CSS`, `JS`) servida desde la carpeta `public/`.
- La interfaz debe permitir interactuar con la API (listar, agregar, editar, eliminar) y mostrar feedback al usuario.

#### 6. Documentación

- **`README.md`:** Incluir una descripción del proyecto, stack tecnológico, instrucciones de instalación y uso, y la lista de endpoints.
- **Comentarios en el código:** Documentar las funcionalidades clave para explicar la lógica implementada.

---

### Entregables

1.  **Repositorio de GitHub** con el código fuente y el `README.md`.
2.  **URL de la API desplegada en Render**.
3.  **(Opcional)** Verificación de que el frontend se conecta y funciona con la API desplegada.

---

## ✨ Características Principales

### Backend

- **Autenticación Segura:** Sistema de registro y login con contraseñas encriptadas (bcrypt) y autenticación basada en tokens (JWT).
- **Gestión de Roles:** Diferenciación entre usuarios (`gardener`) y administradores (`admin`) con permisos específicos.
- **Arquitectura de Lotes de Cultivo:** Un modelo de datos avanzado que permite registrar múltiples siembras de la misma especie y hacer un seguimiento individual del estado de cada planta.
- **Catálogo de Plantas del INTA:** Endpoints para consultar un catálogo detallado con información sobre siembra, cosecha, asociaciones y más.
- **Validación Robusta:** Uso de **Zod** para validar todos los datos de entrada, asegurando la integridad de la información.
- **Estructura Modular:** El código está organizado en Controladores, Modelos, Rutas, Schemas y Utilidades, siguiendo el principio DRY.

### Frontend

-  **Interfaz Moderna e Intuitiva:** Desarrollado con HTML semántico, CSS (Tailwind) y JavaScript modular (ESM).
-  **Diseño Responsive (Mobile First):** La interfaz se adapta a cualquier dispositivo, desde móviles hasta escritorios, utilizando un menú hamburguesa para pantallas pequeñas.
-  **Modo Oscuro/Claro:** El usuario puede elegir su tema visual preferido, y la elección se guarda en `localStorage`.
-  **Componentes Reutilizables:** Un sistema de modales y loaders centralizado para una experiencia de usuario consistente y profesional.
-  **Feedback Visual Avanzado:** Animaciones CSS personalizadas (loader de germinación), loaders en botones y modales de alerta para una comunicación clara con el usuario.
-  **CSS Organizado:** Los estilos personalizados están modularizados en archivos por componente (loader, tarjetas, etc.) e importados en un archivo principal, siguiendo una arquitectura CSS escalable.

---

## 🛠️ Stack Tecnológico

-  **Backend:** Node.js, Express, TypeScript
-  **Seguridad:** JSON Web Tokens (JWT), bcrypt.js, Helmet (CSP)
-  **Validación:** Zod
-  **Frontend:** HTML5, CSS3, Tailwind CSS (vía CDN), JavaScript (ESM)
-  **Iconografía:** Font Awesome
-  **Tipografía:** Google Fonts (Nunito)
-  **Despliegue:** Render

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en un entorno local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Pasos

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/eco-garden.git
    cd eco-garden
    ```

2.  **Instalar dependencias del Backend:**

    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    - Crea un archivo `.env` en la raíz del proyecto.
    - Copia el contenido de `.env.example` y rellena los valores.

    -   Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example`.
    -   Rellena los valores de `PORT`, `JWT_SECRET` y `MONGO_URI`.

4.  **Sembrar la base de datos (Opcional):**
    -   Para poblar el catálogo de plantas en tu base de datos de MongoDB, ejecuta:
    ```bash
    npm run seed
    ```

5.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    El backend y el frontend estarán corriendo en `http://localhost:3000`.

6.  **Abrir la aplicación:**
    -  Abre tu navegador y ve a `http://localhost:3000`.

---

## 🔗 Endpoints de la API

La API está desplegada en Render y puede ser consultada en la siguiente URL:

**[https://ecogarden-w8ks.onrender.com](https://ecogarden-w8ks.onrender.com)**

## 🔗 Endpoints de la API

La URL base para todas las peticiones es `[https://ecogarden-w8ks.onrender.com]`. Para el entorno local, es `http://localhost:3000`.

---

### 🌳 Catálogo de Plantas (Público)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/plants` | Obtener la lista completa de especies. |
| `GET` | `/api/plants/:id` | Obtener los detalles de una planta por su ID (slug). |
| `GET`| `/api/plants/difficulty/:level` | Filtrar plantas por nivel de dificultad. |
| `GET` | `/api/plants/check/:id` | Verificar si una planta está en temporada de siembra. |

### 👤 Autenticación
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registrar un nuevo usuario. |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener un token JWT. |

### 🌿 Mi Huerta y Perfil (Protegido)
*Requiere `Authorization: Bearer <token>`.*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/gardener/profile` | Obtener el perfil del usuario. |
| `PUT` | `/api/gardener/profile` | Actualizar datos del perfil. |
| `GET` | `/api/gardener/garden` | Obtener todos los lotes de cultivo del usuario. |
| `POST` | `/api/gardener/garden/batch`| Añadir un nuevo lote de cultivo. |
| `PATCH` | `/api/gardener/garden/instance`| Actualizar el estado de una planta individual. |
| `DELETE`| `/api/gardener/garden/batch/:batchId`| Eliminar un lote de cultivo. |

### 🛡️ Administración (Protegido - Solo Admin)
*Requiere token con `role: "admin"`.*

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/plants` | Crear una nueva especie en el catálogo. |
| `PATCH` | `/api/plants/:id` | Actualizar una especie existente. |
| `DELETE`| `/api/plants/:id` | Eliminar una especie del catálogo. |
---

## 🧪 Testeo con Postman

Se ha desarrollado una completa colección de tests automatizados en Postman para validar todos los endpoints.

### Cómo Usar la Colección

1.  **Descargar los archivos:**
    - [Colección de Postman](./postman/collections/Eco-garden.postman_collection.json)
    - [Entorno de Postman](./postman/environments/Eco-garden-local.postman_environment.json)

2.  **Importar en Postman:**
    - Abre tu aplicación de Postman.
    - Haz clic en **"Import"**.
    - Arrastra y suelta los dos archivos `.json` descargados.

3.  **Configurar y Ejecutar:**
    - Asegúrate de que el servidor local esté corriendo (`npm run dev`).
    - Selecciona el entorno importado ("Eco-garden-local") en la esquina superior derecha.
    - Ejecuta las peticiones individualmente o usa el **Collection Runner** para una validación completa.

---

## 🗂️ Versiones de la Aplicación

Este repositorio contiene dos implementaciones de la capa de persistencia de datos, demostrando la evolución de una solución simple a una más robusta y escalable.

### 1. Versión con Base de Datos JSON (Rama: `feature/json-database`)

- **Descripción:** La primera versión de la API utiliza archivos `.json` locales como sistema de almacenamiento. Toda la lógica de lectura y escritura se gestiona de forma síncrona a través del módulo `fs` de Node.js.
- **Propósito:** Demostrar el manejo de archivos, la estructuración de modelos de datos manuales y la lógica de negocio fundamental de la aplicación.
- **Para ver el código de esta versión, puedes cambiar a la rama `feature/json-database`.**

### 2. Versión con MongoDB (Rama: `main` / `developer`)

- **Descripción:** La versión actual y principal de la aplicación. Se ha migrado toda la capa de persistencia a una base de datos NoSQL profesional utilizando **MongoDB Atlas** y la librería **Mongoose**.
- **Propósito:** Demostrar habilidades en la integración con bases de datos externas, modelado de datos con Schemas, operaciones asíncronas y las mejores prácticas para una aplicación escalable en producción.
- **Esta es la versión que está desplegada en Render.**

## 🔮 Posibles Mejoras a Futuro

La arquitectura actual del proyecto permite expandir su funcionalidad de maneras interesantes:

- **Estadísticas de Cultivo:** Crear una sección en el dashboard que muestre gráficos y estadísticas avanzadas, como la tasa de éxito de germinación por especie (`(cosechadas + listas) / total`), el tiempo promedio de cosecha, etc.
- **Sistema de Avisos y Notificaciones:** Implementar un sistema que envíe recordatorios al usuario (ej. "¡Es hora de cosechar tus tomates!") basados en la fecha de siembra (`plantedAt`) y los días de cosecha (`diasCosecha`).
- **Calendario de Huerta Global:** Crear una vista de calendario anual donde se resalten visualmente los meses de siembra para todas las plantas del catálogo, ayudando al usuario a planificar su huerta a largo plazo.

---

Creado con ❤️ por **Antonela Borgogno**.
