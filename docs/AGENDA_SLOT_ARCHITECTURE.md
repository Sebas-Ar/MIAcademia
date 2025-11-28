# 🏗️ Arquitectura de Referencias: AgendaSlot como Fuente de Verdad

## 📋 Problema Identificado

Inicialmente, el endpoint de confirmación estaba duplicando información entre `User.scheduledSessions` y `AgendaSlot`, causando:

- **Duplicación de datos** innecesaria
- **Inconsistencias** entre las dos fuentes
- **Complejidad** en el mantenimiento
- **Posibles conflictos** de estado

## ✅ Solución: Referencias con Fuente de Verdad Única

### 🎯 **AgendaSlot = Fuente de Verdad**

```javascript
// Estructura del User (solo referencias)
const UserSchema = {
  scheduledSessions: {
    planName: String,        // Metadata del plan
    planRoute: String,       // Metadata del plan  
    globalTimeout: Date,     // Timeout global
    status: String,          // Estado general
    sessions: [{             // ⚠️ SOLO REFERENCIAS
      type: Schema.Types.ObjectId,
      ref: 'AgendaSlot'     // ← Referencias a AgendaSlot
    }]
  }
}

// AgendaSlot contiene TODOS los datos de la sesión
const AgendaSlotSchema = {
  date: Date,
  modality: String,
  status: String,           // 'available', 'pre-booked', 'scheduled'
  pre_booked_by: ObjectId,  // Usuario que pre-reservó
  scheduled_by: ObjectId,   // Usuario que confirmó/pagó
  payment_info: Object,     // Información de pago
  // ... todos los demás campos
}
```

## 🔄 Flujo de Confirmación de Pago Actualizado

### 1. **Validación de Pertenencia**
```javascript
// Verificar que las sesiones pertenezcan al usuario
const user = await User.findById(userId).populate('scheduledSessions.sessions')
const userSessionIds = user.scheduledSessions.sessions.map(s => s._id.toString())
const invalidSessions = sessionIds.filter(id => !userSessionIds.includes(id))
```

### 2. **Actualización Directa en AgendaSlot**
```javascript
// ✅ NUEVA IMPLEMENTACIÓN: Actualizar solo AgendaSlot
const updateResult = await AgendaSlot.updateMany(
  {
    _id: { $in: sessionIds },
    pre_booked_by: userId,
    status: 'pre-booked'
  },
  {
    $set: {
      status: 'scheduled',           // Cambiar estado
      scheduled_by: userId,          // Asignar usuario
      scheduled_at: new Date(),      // Timestamp
      payment_info: {                // Info de pago
        ...paymentData,
        confirmed_at: new Date(),
        payment_status: 'completed'
      }
    },
    $unset: {
      pre_booked_by: 1,             // Limpiar pre-reserva
      pre_booked_at: 1,
      pre_booking_expires_at: 1
    }
  }
)
```

### 3. **Consulta Actualizada**
```javascript
// ✅ NUEVA IMPLEMENTACIÓN: Consultar desde AgendaSlot
const userSessions = await AgendaSlot.find({
  $or: [
    { pre_booked_by: userId, status: 'pre-booked' },
    { scheduled_by: userId, status: 'scheduled' }
  ]
}).sort({ date: 1 })
```

## 📊 Comparación de Enfoques

| Aspecto | Enfoque Anterior | Enfoque Actual |
|---------|------------------|----------------|
| **Fuente de Verdad** | ❌ Duplicada | ✅ Única (AgendaSlot) |
| **Consistencia** | ❌ Posibles conflictos | ✅ Siempre consistente |
| **Mantenimiento** | ❌ Dos lugares | ✅ Un solo lugar |
| **Performance** | ❌ Múltiples updates | ✅ Update atómico |
| **Escalabilidad** | ❌ Complejo | ✅ Escalable |

## 🛡️ Ventajas de la Nueva Arquitectura

### 🔒 **Integridad de Datos**
- **Una sola fuente**: AgendaSlot contiene toda la información
- **Consistencia garantizada**: No hay duplicación de estados
- **Transacciones atómicas**: Cambios de estado unificados

### ⚡ **Performance Optimizada**
- **Consultas directas**: No necesidad de populate complejos
- **Updates eficientes**: Un solo updateMany para confirmar
- **Índices optimizados**: Búsquedas rápidas por usuario

### 🎯 **Simplicidad de Código**
- **Lógica centralizada**: Toda la lógica en AgendaSlot
- **Validaciones unificadas**: Un solo lugar para validar
- **Menos código**: Eliminación de lógica duplicada

## 🔧 Implementación de Endpoints

### GET `/api/user-sessions`
```javascript
// Obtener sesiones directamente desde AgendaSlot
const userSessions = await AgendaSlot.find({
  $or: [
    { pre_booked_by: userId, status: 'pre-booked' },
    { scheduled_by: userId, status: 'scheduled' }
  ]
})
```

### POST `/api/user-sessions/confirm`
```javascript
// Confirmar sesiones actualizando solo AgendaSlot
await AgendaSlot.updateMany(
  { _id: { $in: sessionIds }, pre_booked_by: userId },
  { 
    $set: { status: 'scheduled', scheduled_by: userId, payment_info },
    $unset: { pre_booked_by: 1, pre_booking_expires_at: 1 }
  }
)
```

## 🎯 Beneficios para el Sistema de Pagos

### ✅ **Seguridad Mejorada**
- **Validación estricta**: Solo sesiones pre-reservadas se pueden confirmar
- **Pertenencia verificada**: Doble validación de ownership
- **Estados atómicos**: Transiciones de estado controladas

### 🔄 **Flujo Transaccional**
```
pre-booked → (pago exitoso) → scheduled
     ↓              ↓              ↓
pre_booked_by → payment_info → scheduled_by
```

### 📈 **Escalabilidad**
- **Búsquedas eficientes**: Índices en `pre_booked_by` y `scheduled_by`
- **Actualizaciones masivas**: updateMany para múltiples sesiones
- **Consultas optimizadas**: Filtros directos sin joins

## 🎪 Próximos Pasos Recomendados

1. **Índices de Performance**
   ```javascript
   // Crear índices para búsquedas optimizadas
   db.agendaslots.createIndex({ "pre_booked_by": 1, "status": 1 })
   db.agendaslots.createIndex({ "scheduled_by": 1, "status": 1 })
   ```

2. **Middleware de Validación**
   ```javascript
   // Middleware para validar transiciones de estado
   AgendaSlotSchema.pre('save', function(next) {
     // Validar transiciones permitidas
   })
   ```

3. **Eventos de Notificación**
   ```javascript
   // Emitir eventos cuando cambie el estado
   AgendaSlotSchema.post('findOneAndUpdate', function(doc) {
     EventEmitter.emit('session:confirmed', doc)
   })
   ```

4. **Cleanup Automático**
   ```javascript
   // Job para limpiar sesiones expiradas
   cron.schedule('0 * * * *', () => {
     AgendaSlot.updateMany(
       { pre_booking_expires_at: { $lt: new Date() } },
       { $unset: { pre_booked_by: 1, pre_booking_expires_at: 1 }, $set: { status: 'available' } }
     )
   })
   ```

## 🎯 Conclusión

Esta arquitectura proporciona:
- **🔒 Seguridad**: Una fuente de verdad no manipulable
- **⚡ Performance**: Consultas directas y eficientes  
- **🎯 Simplicidad**: Lógica centralizada y mantenible
- **📈 Escalabilidad**: Optimizada para crecimiento

La nueva implementación garantiza que **AgendaSlot sea la única fuente de verdad** para todos los datos de sesiones, eliminando duplicación y proporcionando una base sólida para el sistema de pagos.
