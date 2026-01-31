# Análisis de Peticiones HTTP - Optimizaciones

## Problemas Identificados

### 1. **4 Fuentes de Google Fonts Separadas** ❌
- **Problema**: Cada fuente genera una petición HTTP separada
- **Impacto**: 4 peticiones → 1 petición (reducción del 75%)
- **Solución**: ✅ **COMPLETADA** - Fuentes combinadas en una sola petición

### 2. **12 Imágenes PNG Individuales** ❌
- **Problema**: `useTexture(ICON_URLS)` carga cada imagen por separado
- **Ubicación**: `src/components/3DScene/IconParticles.jsx`
- **Impacto**: 12 peticiones → Se puede optimizar con sprite sheet o precarga
- **Solución**: Implementar precarga o sprite sheet

### 3. **Modelos 3D Duplicados** ❌
- **Problema**: Los modelos se cargan dos veces (ver logs de consola)
- **Causa probable**: React StrictMode en desarrollo causa doble renderizado
- **Ubicación**: `src/context/AppProvider.jsx`
- **Impacto**: 4 modelos × 2 = 8 peticiones (deberían ser 4)
- **Solución**: Verificar StrictMode y evitar cargas duplicadas

### 4. **HDRIs Externos Duplicados** ⚠️
- **Problema**: Mismo archivo desde `raw.githack.com` y `raw.githubusercontent.com`
- **Causa**: Probablemente fallback de @react-three/drei Environment
- **Impacto**: 2 peticiones para el mismo recurso
- **Solución**: Usar un solo proveedor o descargar el HDRI localmente

### 5. **Muchos Archivos JS/TS Individuales** ℹ️
- **Problema**: Vite en desarrollo carga cada módulo por separado
- **Impacto**: ~80+ peticiones de módulos
- **Solución**: Esto es normal en desarrollo. En producción, Vite los combina automáticamente.

## Soluciones Implementadas

### ✅ 1. Fuentes de Google Fonts Combinadas
Las 4 fuentes ahora se cargan en una sola petición:
```html
<!-- Antes: 4 peticiones separadas -->
<!-- Ahora: 1 petición combinada -->
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:...&family=Bebas+Neue&family=Montserrat:...&family=Bai+Jamjuree:...&display=swap" rel="stylesheet" />
```

## Soluciones Pendientes

### 🔧 2. Optimizar Carga de Imágenes PNG
**Opción A: Precarga de Texturas**
```javascript
// En IconParticles.jsx, precargar todas las texturas antes de usarlas
useEffect(() => {
  const loader = new THREE.TextureLoader();
  ICON_URLS.forEach(url => {
    loader.load(url); // Precarga
  });
}, []);
```

**Opción B: Sprite Sheet (Recomendado para producción)**
- Combinar las 12 imágenes en un sprite sheet
- Reducir de 12 peticiones a 1 petición
- Mejor rendimiento de renderizado

### 🔧 3. Evitar Carga Duplicada de Modelos
**Solución**: Agregar flag para evitar cargas duplicadas en StrictMode
```javascript
// En AppProvider.jsx
const modelsLoadedRef = useRef(false);

useEffect(() => {
  if (modelsLoadedRef.current) return; // Evitar doble carga
  modelsLoadedRef.current = true;
  
  // ... código de carga de modelos
}, []);
```

### 🔧 4. Optimizar HDRIs
**Solución**: Descargar el HDRI localmente o usar un solo proveedor
```javascript
// En Scene.jsx, usar preset local o un solo proveedor
<Environment 
  files="/hdri/potsdamer_platz_1k.hdr" 
  background={false} 
  blur={0.25} 
/>
```

## Resumen de Reducción de Peticiones

| Categoría | Antes | Después | Reducción |
|-----------|--------|---------|-----------|
| Fuentes Google | 4 | 1 | -75% |
| Imágenes PNG | 12 | 12* | 0% (pendiente) |
| Modelos 3D | 8 | 4* | -50% (pendiente) |
| HDRIs | 2 | 1* | -50% (pendiente) |
| **Total estimado** | **~100+** | **~80-85** | **~15-20%** |

*Pendiente de implementar

## Notas Importantes

1. **Desarrollo vs Producción**: En desarrollo, Vite carga módulos individualmente. En producción, se combinan automáticamente.

2. **React StrictMode**: En desarrollo, React StrictMode causa doble renderizado. Esto es normal y no afecta producción.

3. **Caché del Navegador**: Después de la primera carga, muchas peticiones se sirven desde caché.

4. **Priorización**: Las optimizaciones más importantes son:
   - ✅ Fuentes (COMPLETADA)
   - 🔧 Modelos duplicados
   - 🔧 Imágenes PNG
   - 🔧 HDRIs










