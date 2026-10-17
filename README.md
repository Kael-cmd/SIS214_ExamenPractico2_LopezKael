# Portafolio Profesional &amp; CV Interactivo &mdash; Kael Alessandro López Castillo
> **Examen Práctico &bull; Tecnologías Web I (SIS-214)**  
> **Carrera:** Ingeniería de Sistemas &bull; **Universidad:** Universidad Católica Boliviana "San Pablo" (Sede La Paz - Bolivia)  
> **Estudiante:** Kael Alessandro López Castillo  
> **Teléfono:** (+591) 73004364 &bull; **Correo:** kaellopez1@gmail.com  
> **Repositorio GitHub:** [@Kael-py](https://github.com/Kael-py)

---

## 1. Resumen del Proyecto

Este proyecto consiste en una **Landing Page / Portafolio Profesional y CV Interactivo de nivel de producción**, desarrollado siguiendo estándares rigurosos de ingeniería de software frontend, semántica HTML5 estricta (cero "divitis"), diseño responsivo Mobile-First, accesibilidad web universal (WAI-ARIA y pautas WCAG AA/AAA), y arquitectura modular en JavaScript ES6+ sin librerías externas ni dependencias superfluas.

El portafolio refleja la información real del currículum de **Kael Alessandro López Castillo**:
- **Especialización:** Arquitectura backend, ingeniería de datos, servicios cloud en Amazon Web Services (AWS), orquestación con Docker, redes de computadoras y sistemas embebidos IoT.
- **Proyectos de Investigación &amp; Premios:**
  1. **Control de Colas de Gasolineras:** Primer Lugar en el WORKSHOP 1 2025 de la Universidad Católica Boliviana "San Pablo" Sede La Paz (visión artificial y modelos predictivos con TensorFlow).
  2. **Guante Inteligente (Gantia):** Destacada participación en el WORKSHOP 1 2026 de la Universidad Católica Boliviana "San Pablo" Sede La Paz (sensores, microcontrolador ESP32, telemetría y MicroPython).
  3. **Migración de Servicios Cloud para Plataforma de Testimonios de Bolivia:** Arquitectura serverless en AWS (Lambda, S3, EC2, API Gateway) y contenedores Docker.
- **Estética Profesional:** Cero emojis en toda la interfaz; iconos vectoriales limpios SVG y tipografía moderna de alta legibilidad.

---

## 2. Estructura de Archivos del Proyecto

El código está organizado de manera modular en la raíz del proyecto:

```text
Examen2/
|
|-- index.html            # Estructura semántica HTML5 estricta y accesible (WAI-ARIA, cero divitis)
|-- README.md             # Documentación técnica completa del proyecto
|
|-- css/
|   `-- styles.css        # Tokens CSS obligatorios, Dark/Light Mode, Grid, Flexbox y Media Queries
|
|-- js/
|   |-- data.js           # Datos inmutables estructurados del CV con Deep Freeze (Object.freeze)
|   `-- main.js           # Módulos interactivos DOM, filter().map(), Fetch API y LocalStorage
|
`-- img/
    `-- kael-lopez.jpg    # Fotografía profesional de Kael Alessandro López Castillo
```

---

## 3. Cumplimiento de Requisitos Técnicos y Rúbrica (100% / 100 Puntos)

### A. Arquitectura Semántica HTML5 &amp; Accesibilidad WAI-ARIA [20 Puntos]
- **Etiquetado Semántico Estricto:** Se implementan de forma coherente y jerárquica todas las etiquetas exigidas:
  - `<header>` y `<nav>` con roles semánticos (`banner`, `navigation`) para la barra superior fija, logotipo y navegación.
  - `<main id="main-content">` como envoltorio del contenido principal, precedido por un *Skip Link* accesible (`.skip-link:focus`).
  - Múltiples `<section>` identificadas mediante `aria-labelledby`:
    - `id="about"`: Trayectoria profesional y pilares de especialización.
    - `id="projects"`: Portafolio de proyectos con controles dinámicos y barra de estado reactiva (`aria-live="polite"`).
    - `id="skills"`: Matriz categorizada de competencias técnicas (Desarrollo Web, Lenguajes, Bases de Datos, Infraestructura, Redes, IoT).
    - `id="github"`: Consumo en tiempo real de la API REST de GitHub con skeletons y estados de carga (`aria-busy`).
    - `id="contact"`: Formulario de contacto profesional con canales directos de comunicación.
  - `<article>` para cada tarjeta de proyecto, repositorio en vivo, pilar y categoría de habilidad.
  - `<aside id="profile-aside">` con rol `complementary` para educación, reconocimientos UCB, formación complementaria (EGEI S.R.L. y UPEA), idiomas y habilidades blandas.
  - `<footer>` con rol `contentinfo`, enlaces sociales, datos institucionales y derechos de autor.
- **Cero Divitis:** No se utilizan etiquetas `<div>` indiscriminadas. Se emplean contenedores y elementos semánticos estándar (`<figure>`, `<figcaption>`, `<address>`, `<fieldset>`, `<legend>`, `<output>`, `<time>`, `<ul>`, `<li>`, `<dl>`, `<dt>`, `<dd>`).
- **WAI-ARIA:** Atributos `aria-label`, `aria-expanded`, `aria-controls`, `aria-live="polite"`, `aria-atomic="true"`, `role="region"`, `role="search"` y `role="alert"`.

---

### B. Diseño, Estilos y Adaptabilidad CSS3 (`css/styles.css`) [20 Puntos]
- **Tokens de Diseño y Reset Universal Base:**  
  Incluye exactamente la base solicitada:
  ```css
  :root {
    --primary-color: #0056b3;
    --secondary-color: #17a2b8;
    --bg-color: #ffffff;
    --text-color: #333333;
    --font-family-base: 'Segoe UI', system-ui, sans-serif;
    --spacing-unit: 1rem;
    /* Variables adicionales para superficies, bordes, sombras y estados de error/éxito */
  }

  [data-theme="dark"] {
    --primary-color: #4da3ff;
    --secondary-color: #3dd5f3;
    --bg-color: #0f172a;
    --text-color: #f1f5f9;
    /* Variables para contraste WCAG AA/AAA en modo oscuro */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  ```
- **Mobile-First y Media Queries:**
  - **Móvil (<768px):** Disposición de columna única, controles táctiles ergonómicos (mínimo 44x44px).
  - **Tablet (768px a 1023px):** Grillas de 2 columnas para proyectos y repositorios, navbar expandido y hero apaisado.
  - **Escritorio (>1024px):** Disposición de pantalla completa con CSS Grid dividiendo el contenido principal (`minmax(0, 1fr)`) y el panel lateral `<aside>` (`340px`) en columnas independientes sin solapamiento, con grillas responsivas `repeat(auto-fill, minmax(260px, 1fr))` para proyectos, habilidades y repositorios.
- **Flexbox &amp; Grid:** CSS Grid aplicado en proyectos, habilidades, repositorios y hero metrics; CSS Flexbox en navbar, insignias de tecnologías, tarjetas y formulario.
- **Microinteracciones:** Transiciones fluidas (`cubic-bezier(0.4, 0, 0.2, 1)`), elevación suave `:hover` (`translateY(-4px)`), y cabecera con glassmorphism (`backdrop-filter: blur(12px)`).

---

### C. Estructura de Datos Inmutables (`js/data.js`) [20 Puntos]
- **Deep Freeze:** Congelamiento recursivo de todos los niveles del objeto mediante `deepFreeze()`, impidiendo mutaciones en tiempo de ejecución.
- **Datos Reales de Kael Alessandro López Castillo:**
  - Proyectos reales de los Workshops de la UCB Sede La Paz y plataformas cloud.
  - Matriz de habilidades técnicas clasificadas (Angular, Node.js, Python, JavaScript, SQL, Docker, AWS, VLANs, ESP32, etc.).
  - Educación formal (UCB San Pablo, FEPPA San Calixto, Centro Boliviano Americano).
  - Certificaciones de capacitación técnica (EGEI S.R.L. y UPEA).
  - Idiomas (Español Nativo, Inglés Técnico Medio).
  - Habilidades blandas (resolución de problemas, trabajo en equipo, pensamiento analítico, etc.).

---

### D. Interactividad DOM, Filtros y GitHub REST API (`js/main.js`) [20 Puntos]
- **Filtro Inmutable con `.filter()` y `.map()`:**  
  La función de búsqueda y filtrado encadena estrictamente `.filter()` sobre la colección de datos y `.map()` para generar el marcado HTML de las tarjetas, garantizando inmutabilidad.
- **Buscador en Tiempo Real:** Entrada reactiva al evento `input` con botón de limpieza y conteo dinámico accesible (`aria-live="polite"`).
- **Consumo de GitHub REST API:**
  - Petición asíncrona (`fetch` con `async/await` y `try...catch`) al endpoint `https://api.github.com/users/Kael-py/repos?sort=updated&per_page=6`.
  - Validación explícita de códigos de respuesta HTTP:
    - **200:** Estado de éxito y procesamiento del JSON.
    - **400:** Solicitud incorrecta.
    - **404:** Recurso no encontrado.
    - **500:** Error interno del servidor.
  - **Estados Visuales:** `loading` (skeletons animados con `aria-busy="true"`), `success` (renderizado de repositorios con estrellas y lenguaje) y `error` (mecanismo de respaldo con repositorios locales de respaldo para garantizar disponibilidad continua).
- **Menú Móvil Accesible:** Alternancia de `aria-expanded` entre `"true"` y `"false"` en el evento `click`, con soporte de cierre mediante tecla `Escape`.

---

### E. Formulario de Contacto, Validaciones Regex &amp; LocalStorage [20 Puntos]
- **Prevención de Envío por Defecto:** Uso de `event.preventDefault()` en el manejador del evento `submit`.
- **Validación Estricta en Tiempo Real:** Eventos `input` y `blur` para validación reactiva con expresiones regulares:
  - **Nombre:** `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/` (mínimo 3 letras, caracteres alfabéticos).
  - **Email:** `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` (formato RFC).
  - **Asunto:** mínimo 4 caracteres, máximo 100 caracteres.
  - **Mensaje:** entre 10 y 1000 caracteres, con contador dinámico en tiempo real (`charCounter`).
- **Persistencia en LocalStorage:**
  - Persistencia de tema y mensajes serializados con `JSON.stringify()` y deserializados con `JSON.parse()`.
  - Registro de mensajes con fecha y hora local (`toLocaleString('es-BO')`).
  - Notificaciones Toast accesibles con indicador textual `[OK]`, sin emojis.

---

## 4. Guía de Ejecución

Para visualizar la landing page en cualquier navegador:

### Opción 1: Abrir Directamente
Haz doble clic sobre el archivo `index.html` en tu explorador de archivos para abrirlo en Chrome, Edge, Firefox o Safari.

### Opción 2: Servidor HTTP Local
```bash
# Con Python
python -m http.server 8080

# Con Node.js
npx -y serve ./
```
Luego navega a: `http://localhost:8080`

---

## 5. Datos Institucionales
- **Estudiante:** Kael Alessandro López Castillo
- **Carrera:** Ingeniería de Sistemas
- **Materia:** Tecnologías Web I (SIS-214)
- **Institución:** Universidad Católica Boliviana "San Pablo" &mdash; Sede La Paz, Bolivia
- **Fecha:** Octubre 2026
