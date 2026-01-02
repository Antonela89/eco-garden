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

Claro. Aquí tienes un resumen redactado para ser copiado directamente en tu `README.md`. Está escrito en un tono profesional y técnico, ideal para documentar la calidad de tu proyecto.

---

### 🧪 Testeo Automatizado de la API

Para garantizar la robustez, integridad y seguridad de la API **Eco-Garden**, se ha implementado una completa suite de tests automatizados utilizando **Postman** y su **Collection Runner**. Esta suite verifica todos los endpoints disponibles, cubriendo tanto los "caminos felices" (respuestas exitosas) como los casos de error esperados (validaciones, permisos, etc.).

#### Objetivos del Testeo

Los tests automatizados fueron diseñados para cumplir con los siguientes objetivos:

1.  **Validar la Lógica de Negocio:** Asegurar que las funcionalidades clave, como el registro de usuarios, la gestión de la huerta personal y la consulta del catálogo estacional, operen según lo esperado.
2.  **Verificar la Integridad de los Datos:** Confirmar que los datos se persisten correctamente en los archivos JSON y que las validaciones de **Zod** impiden el ingreso de información malformada.
3.  **Garantizar la Seguridad:** Comprobar que los middlewares de autenticación (JWT) y autorización (Roles) protejan adecuadamente los endpoints privados y de administrador.
4.  **Confirmar la Robustez de la API:** Verificar que la API maneje correctamente los errores (ej. recursos no encontrados, credenciales inválidas) y devuelva los códigos de estado HTTP apropiados.

#### Estructura de la Colección de Tests

La colección se organiza en cuatro carpetas lógicas que simulan el ciclo de vida completo de la interacción con la API:

1.  **[Public] - Endpoints de Acceso Libre:**
    -   `GET /`: Validar que la API esté online y devuelva el mensaje de bienvenida.
    -   `GET /plants`: Asegurar que el catálogo de plantas se pueda consultar públicamente.
    -   `GET /plants/check/:id`: Probar la lógica estacional para determinar si un cultivo está en temporada.

2.  **[Auth] - Autenticación y Tokens:**
    -   `POST /auth/register`: Testear la creación de usuarios (`gardener` y `admin`) y la correcta validación de duplicados.
    -   `POST /auth/login`: Verificar la autenticación de credenciales y la generación automática de tokens JWT, que son capturados y almacenados en variables de entorno para su uso en tests posteriores.

3.  **[Gardener] - Mi Huerta Personal:**
    -   `POST /gardener/garden`: Probar el ciclo completo de agregar un cultivo a la huerta.
    -   `GET /gardener/garden`: Validar que la huerta personal se pueda consultar y que los datos se enriquezcan con la información del catálogo.
    -   `DELETE /gardener/garden/:plantId`: Confirmar que un usuario pueda eliminar cultivos de su propia huerta.
    -   **Test de Duplicados:** Asegurar que la API devuelva un error `400 Bad Request` si se intenta agregar una planta ya existente.

4.  **[Admin] - Administración del Catálogo:**
    -   `PATCH /plants/:id`: Validar que un usuario con rol `admin` pueda modificar el catálogo maestro.
    -   `DELETE /plants/:id`: Probar la eliminación de especies del catálogo por un administrador.
    -   **Test de Permisos:** Asegurar que la API devuelva un error `403 Forbidden` si un usuario con rol `gardener` intenta realizar acciones de administrador.

#### Ejecución y Resultados

La suite completa se ejecuta a través del **Collection Runner** de Postman, el cual orquesta las peticiones en una secuencia lógica para garantizar que los datos generados en un paso (como los tokens) estén disponibles para los siguientes. Los resultados de cada test son evaluados automáticamente, proporcionando un informe claro de los éxitos (`✅`) y fallos (`❌`), lo que facilita la depuración y el mantenimiento continuo de la API.

![Link de Colección en Postman:](https://martian-eclipse-514495.postman.co/workspace/Team-Workspace~f2d65b89-0cb6-4194-8df8-5f8f94fde9ff/collection/27770697-2d5f7da2-439e-46cb-ad64-300cb05d031b?action=share&creator=27770697&active-environment=27770697-d339324f-fb43-4462-bd65-94a8af963b8d)