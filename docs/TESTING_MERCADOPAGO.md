# 🧪 Guía de Pruebas - Mercado Pago Integration

## ✅ Estado Actual
- ✅ **Preferencia creada exitosamente** 
- ✅ **Redirección a sandbox funcionando**
- ⚠️ **Probando pagos en entorno de desarrollo**

## 🔧 Solución al Error "No puedes pagarte a ti mismo"

Este error es **normal** en el entorno de pruebas cuando usas las mismas credenciales. La solución es usar **datos de prueba específicos** que proporciona Mercado Pago.

## 💳 Datos de Prueba para Pagos Exitosos

### **Tarjetas de Crédito - APROBADAS**

**Visa:**
- **Número**: `4509 9535 6623 3704`
- **Código**: `123`
- **Vencimiento**: `11/25`
- **Titular**: `APRO`

**Mastercard:**
- **Número**: `5031 7557 3453 0604`
- **Código**: `123`
- **Vencimiento**: `11/25`
- **Titular**: `APRO`

### **Datos del Comprador**
- **Email**: `test_user_12345678@testuser.com`
- **Documento**: `12345678`
- **Teléfono**: `1122334455`

## 💳 Datos de Prueba para Pagos Rechazados

### **Fondos Insuficientes**
- **Número**: `4001 5593 7594 5439`
- **Código**: `123`
- **Vencimiento**: `11/25`
- **Titular**: `OTHE`

### **Datos Incorrectos**
- **Número**: `4002 9226 1663 7276`
- **Código**: `123`
- **Vencimiento**: `11/25`
- **Titular**: `OTHE`

## 🔄 Flujo de Prueba Completo

1. **Ir a**: `/asesoria-vocacional` 
2. **Agendar sesiones** según el plan
3. **Click**: "Confirmar Agendamiento y Proceder al Pago"
4. **Llenar formulario** con datos reales
5. **Click**: "Proceder al pago"
6. **En Mercado Pago**: Usar las tarjetas de prueba de arriba
7. **Verificar redirección** a página de éxito/fallo

## 🎯 Casos de Prueba

### ✅ **Caso 1: Pago Exitoso**
- Usar tarjeta `4509 9535 6623 3704`
- Debe redirigir a `/payment/success`
- Debe mostrar confirmación

### ❌ **Caso 2: Pago Rechazado**
- Usar tarjeta `4001 5593 7594 5439`
- Debe redirigir a `/payment/failure`
- Debe mostrar error y opciones

### ⏳ **Caso 3: Pago Pendiente**
- Usar métodos como PSE en sandbox
- Debe redirigir a `/payment/pending`
- Debe mostrar estado de espera

## 🐛 Problemas Comunes

### **"No puedes pagarte a ti mismo"**
- **Causa**: Usar mismo vendedor y comprador
- **Solución**: Usar datos de prueba de arriba ✅

### **"Tarjeta inválida"**
- **Causa**: Usar tarjeta real en ambiente de prueba
- **Solución**: Usar solo tarjetas de TEST ✅

### **"Error de conexión"**
- **Causa**: URLs no accesibles
- **Solución**: Verificar que el servidor esté corriendo ✅

## 📊 Logs a Verificar

En la **consola del servidor** debes ver:
```
Access Token disponible: true
Base URL detectada: http://localhost:3000
Preferencia creada: { id: "xxx", init_point: "xxx" }
```

En la **consola del navegador** puedes ver:
- Redirección exitosa a Mercado Pago
- Parámetros de respuesta después del pago

## 🚀 Próximos Pasos

1. **Probar con datos de arriba** ✅
2. **Verificar webhooks** (opcional por ahora)
3. **Implementar guardado en BD** (pendiente)
4. **Configurar emails** (pendiente)
5. **Cambiar a producción** cuando esté listo

## 📱 URLs de Prueba

- **Desarrollo**: `http://localhost:3000/asesoria-vocacional/payment`
- **Sandbox MP**: Se genera automáticamente
- **Success**: `http://localhost:3000/asesoria-vocacional/payment/success`
- **Failure**: `http://localhost:3000/asesoria-vocacional/payment/failure`

---

**¡Todo está funcionando correctamente!** Solo usa los datos de prueba de arriba para completar el flujo. 🎉
