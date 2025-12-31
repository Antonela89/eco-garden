Para arrancar tu proyecto **Eco-Garden** desde cero con TypeScript, Express, autenticación JWT y manejo de archivos JSON, estas son las dependencias exactas que necesitas.

Primero, asegúrate de estar dentro de la carpeta de tu proyecto y ejecuta los siguientes comandos:

### 1. Inicializar el proyecto
```bash
npm init -y
```

### 2. Dependencias de Producción (las que usa la app al correr)
Estas librerías se encargan del servidor, la seguridad y las variables de entorno:

```bash
npm install express jsonwebtoken bcryptjs dotenv cors
```

*   **`express`**: El framework para crear tu API REST.
*   **`jsonwebtoken`**: Para generar y validar los tokens de los usuarios.
*   **`bcryptjs`**: Para encriptar las contraseñas antes de guardarlas en tu JSON (muy importante para la seguridad).
*   **`dotenv`**: Para manejar variables sensibles (como tu clave secreta del token) en un archivo `.env`.
*   **`cors`**: Permite que tu Frontend se comunique con tu Backend sin bloqueos de seguridad.

### 3. Dependencias de Desarrollo (solo para programar)
Estas herramientas ayudan a que TypeScript funcione y a que el servidor se reinicie solo:

```bash
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors ts-node-dev
```

*   **`typescript`**: El compilador de TS.
*   **`@types/...`**: Los "traductores" para que TypeScript entienda las librerías de JavaScript anteriores.
*   **`ts-node-dev`**: Es la mejor herramienta para desarrollo; compila y reinicia el servidor automáticamente cada vez que guardas un cambio.

---

### 4. Configuración final (Archivos clave)

#### Archivo `.env` (en la raíz)
Crea un archivo llamado `.env` para guardar tu secreto del token:
```text
PORT=3000
JWT_SECRET=tu_semilla_secreta_prohuerta_2024
```

#### Archivo `tsconfig.json`
Genéralo con `npx tsc --init` y asegúrate de que tenga estas líneas para evitar el error de resolución que vimos antes:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

#### Scripts en `package.json`
Modifica la sección `"scripts"` para arrancar fácil:
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### Resumen de carpetas para empezar:
Para que no te falte nada al dar el primer `npm run dev`, crea esta estructura mínima:
1. `src/server.ts` (Punto de entrada).
2. `src/data/plants.json` (Pega aquí el JSON que te pasé antes).
3. `src/data/gardeners.json` (Crea un archivo con un array vacío: `[]`).

### Estructura del proyecto
eco-garden/
├── src/
│   ├── data/             # Tus archivos JSON
│   │   ├── gardeners.json
│   │   └── plants.json
│   ├── models/           # Lógica de acceso a datos
│   │   ├── gardener-model.ts
│   │   └── plant-model.ts
│   ├── controllers/      # Lógica de negocio (procesar req/res)
│   │   ├── gardener-controller.ts
│   │   └── plant-controller.ts
│   ├── routes/           # Definición de rutas
│   │   ├── gardener-routes.ts
│   │   └── plant-routes.ts
│   ├── app.ts            # Configuración de Express
│   └── server.ts         # Punto de entrada
├── public/               # Frontend (HTML, CSS, TS/JS)
├── tsconfig.json
└── package.json

---

## 🧪 Testeo Automatizado de la API Eco-Garden con Postman

Esta colección de Postman está diseñada para realizar un testeo completo de todos los endpoints de la API, cubriendo tanto los casos de éxito como los de error.

### 1. Configuración del Entorno (Environment)

Antes de ejecutar la colección, crea un nuevo **Environment** en Postman con las siguientes variables. Esto permitirá que los tests se ejecuten de forma dinámica.

| Variable | Valor Inicial | Descripción |
| :--- | :--- | :--- |
| `url` | `http://localhost:3000/api` | URL base de la API. |
| `gardener_email` | `jardinero@test.com` | Email para el usuario de prueba. |
| `gardener_password` | `Password123` | Contraseña para el usuario de prueba. |
| `gardener_token` | *(vacío)* | Se llenará automáticamente al hacer login. |
| `admin_email` | `admin@test.com` | Email para el administrador de prueba. |
| `admin_password` | `Password123` | Contraseña para el administrador de prueba. |
| `admin_token` | *(vacío)* | Se llenará automáticamente al hacer login. |

### 2. Estructura de la Colección

Organiza las peticiones en las siguientes carpetas para un flujo de testeo lógico:

#### 📂 1. [Auth] - Autenticación y Tokens

**1.1 `POST Register Gardener`**
- **Endpoint:** `POST {{url}}/auth/register`
- **Body (JSON):**
  ```json
  {
      "username": "Jardinero Test",
      "email": "{{gardener_email}}",
      "password": "{{gardener_password}}",
      "role": "gardener"
  }
  ```
- **Test Script (Post-response):**
  ```javascript
  // Validar que la API responda con 201 (Creado)
  pm.test("Verificar estado 201: Registro exitoso", function () {
      pm.response.to.have.status(201);
  });
  // Verificar que el cuerpo de la respuesta tenga la estructura esperada
  pm.test("Validar estructura de la respuesta de registro", function () {
      const jsonData = pm.response.json();
      pm.expect(jsonData.user).to.have.property('id');
      pm.expect(jsonData.user).to.not.have.property('password');
  });
  ```

**1.2 `POST Register Admin`**
- **Endpoint:** `POST {{url}}/auth/register`
- **Body (JSON):**
  ```json
  {
      "username": "Admin Test",
      "email": "{{admin_email}}",
      "password": "{{admin_password}}",
      "role": "admin"
  }
  ```
- **Test Script (Post-response):** Mismo que el de `Register Gardener`.

**1.3 `POST Login Gardener`**
- **Endpoint:** `POST {{url}}/auth/login`
- **Body (JSON):**
  ```json
  {
      "email": "{{gardener_email}}",
      "password": "{{gardener_password}}"
  }
  ```
- **Test Script (Post-response):**
  ```javascript
  // Validar login exitoso (200 OK)
  pm.test("Verificar estado 200: Login exitoso", function () {
      pm.response.to.have.status(200);
  });
  // Extraer el token y guardarlo automáticamente en las variables de entorno
  pm.test("Extraer y persistir el token JWT del Jardinero", function () {
      const jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('token');
      pm.environment.set("gardener_token", jsonData.token);
  });
  ```

**1.4 `POST Login Admin`**
- **Endpoint:** `POST {{url}}/auth/login`
- **Body (JSON):**
  ```json
  {
      "email": "{{admin_email}}",
      "password": "{{admin_password}}"
  }
  ```
- **Test Script (Post-response):**
  ```javascript
  // Similar al anterior, pero guarda en la variable 'admin_token'
  pm.test("Extraer y persistir el token JWT del Admin", function () {
      const jsonData = pm.response.json();
      pm.environment.set("admin_token", jsonData.token);
  });
  ```

#### 📂 2. [Public] - Catálogo de Plantas

**2.1 `GET Get All Plants`**
- **Endpoint:** `GET {{url}}/plants`
- **Test Script (Post-response):**
  ```javascript
  // Validar que la respuesta sea un array con al menos una planta
  pm.test("Verificar que la respuesta es un catálogo de plantas", function () {
      const jsonData = pm.response.json();
      pm.expect(jsonData).to.be.an('array');
      pm.expect(jsonData.length).to.be.at.least(1);
  });
  ```

**2.2 `GET Get Plant by ID (Error 404)`**
- **Endpoint:** `GET {{url}}/plants/planta-inexistente`
- **Test Script (Post-response):**
  ```javascript
  // Validar que la API responda con 404 si la planta no existe
  pm.test("Verificar estado 404: Planta no encontrada", function () {
      pm.response.to.have.status(404);
  });
  ```

#### 📂 3. [Gardener] - Gestión de Huerta Personal

*Nota: Todas las peticiones en esta carpeta deben tener configurado `Authorization: Bearer {{gardener_token}}`.*

**3.1 `GET Get My Profile`**
- **Endpoint:** `GET {{url}}/gardener/profile`
- **Test Script (Post-response):**
  ```javascript
  // Validar que el perfil devuelto coincida con el email del usuario logueado
  pm.test("Verificar que el perfil devuelto es el correcto", function () {
      const jsonData = pm.response.json();
      pm.expect(jsonData.email).to.eql(pm.environment.get("gardener_email"));
  });
  ```

**3.2 `POST Add Plant to Garden (Success)`**
- **Endpoint:** `POST {{url}}/gardener/garden`
- **Body (JSON):** `{"plantId": "tomate"}`
- **Test Script (Post-response):**
  ```javascript
  // Validar que la planta se agregó correctamente (200 OK)
  pm.test("Verificar estado 200: Planta agregada", function () {
      pm.response.to.have.status(200);
  });
  ```

**3.3 `POST Add Plant to Garden (Duplicate Error)`**
- **Endpoint:** `POST {{url}}/gardener/garden`
- **Body (JSON):** `{"plantId": "tomate"}`
- **Test Script (Post-response):**
  ```javascript
  // Validar que la API devuelve 400 si se intenta agregar la misma planta
  pm.test("Verificar estado 400: Error de duplicado", function () {
      pm.response.to.have.status(400);
  });
  ```

#### 📂 4. [Admin] - Administración del Catálogo

*Nota: Todas las peticiones aquí deben tener `Authorization: Bearer {{admin_token}}`.*

**4.1 `POST Create Plant (Success)`**
- **Endpoint:** `POST {{url}}/plants`
- **Body (JSON):**
  ```json
  {
      "id": "planta-de-prueba",
      "nombre": "Planta de Prueba",
      "familia": "Testáceas",
      "siembra": ["Enero"],
      "metodo": ["Directa"],
      "diasCosecha": {"min": 10, "max": 20},
      "distancia": {"entrePlantas": 5, "entreLineas": 10},
      "asociacion": [], "rotacion": [],
      "toleranciaSombra": true, "aptoMaceta": true,
      "dificultad": "Fácil",
      "clima": "Templado",
      "imagen": "https://via.placeholder.com/150"
  }
  ```- **Test Script (Post-response):**
  ```javascript
  // Validar que la planta fue creada (201 Created)
  pm.test("Verificar estado 201: Planta creada por Admin", function () {
      pm.response.to.have.status(201);
  });
  ```

**4.2 `POST Create Plant (Forbidden Error)`**
- **Endpoint:** `POST {{url}}/plants`
- **Auth:** `Authorization: Bearer {{gardener_token}}`
- **Test Script (Post-response):**
  ```javascript
  // Validar que un jardinero común no puede crear plantas (403 Forbidden)
  pm.test("Verificar estado 403: Acceso denegado a Jardinero", function () {
      pm.response.to.have.status(403);
  });
  ```

### 3. Ejecución Automatizada (Collection Runner)

1.  Hacer clic derecho sobre la colección **Eco-garden**.
2.  Seleccionar **Run collection**.
3.  Asegurarse de que el orden de ejecución sea lógico: primero los registros, luego los logins y finalmente las acciones.
4.  Hacer clic en **Run Eco-garden**.

El resultado mostrará un resumen de los tests que pasaron ✅ y los que fallaron ❌, permitiendo una validación completa y rápida de toda la API.

