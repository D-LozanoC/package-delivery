# Documentación de Servicios

## Aplicación: Delivery System API (Back-end)
- **Tipo**: Back-end (Node.js/Express)
- **Puerto**: 3000
- **URL Base**: `http://localhost:3000`
- **Descripción**: API principal para gestión de vehículos, conductores y rutas

### Endpoints principales:

| Método | Endpoint                  | Descripción                                      |
|--------|---------------------------|--------------------------------------------------|
| POST   | /vehiculos                | Registrar nuevo vehículo                         |
| GET    | /vehiculos                | Listar todos los vehículos                       |
| POST   | /conductores              | Registrar nuevo conductor                        |
| GET    | /conductores              | Listar todos los conductores                     |
| POST   | /rutas                    | Crear nueva ruta de entrega                      |
| GET    | /rutas/search             | Buscar rutas por fecha, conductor o vehículo     |
| POST   | /rutas/{id}/detalles      | Agregar puntos de entrega a una ruta             |
| GET    | /rutas/{id}      | Obtener detalles de una ruta específica          |

## Aplicación: Delivery System Web (Front-end)
- **Tipo**: Front-end (Vue.js/Vite)
- **Puerto**: 5173
- **URL Acceso**: `http://localhost:5173`
- **Descripción**: Interfaz web para gestión y visualización de rutas

### Rutas principales:

| Ruta                  | Descripción                                      |
|-----------------------|--------------------------------------------------|
| /vehiculos            | Formulario de registro y listado de vehículos   |
| /conductores          | Formulario de registro y listado de conductores |
| /rutas/crear          | Creación de nuevas rutas con mapa interactivo   |
| /rutas                | Búsqueda y listado de rutas existentes          |
| /rutas/{id}           | Detalle de ruta con mapa y trazado completo     |
| /docs             | Visualización de los diagramas de despliegue y componentes |

## Servicio de Mapas (Integración)
- **Tipo**: Servicio Externo
- **URL Acceso**: `https://nominatim.openstreetmap.org`
- **Descripción**: Servicio de cálculo de rutas optimizadas y geocodificación
- **Métodos utilizados**:
  - `/route/v1/driving/` - Cálculo de rutas entre puntos
  - `/trip/v1/driving/` - Optimización de orden de entrega
  - `/reverse` - Geocodificación inversa de coordenadas

## Base de Datos
- **Tipo**: PostgreSQL
- **Puerto**: ep-silent-shape-a8c57os4-pooler.eastus2.azure.neon.tech
- **Esquema**: delivery_db
- **Tablas principales**:
  - vehiculos (Almacena información de vehículos)
  - conductores (Registro de conductores)
  - rutas (Rutas programadas)
  - detalle_ruta (Puntos de entrega específicos)

## Diagrama de Acceso