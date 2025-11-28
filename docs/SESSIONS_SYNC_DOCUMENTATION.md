# Sincronización de Sesiones con Base de Datos

## 📋 Descripción General

Este sistema sincroniza automáticamente las sesiones pre-agendadas entre el almacenamiento local (localStorage) y la base de datos MongoDB, proporcionando persistencia y sincronización entre dispositivos para usuarios autenticados.

## 🏗️ Arquitectura

### 1. **Base de Datos (MongoDB)**
```javascript
// UserSchema - Campo scheduledSessions
scheduledSessions: {
    planName: String,           // Nombre del plan seleccionado
    planRoute: String,          // Ruta del plan
    sessions: [ObjectId],       // Referencias a AgendaSlot
    globalTimeout: Date,        // Tiempo límite global
    status: Enum               // Estado: 'timeout', 'pre-scheduled', etc.
}
```

### 2. **API Endpoints**
- `GET /api/user-sessions?userId=id` - Cargar sesiones del usuario
- `POST /api/user-sessions` - Sincronizar datos locales con BD
- `POST /api/user-sessions/add` - Agregar sesión individual
- `POST /api/user-sessions/remove` - Remover sesión individual
- `DELETE /api/user-sessions` - Limpiar todas las sesiones

### 3. **Store (Zustand)**
- Mantiene compatibilidad con funcionalidad existente
- Agrega métodos de sincronización con BD
- Sincronización automática en operaciones CRUD

## 🔄 Flujo de Sincronización

### **Cuando el usuario se autentica:**
1. `useSessionSync` detecta autenticación
2. Llama a `loadSessionsFromDB(userId)`
3. Actualiza store local con datos de BD
4. Mantiene funcionalidad existente

### **Cuando se modifican sesiones:**
1. Operación se ejecuta localmente (inmediato)
2. Se sincroniza con BD en segundo plano
3. Si falla la sincronización, mantiene funcionamiento local

### **Operaciones sincronizadas:**
- ✅ `addSession()` - Agrega y sincroniza
- ✅ `deleteSession()` - Elimina y sincroniza  
- ✅ `clearAllSessions()` - Limpia y sincroniza
- ✅ `updateSession()` - Actualiza (existente)

## 📚 Uso en Componentes

### **1. Integrar hook de sincronización**
```javascript
import { useSessionSync } from '@/frontend/hooks/useSessionSync'

const MyComponent = () => {
    const { isAuthenticated, userEmail, isLoading } = useSessionSync()
    
    // El hook se encarga de la sincronización automática
    // No necesitas hacer nada más
}
```

### **2. Pasar userId a operaciones**
```javascript
const { addSession, deleteSession, clearAllSessions } = usePreScheduledSessionsStore()

// Usar userId en operaciones para sincronización
await addSession(sessionData, userId)
await deleteSession(sessionId, userId)
await clearAllSessions(userId)
```

### **3. Ejemplo completo en Sessions.jsx**
```javascript
const Sessions = ({ planData }) => {
    const { isAuthenticated, userId, userEmail } = useSessionSync()
    
    const { 
        sessions, 
        addSession, 
        deleteSession 
    } = usePreScheduledSessionsStore()

    const handleAddSession = async (sessionData) => {
        try {
            // Automáticamente sincroniza con BD si userId existe
            await addSession(sessionData, userId)
        } catch (error) {
            console.error('Error adding session:', error)
        }
    }

    return (
        <div>
            {isAuthenticated && (
                <div className="sync-indicator">
                    ✅ Sesiones sincronizadas
                </div>
            )}
            {/* Resto del componente */}
        </div>
    )
}
```

## 🛡️ Características de Seguridad

### **Manejo de Errores**
- Operaciones locales nunca fallan por errores de BD
- Sincronización se ejecuta en segundo plano
- Logs de errores para debugging

### **Autenticación**
- Solo usuarios autenticados pueden sincronizar
- Validación de email en todos los endpoints
- Referencias seguras a AgendaSlot

### **Optimistic Locking**
- Mantiene control de concurrencia existente
- Sincronización no interfiere con locking
- Consistencia entre local y BD

## 🔧 Configuración

### **1. Variables de entorno**
```env
MONGODB_URI=mongodb://...
AUTH_SECRET=your-secret
```

### **2. Importar en páginas principales**
```javascript
import { useSessionSync } from '@/frontend/hooks/useSessionSync'

export default function SchedulingPage() {
    useSessionSync() // Activa sincronización automática
    
    return <Sessions />
}
```

## 🚀 Beneficios

### **Para Usuarios**
- ✅ Sesiones persisten entre dispositivos
- ✅ No pierden datos al cambiar de navegador
- ✅ Experiencia fluida sin interrupciones
- ✅ Funciona offline (localStorage como fallback)

### **Para Desarrolladores**
- ✅ Compatibilidad total con código existente
- ✅ Sincronización transparente
- ✅ Manejo robusto de errores
- ✅ Fácil debugging y logs

## 📊 Migración de Datos Existentes

Para usuarios que ya tienen datos en localStorage:

1. **Primera autenticación**: `loadSessionsFromDB()` carga datos de BD
2. **Si BD está vacía**: `syncWithDB()` sube datos locales a BD
3. **Merge inteligente**: Combina datos sin duplicados
4. **Backup local**: localStorage se mantiene como fallback

## 🔍 Debugging

### **Logs importantes**
```javascript
// Cargar desde BD
console.log('Loading user sessions from DB...')

// Sincronizar cambios
console.log('Syncing local changes to DB...')

// Errores de sincronización
console.error('Error syncing changes to DB:', error)
```

### **Verificar estado**
```javascript
// En DevTools Console
usePreScheduledSessionsStore.getState().sessions
```

## 🎯 Próximos Pasos

1. **Implementar en componente Sessions.jsx**
2. **Agregar indicadores visuales de sincronización**
3. **Testing de sincronización**
4. **Optimización de performance**
5. **Métricas de uso de sincronización**
