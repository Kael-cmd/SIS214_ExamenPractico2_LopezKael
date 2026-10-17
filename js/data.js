// Kael Lopez Castillo Examen Parcial 2 TECWEB 1

// Congelamiento profundo recursivo para garantizar inmutabilidad estricta (Object.freeze)
function deepFreeze(obj) {
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === 'object' && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}

// Estructura de datos inmutable con informacion del CV y portafolio profesional
const RAW_PORTFOLIO_DATA = {
  profile: {
    fullName: "Kael Alessandro López Castillo",
    shortName: "Kael López",
    title: "Estudiante de Ingeniería de Sistemas",
    institution: "Universidad Católica Boliviana \"San Pablo\"",
    location: "La Paz, Bolivia",
    phone: "(+591) 73004364",
    email: "kaellopez1@gmail.com",
    githubUsername: "Kael-py",
    githubUrl: "https://github.com/Kael-py",
    linkedinUrl: "https://linkedin.com",
    avatar: "img/kael-lopez.jpg",
    statusBadge: "Disponible para Pasantías y Proyectos Profesionales",
    aboutShort: "Estudiante de Ingeniería de Sistemas con sólida formación en el desarrollo de software y una marcada inclinación hacia la arquitectura backend y la ingeniería de datos.",
    aboutBio: [
      "Estudiante de Ingeniería de Sistemas con sólida formación en el desarrollo de software y una marcada inclinación hacia la arquitectura backend y la ingeniería de datos.",
      "Cuenta con experiencia práctica en el diseño e implementación de APIs REST, servicios del lado del servidor utilizando Python y Node.js, y en la orquestación de entornos contenedorizados mediante Docker.",
      "Capacidad comprobada para resolver problemas complejos, trabajar en equipo multidisciplinario y aplicar buenas prácticas de ingeniería de software, redes de computadoras y sistemas embebidos."
    ]
  },

  metrics: [
    { label: "Workshop UCB", value: "1er Lugar", highlight: "Edición 2025" },
    { label: "Universidad", value: "UCB", highlight: "San Pablo - La Paz" },
    { label: "Carrera", value: "Sistemas", highlight: "SIS-214 Web I" },
    { label: "Idioma Inglés", value: "Técnico Medio", highlight: "CBA La Paz" }
  ],

  categories: [
    { id: "all", label: "Todos los Proyectos" },
    { id: "ia-datos", label: "IA y Datos" },
    { id: "iot", label: "Internet de las Cosas (IoT)" },
    { id: "cloud-web", label: "Cloud e Infraestructura" }
  ],

  projects: [
    {
      id: "control-colas-gasolineras",
      title: "Control de Colas de Gasolineras",
      category: "ia-datos",
      categoryLabel: "IA y Datos",
      description: "Desarrollo de aplicación y programación de modelos predictivos y visión artificial utilizando TensorFlow para la gestión y control de filas en estaciones de servicio.",
      highlights: [
        "Primer Lugar en el WORKSHOP 1 2025 en la Universidad Católica Boliviana \"San Pablo\" Sede La Paz",
        "Implementación de modelos de visión artificial y predicción con TensorFlow",
        "Arquitectura para monitoreo de flujo y estimación de tiempos de espera"
      ],
      technologies: ["Python", "TensorFlow", "Desarrollo de Apps"],
      githubUrl: "https://github.com/Kael-py",
      award: "Primer Lugar - WORKSHOP 1 2025 UCB",
      badge: "Premio WORKSHOP 1 2025",
      context: "Workshop 1 2025 • UCB La Paz"
    },
    {
      id: "guante-inteligente-gantia",
      title: "Guante Inteligente (Gantia)",
      category: "iot",
      categoryLabel: "Internet de las Cosas (IoT)",
      description: "Desarrollo de una interfaz gráfica interactiva, programación de sensores y procesamiento de telemetría en tiempo real utilizando microcontroladores ESP32 y MicroPython.",
      highlights: [
        "Destacada participación en el WORKSHOP 1 2026 en la Universidad Católica Boliviana \"San Pablo\" Sede La Paz",
        "Adquisición y procesamiento de señales sensoriales con ESP32",
        "Interfaz visual para visualización de telemetría en tiempo real"
      ],
      technologies: ["MicroPython", "ESP32", "Sensores", "Telemetría", "Interfaz Gráfica"],
      githubUrl: "https://github.com/Kael-py",
      award: "Participación Destacada - WORKSHOP 1 2026 UCB",
      badge: "Destacado WORKSHOP 1 2026",
      context: "Workshop 1 2026 • UCB La Paz"
    },
    {
      id: "migracion-cloud-testimonios",
      title: "Migración de Servicios Cloud para Plataforma de Testimonios de Bolivia",
      category: "cloud-web",
      categoryLabel: "Cloud e Infraestructura",
      description: "Arquitectura y migración de servicios hacia Amazon Web Services (AWS) para una plataforma web de testimonios en Bolivia, integrando almacenamiento escalable, cómputo y gestión de endpoints.",
      highlights: [
        "Despliegue y configuración de microservicios con AWS Lambda y API Gateway",
        "Almacenamiento escalable de recursos y archivos multimedia en Amazon S3",
        "Contenedorización de servicios backend con Docker y cómputo en Amazon EC2"
      ],
      technologies: ["AWS", "EC2", "S3", "API Gateway", "Lambda", "Docker"],
      githubUrl: "https://github.com/Kael-py/ExamenFinalCloudKaelLopez",
      award: "Arquitectura Cloud AWS",
      badge: "Cloud AWS & Docker",
      context: "Proyecto Cloud • UCB La Paz"
    }
  ],

  technicalSkills: [
    {
      category: "Desarrollo Web",
      items: ["Angular", "Node.js", "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript"]
    },
    {
      category: "Lenguajes de Programación",
      items: ["Python", "JavaScript"]
    },
    {
      category: "Bases de Datos",
      items: ["SQL", "Modelado Relacional"]
    },
    {
      category: "Infraestructura y Despliegue",
      items: ["Docker", "AWS (Lambda, S3, EC2, API Gateway)"]
    },
    {
      category: "Redes de Computadoras",
      items: ["Configuración de VLANs", "OSPF", "NAT", "EtherChannel"]
    },
    {
      category: "Internet de las Cosas (IoT)",
      items: ["Microcontroladores ESP32", "Sensores", "Telemetría", "MicroPython"]
    }
  ],

  education: [
    {
      institution: "Universidad Católica Boliviana \"San Pablo\"",
      title: "Ingeniería en Sistemas",
      period: "En curso (Sede La Paz)"
    },
    {
      institution: "FEPPA San Calixto",
      title: "Diploma de Bachiller en Humanidades",
      period: "Bachillerato Concluido"
    },
    {
      institution: "Centro Boliviano Americano (Fundación Cultural y Educativa La Paz)",
      title: "Título de Técnico Medio de Lengua Extranjera: Inglés",
      period: "Graduado"
    }
  ],

  recognitions: [
    {
      title: "Primer Lugar en el WORKSHOP 1 2025",
      entity: "Universidad Católica Boliviana \"San Pablo\" Sede La Paz",
      detail: "Proyecto: Control de colas de gasolineras (IA con TensorFlow y visión computacional)"
    },
    {
      title: "Destacada participación en el WORKSHOP 1 2026",
      entity: "Universidad Católica Boliviana \"San Pablo\" Sede La Paz",
      detail: "Proyecto: Guante Inteligente - Gantia (IoT con ESP32 y MicroPython)"
    }
  ],

  complementaryTraining: [
    {
      institution: "Centro de Capacitación Técnica Privado EGEI S.R.L.",
      course: "Redes de computadoras"
    },
    {
      institution: "Centro de Capacitación Técnica Privado EGEI S.R.L.",
      course: "Instalación de software"
    },
    {
      institution: "Centro de Capacitación Técnica Privado EGEI S.R.L.",
      course: "Ensamblaje y Mantenimiento de Computadoras"
    },
    {
      institution: "Centro de Capacitación Técnica Privado EGEI S.R.L.",
      course: "Antivirus y utilitarios"
    },
    {
      institution: "Centro de Capacitación Técnica Privado EGEI S.R.L.",
      course: "Hardware y software"
    },
    {
      institution: "Universidad Pública de El Alto (UPEA)",
      course: "Ensamblaje, instalación y mantenimiento de computadoras"
    }
  ],

  languages: [
    { language: "Español", level: "Nativo" },
    { language: "Inglés", level: "Técnico Medio (CBA La Paz)" }
  ],

  softSkills: [
    "Resolución de problemas",
    "Trabajo en equipo",
    "Aprendizaje continuo",
    "Pensamiento analítico",
    "Comunicación asertiva",
    "Gestión de proyectos",
    "Adaptabilidad y rápido aprendizaje"
  ]
};

// Exportacion del objeto de datos inmutable PORTFOLIO_DATA con deepFreeze
const PORTFOLIO_DATA = deepFreeze(RAW_PORTFOLIO_DATA);

if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
