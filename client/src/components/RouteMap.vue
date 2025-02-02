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
let idaPolyline: L.Polyline | null = null;
let vueltaPolyline: L.Polyline | null = null;
let markers: L.Marker[] = [];

// Iconos personalizados
const warehouseIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [32, 32],
});

const deliveryIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [28, 28],
});

// Limpiar elementos del mapa
const clearMap = () => {
  [idaPolyline, vueltaPolyline].forEach(layer => {
    if (layer) map.removeLayer(layer);
  });
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
};

// Obtener ruta optimizada desde OSRM
const getOptimizedRoute = async (coordinates: string) => {
  const url = `https://router.project-osrm.org/trip/v1/driving/${coordinates}?source=first&roundtrip=false&overview=full&geometries=polyline`;
  const response = await axios.get(url);
  return response.data;
};

// Obtener ruta de regreso
const getReturnRoute = async (from: string, to: string) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${from};${to}?overview=full&geometries=polyline`;
  const response = await axios.get(url);
  return response.data;
};

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
    clearMap();

    try {
      // 1. Obtener ruta optimizada de ida
      const coords = newPuntos.map(p => `${p.lng},${p.lat}`).join(';');
      const tripData = await getOptimizedRoute(coords);

      // 2. Procesar resultados
      const optimizedWaypoints = tripData.waypoints
        .sort((a: any, b: any) => a.waypoint_index - b.waypoint_index)
        .map((wp: any) => ({
          lat: wp.location[1],
          lng: wp.location[0],
          direccion: newPuntos[wp.waypoint_index]?.direccion
        }));

      // 3. Obtener último punto de entrega
      const lastDelivery = optimizedWaypoints[optimizedWaypoints.length - 1];

      // 4. Obtener ruta de vuelta
      const returnData = await getReturnRoute(
        `${lastDelivery.lng},${lastDelivery.lat}`,
        `${newPuntos[0].lng},${newPuntos[0].lat}`
      );

      // 5. Dibujar rutas
      const idaGeometry = polyline.decode(tripData.trips[0].geometry);
      const vueltaGeometry = polyline.decode(returnData.routes[0].geometry);

      idaPolyline = L.polyline(idaGeometry, {
        color: '#007bff',
        weight: 3,
        dashArray: '5, 5'
      }).addTo(map);

      vueltaPolyline = L.polyline(vueltaGeometry, {
        color: '#ff4500',
        weight: 2
      }).addTo(map);

      // 6. Añadir marcadores
      optimizedWaypoints.forEach((punto: any, index: number) => {
        const isWarehouse = index === 0;
        const marker = L.marker([punto.lat, punto.lng], {
          icon: isWarehouse ? warehouseIcon : deliveryIcon
        }).addTo(map);

        marker.bindPopup(`
          <strong>${isWarehouse ? 'BODEGA' : `ENTREGA ${index}`}</strong><br>
          ${punto.direccion || 'Sin dirección registrada'}
        `);

        markers.push(marker);
      });

      // 7. Ajustar vista del mapa
      const allPoints = [
        ...idaGeometry.map(([lat, lng]) => L.latLng(lat, lng)),
        ...vueltaGeometry.map(([lat, lng]) => L.latLng(lat, lng))
      ];

      map.fitBounds(L.latLngBounds(allPoints).pad(0.2));

    } catch (error) {
      console.error('Error al calcular rutas:', error);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>