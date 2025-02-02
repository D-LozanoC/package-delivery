<template>
  <div class="container">
    <h1>Detalles de Ruta #{{ ruta?.id }}</h1>

    <div v-if="ruta" class="ruta-info">
      <p><strong>Fecha:</strong> {{ formatFecha(ruta?.fecha ?? '') }}</p>
      <p><strong>Conductor:</strong> {{ ruta.conductor?.nombres }} {{ ruta.conductor?.apellidos }}</p>
      <p><strong>Vehículo:</strong> {{ ruta.vehiculo?.marca }} {{ ruta.vehiculo?.modelo }}</p>
    </div>

    <div class="map-container">
      <RouteMap :puntos="puntos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import RouteMap from '../components/RouteMap.vue';
import type { Ruta } from '../types';

const route = useRoute();
const ruta = ref<Partial<Ruta>>({});
const puntos = ref<Array<{
  lat: number;
  lng: number;
  direccion?: string;
  numero_paquete?: string;
}>>([]);

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/rutas/${route.params.id}`);
    ruta.value = response.data;

    // Preparar puntos para el mapa (bodega + detalles)
    puntos.value = [
      {
        lat: 4.757786586246297,
        lng: -74.04488664305592,
        direccion: 'Bodega Principal - Punto de inicio',
        numero_paquete: 'ORIGEN'
      },
      ...response.data.detalles.map((d: any) => ({
        lat: d.latitud,
        lng: d.longitud,
        direccion: d.direccion,
        numero_paquete: d.numero_paquete
      }))
    ];
  } catch (error) {
    alert('Error cargando detalles de la ruta');
  }
});

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleString('es-CO');
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.container h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.75rem;
}

.ruta-info {
  background: #f1f1f1;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.ruta-info p {
  margin: 0.5rem 0;
  color: #555;
  font-size: 1rem;
}

.ruta-info strong {
  color: #333;
}

.map-container {
  width: 100%;
  height: 500px;
  border: 2px solid #e2e2e2;
  border-radius: 8px;
  overflow: hidden;
}
</style>