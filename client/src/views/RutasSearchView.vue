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
          <p><strong>Vehículo:</strong> {{ ruta.vehiculo.marca }} {{ ruta.vehiculo.modelo }} ({{ ruta.vehiculo.placa }})
          </p>
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
.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-filters input,
.search-filters select {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  flex: 1 1 200px;
  transition: border-color 0.3s;
}

.search-filters input:focus,
.search-filters select:focus {
  border-color: #007bff;
  outline: none;
}

.search-filters button {
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.search-filters button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.ruta-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ruta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ruta-card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.ruta-card .header h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}

.ruta-card .header .fecha {
  font-size: 0.9rem;
  color: #666;
}

.ruta-card .info p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
}

.ruta-card .info p strong {
  color: #333;
}
</style>