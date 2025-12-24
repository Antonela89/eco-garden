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

