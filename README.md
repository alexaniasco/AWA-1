# Apolo Web 3D

## Descripción
Apolo Web 3D es una aplicación web interactiva que utiliza Three.js y React Three Fiber para crear experiencias 3D inmersivas. El proyecto presenta modelos 3D interactivos con animaciones fluidas y efectos visuales.

## Características
- Modelos 3D interactivos con carga optimizada
- Sistema de carga progresiva con indicadores visuales
- Optimización de rendimiento mediante Level of Detail (LOD)
- Animaciones fluidas con funciones de easing
- Efectos visuales como partículas y estrellas
- Interfaz de usuario responsiva

## Tecnologías Utilizadas
- React.js
- Three.js
- React Three Fiber
- @react-three/drei

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd apolo-web-3d
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── 3DModels/         # Componentes de modelos 3D
│   ├── 3DScene/          # Escena principal y componentes relacionados
│   └── LoadingScreen/    # Pantalla de carga
├── context/              # Contexto de la aplicación y gestión de estado
└── assets/               # Recursos estáticos
```

## Optimizaciones Implementadas

### Carga Progresiva
Se ha implementado un sistema de carga progresiva que muestra el progreso de carga de los modelos 3D, mejorando la experiencia del usuario durante la inicialización de la aplicación.

### Level of Detail (LOD)
Se utiliza la técnica LOD para mostrar versiones simplificadas de los modelos cuando están lejos de la cámara, mejorando significativamente el rendimiento.

### Precarga de Modelos
Los modelos 3D se precargan al inicio de la aplicación para evitar interrupciones durante la navegación.

## Uso

La aplicación permite interactuar con diferentes modelos 3D. Puedes:

- Hacer clic en los modelos para obtener información
- Navegar por la escena usando el scroll
- Ver animaciones de los modelos al interactuar con ellos

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
