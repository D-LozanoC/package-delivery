<template>
    <div class="container">
        <h1>Documentación Técnica - Sistema de Gestión de Entregas</h1>

        <section class="service-card">
            <h2>🔧 API Backend (Node.js/Express)</h2>
            <p><strong>URL Base:</strong> <code>http://localhost:3000</code></p>
            <p><strong>Puerto:</strong> 3000</p>

            <h3>Endpoints Principales</h3>
            <table>
                <thead>
                    <tr>
                        <th>Método</th>
                        <th>Endpoint</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="endpoint in backendEndpoints" :key="endpoint.endpoint">
                        <td>{{ endpoint.method }}</td>
                        <td><code>{{ endpoint.endpoint }}</code></td>
                        <td>{{ endpoint.description }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="service-card">
            <h2>🎨 Aplicación Web (Vue.js/Vite)</h2>
            <p><strong>URL:</strong> <code>http://localhost:5173</code></p>
            <p><strong>Puerto:</strong> 5173</p>

            <h3>Rutas Principales</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ruta</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="route in frontendRoutes" :key="route.path">
                        <td><code>{{ route.path }}</code></td>
                        <td>{{ route.description }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="service-card">
            <h2>🌍 Servicios Externos</h2>
            <h3>Open Source Routing Machine (OSRM)</h3>
            <p><strong>URL:</strong> <code>https://router.project-osrm.org</code></p>
            <ul>
                <li v-for="service in externalServices" :key="service.path">
                    <code>{{ service.path }}</code> - {{ service.description }}
                </li>
            </ul>
        </section>

        <div class="diagram-placeholder">
            <img src="../public/image.png" alt="Diagrama">
            <p>Ejemplo de espacio para diagrama de componentes</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            backendEndpoints: [
                { method: 'POST', endpoint: '/vehiculos', description: 'Registrar nuevo vehículo' },
                { method: 'GET', endpoint: '/vehiculos', description: 'Listar todos los vehículos' },
                { method: 'POST', endpoint: '/conductores', description: 'Registrar nuevo conductor' },
                { method: 'POST', endpoint: '/rutas', description: 'Crear nueva ruta de entrega' },
                { method: 'GET', endpoint: '/rutas/search', description: 'Búsqueda de rutas con filtros' }
            ],
            frontendRoutes: [
                { path: '/rutas/crear', description: 'Creación de rutas con mapa interactivo' },
                { path: '/rutas', description: 'Búsqueda y listado de rutas' },
                { path: '/rutas/{id}', description: 'Detalle de ruta con visualización de mapa' },
                { path: '/informes', description: 'Generación de reportes estadísticos' }
            ],
            externalServices: [
                { path: '/route/v1/driving/', description: 'Cálculo de rutas' },
                { path: '/trip/v1/driving/', description: 'Optimización de entregas' },
                { path: '/reverse', description: 'Geocodificación inversa' }
            ]
        };
    }
};
</script>

<style scoped>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

.service-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

th,
td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
}

th {
    background-color: #3498db;
    color: white;
}

tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.diagram-placeholder {
    background: #e9ecef;
    border: 2px dashed #6c757d;
    padding: 20px;
    text-align: center;
    margin: 30px 0;
    border-radius: 8px;
}
</style>