# Implementación Core Methods Web - Mercado Pago

## Descripción General

Se ha implementado la integración **Core Methods Web** de Mercado Pago que permite procesar pagos directamente en nuestro sitio web sin redireccionar al usuario a páginas externas. Esta implementación ofrece mayor control sobre la experiencia de usuario y el diseño del formulario de pago.

## Diferencias con Checkout API

### Checkout API (Implementación anterior)
- ✅ Redirección externa a Mercado Pago
- ✅ Experiencia de pago en el sitio de MP
- ✅ Más simple de implementar
- ❌ Menor control sobre la UI
- ❌ Usuario sale del sitio web

### Core Methods Web (Implementación actual)
- ✅ Experiencia de pago embebida en nuestro sitio
- ✅ Mayor control sobre el diseño
- ✅ Usuario nunca sale de nuestro sitio
- ✅ Captura directa de datos de tarjeta
- ⚠️ Más complejo de implementar
- ⚠️ Requiere mayor validación de seguridad

## Archivos Implementados

### APIs Backend

1. **`/pages/api/mercadopago/process-payment.js`**
   - Procesa pagos directamente con Core Methods
   - Recibe token de tarjeta y datos del pagador
   - Utiliza la clase `Payment` del SDK de Mercado Pago
   - Retorna estado del pago (approved, pending, rejected)

2. **`/pages/api/mercadopago/payment-methods.js`**
   - Obtiene métodos de pago disponibles
   - Filtra por tarjetas de crédito y débito
   - Utiliza la clase `PaymentMethod` del SDK

3. **`/pages/api/mercadopago/installments.js`**
   - Obtiene opciones de cuotas disponibles
   - Basado en método de pago y monto
   - Calcula tasas de interés

4. **`/pages/api/mercadopago/public-key.js`**
   - Retorna la clave pública para el SDK frontend
   - Seguro para exposición en el cliente

### Componente Frontend

5. **`/app/asesoria-vocacional/payment/components/CoreMethodsPaymentForm.jsx`**
   - Formulario de pago embebido
   - Integración con SDK de JavaScript de Mercado Pago
   - Validación en tiempo real
   - Manejo de estados de pago

## Flujo de Pago

### 1. Inicialización
```javascript
// Se carga el SDK de Mercado Pago
const mp = new window.MercadoPago(publicKey, {
    locale: 'es-CO'
})

// Se inicializa el formulario de tarjeta
const cardForm = mp.cardForm({
    amount: total.toString(),
    iframe: true,
    form: { /* configuración de campos */ },
    callbacks: { /* manejadores de eventos */ }
})
```

### 2. Captura de Datos
- **Datos del Cliente**: Nombre, apellido, email, teléfono, documento
- **Datos de la Tarjeta**: Número, fecha, CVV, titular
- **Configuración**: Banco emisor, cuotas

### 3. Tokenización
```javascript
const cardToken = await mercadoPago.fields.createCardToken({
    cardholderName: formData.cardholderName.value,
    identificationType: formData.identificationType.value,
    identificationNumber: formData.identificationNumber.value,
    cardholderEmail: formData.cardholderEmail.value
})
```

### 4. Procesamiento
```javascript
const paymentResponse = await fetch('/api/mercadopago/process-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        token: cardToken.id,
        paymentMethodId: formData.paymentMethodId?.value,
        transactionAmount: total,
        // ... otros datos
    })
})
```

### 5. Manejo de Respuestas
- **approved**: Pago exitoso → Redirigir a confirmación
- **pending**: Pago pendiente → Mostrar mensaje de espera
- **rejected**: Pago rechazado → Mostrar error específico
- **in_process**: En proceso → Actualizar estado

## Estados de Pago

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `approved` | Pago aprobado y procesado exitosamente | Confirmar sesiones y enviar emails |
| `pending` | Pago pendiente de aprobación (ej: transferencia) | Esperar confirmación del webhook |
| `in_process` | Pago en proceso de validación | Mostrar mensaje de espera |
| `rejected` | Pago rechazado por el banco o MP | Permitir reintento con otros datos |

## Seguridad

### Tokenización
- Los datos de la tarjeta nunca pasan por nuestro servidor
- Se crea un token seguro que representa la tarjeta
- El token se usa una sola vez para el pago

### Validación
- Validación en tiempo real de números de tarjeta
- Verificación de fechas de vencimiento
- Validación de códigos CVV

### PCI Compliance
- Mercado Pago maneja el cumplimiento PCI DSS
- Nuestro servidor no almacena datos sensibles
- Comunicación encriptada HTTPS

## Configuración de Entorno

```env
# Variables requeridas en .env.local
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxxx
MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxx
```

## Testing

### Tarjetas de Prueba (Colombia)

| Tarjeta | Número | CVV | Fecha |
|---------|--------|-----|-------|
| Visa | 4013 5406 8274 6260 | 123 | 11/25 |
| MasterCard | 5031 7557 3453 0604 | 123 | 11/25 |

### Emails de Prueba
- **Aprobado**: `test_user_approved@testuser.com`
- **Pendiente**: `test_user_pending@testuser.com`
- **Rechazado**: `test_user_rejected@testuser.com`

## Ventajas de la Implementación

1. **Experiencia de Usuario Mejorada**
   - Sin redirecciones externas
   - Flujo de pago más fluido
   - Diseño consistente con el sitio

2. **Mayor Control**
   - Personalización completa del formulario
   - Manejo directo de errores
   - Integración con el sistema de notificaciones

3. **Mejores Métricas**
   - Menor abandono de carritos
   - Seguimiento completo del funnel
   - Datos de conversión más precisos

## Próximos Pasos

1. **Producción**
   - Cambiar credentials de TEST a LIVE
   - Verificar URLs de webhooks
   - Configurar monitoreo

2. **Mejoras**
   - Implementar más métodos de pago (PSE, Efecty)
   - Agregar opción de guardar tarjetas
   - Optimizar UX mobile

3. **Integración**
   - Conectar con base de datos para guardar pagos
   - Implementar envío de emails automáticos
   - Configurar reportes de transacciones

## Soporte y Documentación

- [Core Methods Web - Mercado Pago](https://www.mercadopago.com.co/developers/es/docs/checkout-api/integration-configuration/card/integrate-via-core-methods)
- [SDK JavaScript](https://www.mercadopago.com.co/developers/es/docs/sdks-library/client-side/javascript)
- [API de Pagos](https://www.mercadopago.com.co/developers/es/reference/payments/_payments/post)
