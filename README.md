# Mi Recetario

Sitio estático (Eleventy) con panel de administración (Sveltia CMS) para ir
cargando recetas vos mismo, con tags, sin tocar código.

## 1. Subir esto a GitHub

1. Creá una cuenta en https://github.com si no tenés.
2. Creá un repositorio nuevo, por ejemplo `recetario` (puede ser privado o público).
3. Subí esta carpeta al repo. Lo más simple, sin usar la terminal:
   - En la página del repo vacío, click en "uploading an existing file" y arrastrá
     todos los archivos y carpetas (manteniendo la estructura).

## 2. Conectar con Netlify

1. Entrá a https://app.netlify.com y logueate (podés usar tu cuenta de GitHub).
2. "Add new site" → "Import an existing project" → elegí GitHub → seleccioná el repo `recetario`.
3. Netlify va a detectar automáticamente el build command (`npm run build`) y la
   carpeta de publicación (`_site`) porque ya están en `netlify.toml`. Solo confirmá.
4. Al terminar el deploy vas a tener una URL tipo `https://algo-random.netlify.app`.
   Podés cambiar el subdominio en Site settings → Domain management → Options →
   Edit site name (por ejemplo `mirecetario.netlify.app`).

## 3. Conectar el panel de administración con GitHub

El panel (`/admin`) es **Sveltia CMS**, el sucesor moderno de Netlify CMS/Decap CMS
(Netlify Identity, el sistema viejo de login, está discontinuado). Para un uso
personal como este, la forma más simple es loguearse con un token, sin crear
ninguna app de OAuth.

1. Editá `admin/config.yml` y reemplazá la línea:
   ```yaml
   repo: TU-USUARIO/recetario
   ```
   por tu usuario real de GitHub y el nombre del repo, por ejemplo `javi123/recetario`.
   Subí ese cambio al repo (Netlify va a redeployar solo).
2. Generá un token en GitHub: Settings (de tu cuenta) → Developer settings →
   Personal access tokens → Fine-grained tokens → "Generate new token".
   - Repository access: solo el repo `recetario`.
   - Permissions: "Contents" en Read and write.
   - Copiá el token generado (no lo vas a volver a ver).
3. Entrá a `https://tu-sitio.netlify.app/admin`, click en "Sign in with token" y
   pegalo ahí. Listo, ya podés cargar y editar recetas desde el navegador,
   incluso desde el celular.

## 4. Cargar recetas

Desde `/admin` vas a ver la colección "Recetas" con un formulario: título,
descripción, tags (una por línea), tiempo, porciones, foto, ingredientes y
pasos. Cada receta que guardás genera un archivo `.md` en `src/recipes/` y
Netlify redeploya el sitio automáticamente (tarda ~1 minuto).

También podés pegarme el texto de una receta a mí en el chat y yo te genero
el archivo `.md` directamente si preferís no cargarlo a mano.

## 5. Desarrollo local (opcional)

```bash
npm install
npm run serve   # http://localhost:8080
```

## Estructura

- `src/recipes/*.md` — una receta por archivo (esto es lo que edita el CMS).
- `src/_includes/layouts/` — plantillas (home y receta individual).
- `src/css/style.css` — estilos.
- `admin/` — panel de administración (Sveltia CMS).
- `static/assets/uploads/` — donde se guardan las fotos que subís desde el admin.
