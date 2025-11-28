# Implementación de Paginación en Chat de MIA

## Resumen de Cambios

Se ha implementado un sistema de paginación para cargar programas en el chat de forma incremental, optimizando el uso de tokens de la IA y mejorando la experiencia del usuario.

## Archivos Creados

### 1. **Hook de Paginación** (`src/frontend/hooks/useChatPagination.js`)
Custom hook para manejar el estado y lógica de paginación:
- `loadMorePrograms(programsPerPage)`: Carga más programas
- `isLoadingMore`: Estado de carga
- `currentPage`: Página actual
- `hasMorePrograms`: Si hay más programas disponibles
- `resetPagination()`: Resetea el estado

### 2. **Endpoint de API** (`src/pages/api/mia/[chatID]/programs.js`)
Nuevo endpoint: `GET /api/mia/[chatID]/programs?page=2&limit=8`

Respuesta:
```json
{
  "programs": [...],
  "total": 30,
  "page": 2,
  "limit": 8,
  "hasMore": true,
  "totalPages": 4
}
```

## Archivos Modificados

### 3. **Base de Datos** (`src/backend/db/chat.db.js`)
Nueva función `getChatProgramsDB({ chatID, page, limit })`:
- Obtiene programas paginados de un chat específico
- Retorna slice de programas según página solicitada

### 4. **Controlador de Chat** (`src/backend/controllers/chat.controller.js`)
Modificado `startChat`:
- **Guarda TODOS los programas** (hasta 30) en `chatActive.programsList`
- **Envía solo 8 programas** a la IA para generar respuesta
- Los 22 restantes quedan disponibles para paginación

```javascript
// Limitar a 8 programas para la respuesta de la IA
// pero guardar todos los programas (hasta 30) en chatActive.programsList
let dataForIA = data
if (data) {
    const allPrograms = JSON.parse(data)
    if (allPrograms?.rows && allPrograms.rows.length > 8) {
        const limitedPrograms = {
            ...allPrograms,
            rows: allPrograms.rows.slice(0, 8)
        }
        dataForIA = JSON.stringify(limitedPrograms)
    }
}
```

### 5. **Componente ChatActionsBar** (`src/frontend/components/chat/ChatActionsBar/ChatActionsBar.jsx`)
Añadida lógica para:
- Importar y usar `useChatPagination` hook
- Detectar botón `.load-more-programs-btn` en el DOM
- Manejar click del botón
- Cargar más programas vía API
- Renderizar nuevos programas en el DOM
- Aplicar mismos event handlers (favoritos, navegación, etc.)

Lógica principal:
```javascript
const loadMoreButton = document.querySelector('.load-more-programs-btn')
if (loadMoreButton && !loadMoreButton.isHandlerAttached && !isResponding) {
    loadMoreButton.onclick = async () => {
        const result = await loadMorePrograms(8)
        // Renderizar nuevos programas
        // Ocultar botón si no hay más
    }
}
```

## Cambio Requerido en el Prompt de la IA

**IMPORTANTE**: Debes modificar el prompt de `responseGenerator` para que añada el botón al final de la lista de programas.

### Prompt Actual (últimas líneas)
```
...
</ul>
```

### Nuevo Prompt (añadir al final)
```html
...
</ul>
<li class="load-more-btn-wrapper" style="list-style: none; text-align: center; margin-top: 1.5em;">
    <button class="load-more-programs-btn" style="background: var(--yellow); color: var(--dark-blue); padding: 0.8em 2em; border: none; border-radius: 0.5em; font-weight: 600; cursor: pointer; transition: transform 0.2s; font-size: 1em;">
        Ver más programas
    </button>
</li>
</ul>
```

**IMPORTANTE**: El botón debe estar DENTRO del `<ul class="program-list">`, como un `<li>` más. Esto es crucial para que el JavaScript pueda insertar los nuevos programas correctamente.

**Nota**: La IA debe añadir este botón SOLO cuando:
1. Hay programas para mostrar (no en errores o respuestas sin programas)
2. Al finalizar la lista de programas

## Flujo Completo

### Primera Consulta del Usuario:
1. Usuario pregunta: "¿Qué programas de contaduría están en Barranquilla?"
2. IA SQL genera query con `LIMIT 30`
3. Backend obtiene 30 programas
4. Backend guarda los 30 en MongoDB (`chatActive.programsList`)
5. Backend envía solo 8 a la IA Response
6. IA Response genera HTML con 8 programas + botón "Ver más programas"
7. Usuario ve 8 programas

### Clic en "Ver más programas":
1. Usuario hace clic en el botón
2. Frontend llama a `GET /api/mia/[chatID]/programs?page=2&limit=8`
3. Backend obtiene programas 9-16 del chat guardado
4. Frontend renderiza los 8 nuevos programas
5. Si hay más (17-24), mantiene el botón
6. Si no hay más, oculta el botón

### Ventajas:
✅ Ahorro de tokens (IA solo procesa 8 programas)
✅ Respuesta más rápida
✅ Todos los 30 programas accesibles
✅ No hay duplicados
✅ UX mejorada (carga progresiva)

## Estructura del HTML del Botón

La IA debe generar exactamente esta estructura:

```html
<ul class="program-list">
    <li class="program-wrapper">
        <!-- Programa 1 -->
    </li>
    <!-- ... más programas ... -->
    <li class="program-wrapper">
        <!-- Programa 8 -->
    </li>
    <!-- BOTÓN DENTRO DEL <ul>, NO FUERA -->
    <li class="load-more-btn-wrapper" style="list-style: none; text-align: center; margin-top: 1.5em;">
        <button class="load-more-programs-btn" style="background: var(--yellow); color: var(--dark-blue); padding: 0.8em 2em; border: none; border-radius: 0.5em; font-weight: 600; cursor: pointer; transition: transform 0.2s; font-size: 1em;">
            Ver más programas
        </button>
    </li>
</ul> <!-- Cierre del <ul> DESPUÉS del botón -->
```

**⚠️ CRÍTICO**: El `<li class="load-more-btn-wrapper">` debe estar DENTRO del `<ul class="program-list">`, no fuera. El JavaScript usa `programList.insertBefore(li, buttonWrapper)` que requiere que el buttonWrapper sea un hijo directo del programList.

**Clases CSS importantes:**
- `.program-list`: Contenedor principal (ya existe)
- `.load-more-programs-btn`: Botón de carga (detectado por JavaScript)
- `.load-more-btn-wrapper`: Wrapper del botón (para styling)

## Testing

Para probar la funcionalidad:

1. Hacer una consulta que devuelva más de 8 programas
2. Verificar que solo se muestran 8 inicialmente
3. Verificar que aparece el botón "Ver más programas"
4. Hacer clic en el botón
5. Verificar que se cargan 8 programas más
6. Repetir hasta que no haya más programas
7. Verificar que el botón desaparece cuando no hay más

## Consideraciones

- El botón solo aparece cuando `!isResponding` (respuesta completa)
- Los nuevos programas tienen los mismos event handlers que los iniciales
- Las imágenes de programas nuevos tienen manejo de errores
- Se añaden botones de favoritos automáticamente
- La paginación resetea en cada nueva consulta

## Variables CSS Utilizadas

```css
--yellow: Color principal de botones
--dark-blue: Color de texto
```

Asegúrate de que estas variables estén definidas en tu CSS global.
