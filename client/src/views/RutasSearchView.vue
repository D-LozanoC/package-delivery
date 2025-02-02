<template>
    <div class="container">
        <h1>Buscar Rutas</h1>

        <div class="search-filters">
            <input v-model="filters.fecha" type="date">

            <select v-model="filters.conductorId">
                <option value="">Todos los conductores</option>
                <option v-for="c in conductores" :value="c.id">{{ c.nombres }} {{ c.apellidos }}</option>
            </select>

            <select v-model="filters.vehiculoPlaca">
                <option value="">Todos los vehículos</option>
                <option v-for="v in vehiculos" :value="v.placa">{{ v.placa }} - {{ v.marca }}</option>
            </select>

            <button @click="search">Buscar</button>
        </div>

        <div class="results">
            <div v-for="ruta in rutas" :key="ruta.id" class="ruta-card" @click="viewDetails(ruta.id)">
                <div class="header">
                    <h3>Ruta #{{ ruta.id }}</h3>
                    <span class="fecha">{{ formatFecha(ruta.fecha) }}</span>
                </div>

                <div class="info">
                    <p><strong>Conductor:</strong> {{ ruta.conductor.nombres }} {{ ruta.conductor.apellidos }}</p>
                    <p><strong>Vehículo:</strong> {{ ruta.vehiculo.marca }} {{ ruta.vehiculo.modelo }} ({{
                        ruta.vehiculo.placa }})</p>
                    <p><strong>Puntos de entrega:</strong> {{ ruta.detalles.length }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { conductor, Ruta, vehiculo } from '../types';

const router = useRouter();

const filters = ref({
    fecha: '',
    conductorId: '',
    vehiculoPlaca: ''
});

const conductores = ref<conductor[]>([]);
const vehiculos = ref<vehiculo[]>([]);
const rutas = ref<Ruta[]>([]);

// Cargar datos iniciales
onMounted(async () => {
    const [conductoresRes, vehiculosRes] = await Promise.all([
        axios.get('http://localhost:3000/conductores'),
        axios.get('http://localhost:3000/vehiculos')
    ]);

    conductores.value = conductoresRes.data;
    vehiculos.value = vehiculosRes.data;
});

const search = async () => {
    try {
        const response = await axios.get('http://localhost:3000/rutas/search', {
            params: filters.value
        });

        rutas.value = response.data;
    } catch (error) {
        alert('Error en la búsqueda');
    }
};

const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const viewDetails = (rutaId: number) => {
    router.push(`/rutas/${rutaId}`);
};
</script>

<style scoped>
.search-filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
}

.ruta-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: box-shadow 0.3s;
}

.ruta-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.fecha {
    color: #666;
    font-size: 0.9em;
}

.info p {
    margin: 5px 0;
}
</style>