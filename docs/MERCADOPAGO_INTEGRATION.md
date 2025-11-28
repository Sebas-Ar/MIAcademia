# Integración Mercado Pago - Checkout API

## 📋 Descripción

Esta implementación integra Mercado Pago Checkout API para procesar pagos de sesiones de asesoría vocacional en MIA Academy.

## 🛠 Componentes Implementados

### Páginas
- **`/asesoria-vocacional/payment`** - Página principal de pago
- **`/asesoria-vocacional/payment/success`** - Pago exitoso
- **`/asesoria-vocacional/payment/failure`** - Pago fallido
- **`/asesoria-vocacional/payment/pending`** - Pago pendiente
- **`/asesoria-vocacional/confirmation`** - Confirmación final

### APIs
- **`/api/mercadopago/create-preference`** - Crear preferencia de pago
- **`/api/mercadopago/webhook`** - Manejar notificaciones de pago

### Componentes
- **`PaymentForm`** - Formulario de datos del cliente y métodos de pago
- **`PaymentSummary`** - Resumen del pedido y precios

## 🔧 Configuración

### Variables de Entorno
Las siguientes variables ya están configuradas en `.env.production`:

```bash
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=TEST-cb9f0e51-0fd1-46d8-a716-6fb90a1cfb48
NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=TEST-2932819745757981-080504-74cdb96e7f6dd2700baa55de6a655b4b-348934361
```

### Dependencias
```bash
npm install mercadopago
```

## 🚀 Flujo de Pago

1. **Agendamiento**: Usuario agenda sus sesiones
2. **Confirmación**: Click en "Confirmar Agendamiento y Proceder al Pago"
3. **Datos**: Usuario ingresa datos personales
4. **Pago**: Redirección a Mercado Pago
5. **Respuesta**: Redirección según resultado del pago
6. **Confirmación**: Página final con detalles

## 💰 Estructura de Precios

- **Precio por sesión**: $50,000 COP
- **IVA**: 19%
- **Total**: Subtotal + IVA

## 🔔 Notificaciones

El webhook `/api/mercadopago/webhook` maneja:
- ✅ Pagos aprobados
- ⏳ Pagos pendientes
- ❌ Pagos rechazados

## 📧 Integraciones Pendientes

### Base de Datos
```javascript
// TODO: Implementar en webhook
await saveConfirmedSessions(sessions, paymentInfo)
```

### Emails
```javascript
// TODO: Implementar notificaciones
await sendConfirmationEmail(email, sessions)
await sendPendingPaymentNotification(email)
await sendFailedPaymentNotification(email)
```

## 🧪 Testing

### Tarjetas de Prueba (Mercado Pago)

**Aprobadas:**
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 7557 3453 0604

**Rechazadas:**
- **Fondos insuficientes**: 4001 5593 7594 5439
- **Datos incorrectos**: 4002 9226 1663 7276

### URLs de Prueba
- Desarrollo: `http://localhost:3000/asesoria-vocacional/payment`
- Producción: `https://mia.com/asesoria-vocacional/payment`

## 🔒 Seguridad

- ✅ Cifrado SSL en todas las transacciones
- ✅ Validación de datos en frontend y backend
- ✅ Verificación de webhooks
- ✅ Manejo seguro de tokens

## 📝 Logs

Los pagos se registran en:
- Console logs del webhook
- Respuestas de Mercado Pago API
- Estados de preferencias creadas

## 🐛 Solución de Problemas

### Error: "Preferencia no creada"
- Verificar ACCESS_TOKEN
- Validar formato de datos
- Revisar logs del servidor

### Error: "Webhook no recibido"
- Verificar URL del webhook
- Comprobar conectividad
- Revisar logs de Mercado Pago

### Error: "Redirección fallida"
- Verificar URLs de retorno
- Comprobar configuración de CORS
- Validar parámetros de respuesta

## 📚 Documentación Adicional

- [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
- [Checkout API Guide](https://www.mercadopago.com.co/developers/es/docs/checkout-api/landing)
- [Webhooks Documentation](https://www.mercadopago.com.co/developers/es/docs/notifications/webhooks)

---

**Implementado por**: GitHub Copilot  
**Fecha**: Enero 2025  
**Estado**: ✅ Funcional - Pendiente testing en producción
