# 🎓 MIAcademia

<div align="center">
  <img src="public/og-banner.jpg" alt="MIAcademia Banner" width="100%" />
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge)](https://zustand.surge.sh/)

  **Tu asistente experto para explorar los programas académicos de educación superior**
  
  [🌐 Sitio Web](https://miacademia.ai) • [📧 Contacto](mailto:contact@miacademia.ai) • [🐦 Twitter](https://twitter.com/MiAcademia_ai)
</div>

## 📋 Tabla de Contenidos

- [🎯 Acerca del Proyecto](#-acerca-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Tecnologías](#-tecnologías)
- [⚙️ Instalación](#️-instalación)
- [🔧 Configuración](#-configuración)
- [🏃 Uso](#-uso)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🤖 Integración con IA](#-integración-con-ia)
- [💳 Integración de Pagos](#-integración-de-pagos)
- [🗃️ Base de Datos](#️-base-de-datos)
- [🔒 Autenticación](#-autenticación)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)
- [👥 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🎯 Acerca del Proyecto

**MIAcademia** es una plataforma inteligente diseñada para ayudar a estudiantes de Colombia a descubrir y explorar programas académicos de educación superior que se alineen perfectamente con sus intereses, habilidades y objetivos profesionales.

### 🎯 Misión
Democratizar el acceso a la información educativa y proporcionar orientación vocacional personalizada mediante tecnología de vanguardia e inteligencia artificial.

### 🌟 Visión
Ser la plataforma líder en orientación vocacional digital en Colombia, conectando a miles de estudiantes con su futuro académico ideal.

## ✨ Características Principales

### 🤖 Asistente IA Conversacional
- **Chat inteligente** con IA para explorar programas académicos
- **Recomendaciones personalizadas** basadas en intereses y habilidades
- **Análisis de compatibilidad** con diferentes áreas de estudio
- **Sugerencias contextuales** durante la conversación

### 📊 Test Vocacional RIASEC
- **Test de Holland completo** para identificar tipos de personalidad vocacional
- **Análisis RIASEC** (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
- **Resultados detallados** con explicaciones personalizadas
- **Recomendaciones de programas** basadas en el perfil vocacional

### 🗺️ Exploración Geográfica
- **Mapa interactivo** con ubicaciones de instituciones educativas
- **Filtros por región** y proximidad geográfica
- **Información detallada** de cada institución
- **Integración con Mapbox** para visualización avanzada

### 📅 Sistema de Asesorías
- **Agendamiento de citas** para orientación personalizada
- **Modalidades disponibles**: Virtual, presencial y telefónica
- **Gestión inteligente de slots** con manejo de disponibilidad
- **Sistema de notificaciones** y recordatorios

### 💳 Planes y Pagos
- **Integración con MercadoPago** para procesamiento de pagos
- **Múltiples planes de suscripción** adaptados a diferentes necesidades
- **Gestión de facturación** automatizada
- **Dashboard de administración** para gestión de pagos

### 🏛️ Base de Datos Educativa Completa
- **+1,500 instituciones educativas** de Colombia
- **Miles de programas académicos** con descripciones detalladas
- **Información actualizada** de admisiones y requisitos
- **Logos y recursos visuales** de todas las instituciones

---

## ⚠️ Repositorio Complementario (Obligatorio)

> **IMPORTANTE:** Este proyecto requiere un repositorio adicional para su correcto funcionamiento.

### 📦 [MIAcademia-Data](https://github.com/Sebas-Ar/MIAcademia-data)

El repositorio **MIAcademia-Data** es el core de generación y análisis de datos de la plataforma. Contiene todos los scripts y utilidades necesarios para:

- 📊 **Procesamiento de datos del SNIES** - Extracción y transformación de información educativa oficial
- ✍️ **Generación de descripciones** - Creación automática de descripciones de programas con OpenAI
- 🗺️ **Geolocalización** - Obtención de coordenadas de instituciones con Google Maps API
- 🗄️ **Actualización de BD** - Scripts para poblar y mantener la base de datos en Turso
- 🖼️ **Gestión de recursos** - Carga de logos e imágenes a Firebase Storage
- 🌐 **SEO** - Generación de sitemaps XML

```bash
# Clonar el repositorio de datos
git clone https://github.com/Sebas-Ar/MIAcademia-data.git

# Seguir las instrucciones de instalación en su README
```

**Sin este repositorio, MIAcademia no tendrá acceso a los datos educativos necesarios para funcionar correctamente.**

---

## 🏗️ Arquitectura

### Frontend (React/Next.js)
```
src/frontend/
├── components/          # Componentes reutilizables
│   ├── admin/          # Panel de administración
│   ├── chat/           # Sistema de chat con IA
│   ├── maps/           # Mapas interactivos
│   ├── scheduling/     # Sistema de agendamiento
│   └── shared/         # Componentes compartidos
├── hooks/              # Custom hooks
│   ├── globalState/    # Estado global (Zustand)
│   └── utils/          # Hooks utilitarios
└── utils/              # Funciones utilitarias
```

### Backend (API Routes)
```
src/backend/
├── controllers/        # Controladores de lógica de negocio
├── clients/           # Clientes de base de datos
├── db/                # Modelos y esquemas
└── utils/             # Utilidades del backend
```

### Base de Datos (MongoDB)
- **Mongoose ODM** para modelado de datos
- **Esquemas optimizados** para consultas rápidas
- **Indexación estratégica** para búsquedas eficientes
- **Agregaciones complejas** para análisis de datos

## 🚀 Tecnologías

### Core Technologies
- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[React 18](https://reactjs.org/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático (configurado)
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first

### Estado y Datos
- **[Zustand](https://zustand.surge.sh/)** - Gestión de estado simple y potente
- **[MongoDB](https://mongodb.com/)** - Base de datos NoSQL
- **[Mongoose](https://mongoosejs.com/)** - ODM para MongoDB
- **[React Hook Form](https://react-hook-form.com/)** - Formularios performantes

### Autenticación y Seguridad
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticación completa
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hash de contraseñas
- **Middleware de seguridad** personalizado

### Integraciones Externas
- **[OpenAI API](https://openai.com/)** - GPT para conversaciones inteligentes
- **[Google Gemini](https://ai.google/)** - IA alternativa
- **[Anthropic Claude](https://anthropic.com/)** - Asistente IA adicional
- **[MercadoPago](https://mercadopago.com/)** - Procesamiento de pagos
- **[Mapbox](https://mapbox.com/)** - Mapas interactivos

### UI/UX y Multimedia
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones elegantes
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Renderizado de Markdown
- **[Motion Number](https://motion-number.vercel.app/)** - Animaciones numéricas

### Utilidades y Herramientas
- **[Moment.js](https://momentjs.com/)** - Manipulación de fechas
- **[Currency.js](https://currency.js.org/)** - Formateo de monedas
- **[React Share](https://www.npmjs.com/package/react-share)** - Compartir en redes sociales
- **[Color Thief](https://lokesh.github.io/color-thief/)** - Extracción de colores

### Desarrollo
- **[ESLint](https://eslint.org/)** - Linter de código
- **[Bun](https://bun.sh/)** - Runtime y package manager rápido
- **[PostCSS](https://postcss.org/)** - Procesamiento de CSS

## ⚙️ Instalación

### Prerrequisitos
- **Node.js** (v18 o superior)
- **Bun** (recomendado) o npm/yarn
- **MongoDB** (local o Atlas)
- **Git**

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mia.git
cd mia

# Instalar dependencias con Bun (recomendado)
bun install

# O con npm
npm install
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/miacademia
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/miacademia

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui

# APIs de IA
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# Configuración de desarrollo
NODE_ENV=development
```

### Configuración de Base de Datos

1. **MongoDB Local:**
```bash
# Instalar MongoDB
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# macOS: brew install mongodb-community
# Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

# Iniciar MongoDB
mongod
```

2. **MongoDB Atlas (Recomendado):**
   - Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
   - Crear un cluster gratuito
   - Obtener la cadena de conexión
   - Configurar acceso de red (IP whitelist)

### Datos Iniciales

```bash
# Poblar la base de datos con datos de ejemplo
bun run seed

# O ejecutar scripts específicos
node scripts/populate-institutions.js
node scripts/populate-programs.js
```

## 🏃 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
bun dev

# O con npm
npm run dev

# Servidor con túnel público (para testing en móviles)
bun run dev:tunnel
```

El servidor estará disponible en `http://localhost:3000`

### Producción

```bash
# Construir para producción
bun run build

# Iniciar servidor de producción
bun start
```

### Scripts Disponibles

```bash
# Desarrollo
bun dev                 # Servidor de desarrollo
bun dev:tunnel         # Desarrollo con túnel público

# Construcción
bun build              # Build de producción
bun start              # Servidor de producción

# Calidad de código
bun lint               # Ejecutar ESLint
bun lint:fix           # Arreglar errores de ESLint automáticamente

# Utilidades
bun seed               # Poblar base de datos
bun clean              # Limpiar cache y builds
```

## 📁 Estructura del Proyecto

```
mia/
├── 📁 public/                    # Archivos estáticos
│   ├── 🖼️ img/                  # Imágenes y recursos
│   ├── 🎯 icons/               # Iconografía
│   └── 📄 *.xml                # Sitemaps y robots.txt
│
├── 📁 src/                      # Código fuente principal
│   ├── 📁 app/                  # App Router de Next.js 14
│   │   ├── 📄 layout.jsx        # Layout principal
│   │   ├── 📄 page.jsx          # Página de inicio
│   │   ├── 📁 admin/            # Panel de administración
│   │   ├── 📁 login/            # Autenticación
│   │   ├── 📁 programas/        # Exploración de programas
│   │   ├── 📁 test-vocacional/  # Test RIASEC
│   │   └── 📁 planes/           # Planes y precios
│   │
│   ├── 📁 frontend/             # Componentes de React
│   │   ├── 📁 components/       # Componentes reutilizables
│   │   │   ├── 📁 admin/        # Administración
│   │   │   ├── 📁 chat/         # Sistema de chat IA
│   │   │   ├── 📁 maps/         # Mapas interactivos
│   │   │   ├── 📁 scheduling/   # Agendamiento de citas
│   │   │   ├── 📁 shared/       # Componentes compartidos
│   │   │   └── 📁 vocational/   # Test vocacional
│   │   │
│   │   ├── 📁 hooks/            # Custom hooks
│   │   │   ├── 📁 globalState/  # Estado global (Zustand)
│   │   │   └── 📄 *.js          # Hooks utilitarios
│   │   │
│   │   └── 📁 utils/            # Utilidades del frontend
│   │
│   ├── 📁 backend/              # Lógica del servidor
│   │   ├── 📁 controllers/      # Controladores de API
│   │   ├── 📁 clients/          # Clientes de BD
│   │   ├── 📁 db/               # Modelos y esquemas
│   │   └── 📁 utils/            # Utilidades del backend
│   │
│   ├── 📁 pages/                # API Routes
│   │   └── 📁 api/              # Endpoints de la API
│   │       ├── 📁 auth/         # Autenticación
│   │       ├── 📁 chat/         # Chat con IA
│   │       ├── 📁 programs/     # Programas académicos
│   │       ├── 📁 payments/     # Procesamiento de pagos
│   │       └── 📁 schedules/    # Gestión de agendas
│   │
│   ├── 📁 auth/                 # Configuración de NextAuth
│   ├── 📁 config/               # Configuraciones globales
│   └── 📁 utils/                # Utilidades generales
│
├── 📁 scripts/                  # Scripts de utilidades
├── 📁 mia-config/              # Configuraciones externas
│   ├── 📁 packages/            # Paquetes de datos
│   └── 📄 codigos.json         # Códigos y configuraciones
│
├── 📄 package.json             # Dependencias y scripts
├── 📄 next.config.mjs          # Configuración de Next.js
├── 📄 tailwind.config.js       # Configuración de Tailwind
├── 📄 .eslintrc.js            # Configuración de ESLint
└── 📄 README.md               # Este archivo
```

## 🤖 Integración con IA

### Modelos Soportados

```javascript
// Configuración de proveedores de IA
const AI_PROVIDERS = {
  openai: {
    model: 'gpt-4-turbo-preview',
    apiKey: process.env.OPENAI_API_KEY
  },
  google: {
    model: 'gemini-1.5-pro',
    apiKey: process.env.GOOGLE_API_KEY
  },
  anthropic: {
    model: 'claude-3-opus',
    apiKey: process.env.ANTHROPIC_API_KEY
  }
}
```

### Funcionalidades de IA

- **Chat Conversacional**: Respuestas contextuales sobre programas académicos
- **Análisis de Perfil**: Evaluación de compatibilidad vocacional
- **Recomendaciones Inteligentes**: Sugerencias basadas en historial (en desarrollo)
- **Generación de Contenido**: Descripciones automáticas de programas

## 💳 Integración de Pagos

### MercadoPago

```javascript
// Configuración de MercadoPago
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc123'
  }
})
```

### Planes Disponibles

- **Plan Básico**: Acceso limitado al chat y test vocacional
- **Plan Premium**: Acceso completo + asesorías personalizadas
- **Plan Institucional**: Para colegios e instituciones educativas

## 🗃️ Base de Datos

### Esquemas Principales

```javascript
// Usuario
const UserSchema = {
  name: String,
  email: String,
  password: String,
  profile: {
    riasecScores: Object,
    preferences: Array,
    completedTests: Array
  },
  subscription: {
    plan: String,
    status: String,
    expiresAt: Date
  },
  scheduledSessions: {
    planName: String,
    planRoute: String,
    sessions: [AgendaSlotSchema],
    globalTimeout: Date,
    status: String
  }
}

// Programa Académico
const ProgramSchema = {
  name: String,
  institution: ObjectId,
  level: String, // pregrado, postgrado, tecnico
  modality: String, // presencial, virtual, mixto
  duration: Number,
  credits: Number,
  description: String,
  admissionRequirements: Array,
  tuition: {
    amount: Number,
    currency: String,
    period: String
  }
}

// Institución Educativa
const InstitutionSchema = {
  name: String,
  type: String,
  location: {
    city: String,
    state: String,
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    website: String,
    phone: String,
    email: String
  },
  programs: [ObjectId],
  accreditation: Array
}
```

### Optimizaciones

- **Índices Compuestos** para búsquedas rápidas
- **Agregaciones MongoDB** para estadísticas
- **Caching** con Redis (en desarrollo)
- **Paginación Eficiente** para grandes datasets

## 🔒 Autenticación

### NextAuth.js Configuration

```javascript
// Proveedores soportados
const authOptions = {
  providers: [
    CredentialsProvider({
      // Autenticación con email/password
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // Más proveedores en desarrollo
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  
  callbacks: {
    jwt: async ({ token, user }) => {
      // Lógica de JWT personalizada
    },
    session: async ({ session, token }) => {
      // Lógica de sesión personalizada
    }
  }
}
```

## 👥 Contribución

### Guía de Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Estándares de Código

- **ESLint** configurado con reglas estrictas
- **Prettier** para formateo consistente
- **Convenciones de naming** claras
- **Comentarios JSDoc** para funciones complejas

### Issues y Feature Requests

- Usar las plantillas de issues
- Incluir información detallada
- Screenshots para bugs de UI
- Casos de uso para nuevas features

## 📄 Licencia

Este proyecto está bajo la Licencia Mozilla Public License Version 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <h3>🌟 Desarrollado con ❤️ para democratizar la educación superior en Colombia</h3>
  
  **[MIAcademia](https://miacademia.ai)** - Tu futuro académico comienza aquí
  
  📧 [contact@miacademia.ai](mailto:contact@miacademia.ai) | 🐦 [@MiAcademia_ai](https://twitter.com/MiAcademia_ai)
</div>
