<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import L from 'leaflet';
  import axios from 'axios';
  import polyline from '@mapbox/polyline'; // Para decodificar la geometría de OSRM
  
  // Se reciben los puntos a través de props.
  const props = defineProps<{
    puntos: Array<{
      lat: number;
      lng: number;
      direccion?: string;
      numero_paquete?: string;
    }>;
  }>();
  
  const mapContainer = ref<HTMLElement | null>(null);
  let map: L.Map;
  let routePolyline: L.Polyline | null = null;
  
  onMounted(() => {
    if (mapContainer.value) {
      map = L.map(mapContainer.value).setView([4.757786, -74.044886], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
  });
  
  // Cada vez que cambien los puntos se actualiza el mapa.
  watch(
    () => props.puntos,
    async (newPuntos) => {
      if (!map || newPuntos.length === 0) return;
  
      // Eliminar ruta anterior, si existe.
      if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
      }
  
      // Eliminar marcadores previos (esto es opcional, según cómo manejes tus capas).
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
  
      // Agregar marcadores para cada punto.
      newPuntos.forEach((punto, index) => {
        const marker = L.marker([punto.lat, punto.lng]).addTo(map);
        marker.bindPopup(`
          <strong>${index === 0 ? 'Bodega Principal' : 'Entrega ' + index}</strong><br>
          ${punto.direccion || ''}
        `);
      });
  
      // Si hay más de un punto, solicitar la ruta a OSRM.
      if (newPuntos.length > 1) {
        // OSRM requiere las coordenadas en formato "lng,lat" separadas por punto y coma.
        const coordsString = newPuntos.map((p) => `${p.lng},${p.lat}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=polyline`;
  
        try {
          const response = await axios.get(osrmUrl);
          const data = response.data;
  
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            // Decodificar la cadena polyline a un arreglo de pares [lat, lng].
            const decodedCoords: Array<[number, number]> = polyline.decode(route.geometry);
  
            // Dibujar la ruta en el mapa.
            routePolyline = L.polyline(decodedCoords, {
              color: '#FF6B6B',
              weight: 4,
              dashArray: '5, 5'
            }).addTo(map);
  
            // Ajustar la vista para abarcar toda la ruta con un padding.
            map.fitBounds(routePolyline.getBounds().pad(0.2));
          }
        } catch (error) {
          console.error('Error al obtener la ruta de OSRM:', error);
        }
      } else {
        // Si hay un solo punto, centrar el mapa en él.
        map.setView([newPuntos[0].lat, newPuntos[0].lng], 13);
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
  