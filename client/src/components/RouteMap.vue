<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const props = defineProps<{
  puntos: Array<{
    lat: number;
    lng: number;
    direccion?: string;
  }>;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map;
let rutaPolyline: L.Polyline | null = null;

// Almacenar la ruta optimizada
const rutaOptimizada = ref<Array<{ lat: number; lng: number }>>([]);
const ultimoPuntoAntesDeRegresar = ref<{ lat: number; lng: number } | null>(null);

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([4.757786, -74.044886], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  }
});

watch(
  () => props.puntos,
  async (newPuntos) => {
    if (!map || newPuntos.length < 2) return;

    // Eliminar ruta previa si existe
    if (rutaPolyline) {
      map.removeLayer(rutaPolyline);
      rutaPolyline = null;
    }

    // Eliminar marcadores previos
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Construcción de la URL de OSRM
    const coords = newPuntos.map((p) => `${p.lng},${p.lat}`).join(';');
    const tripUrl = `https://router.project-osrm.org/trip/v1/driving/${coords}?source=first&roundtrip=true&overview=full&geometries=polyline`;

    try {
      const response = await axios.get(tripUrl);
      const data = response.data;

      if (data.trips && data.trips.length > 0) {
        const bestRoute = data.trips[0];

        // Obtener el orden optimizado de los puntos
        const waypoints = data.waypoints.sort((a: any, b: any) => a.waypoint_index - b.waypoint_index);
        rutaOptimizada.value = waypoints.map((w: any) => ({
          lat: w.location[1],
          lng: w.location[0]
        }));

        // Determinar el último punto antes de regresar a la bodega
        if (rutaOptimizada.value.length > 2) {
          // Tomamos el penúltimo punto, ya que el último es la bodega
          ultimoPuntoAntesDeRegresar.value = rutaOptimizada.value[rutaOptimizada.value.length - 2];
        } else {
          ultimoPuntoAntesDeRegresar.value = null;
        }

        // Dibujar la ruta optimizada
        const decodedCoords: Array<[number, number]> = polyline.decode(bestRoute.geometry);
        rutaPolyline = L.polyline(decodedCoords, {
          color: '#007bff',
          weight: 4
        }).addTo(map);

        // Ajustar la vista
        map.fitBounds(rutaPolyline.getBounds().pad(0.2));

        // Dibujar marcadores en el orden optimizado
        rutaOptimizada.value.forEach((punto, index) => {
          const marker = L.marker([punto.lat, punto.lng]).addTo(map);
          marker.bindPopup(`
            <strong>${index === 0 ? 'Bodega Principal' : `Entrega ${index}`}</strong><br>
            ${props.puntos.find(p => p.lat === punto.lat && p.lng === punto.lng)?.direccion || ''}
          `);
        });
      }
    } catch (error) {
      console.error('Error al obtener la ruta optimizada:', error);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
</style>
