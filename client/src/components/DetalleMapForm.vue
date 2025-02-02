<template>
    <div class="detalle-map-form">
        <div class="map-container">
            <div ref="map" class="map"></div>
        </div>

        <div class="form-container">
            <div class="selected-point">
                <h3>Punto Seleccionado</h3>
                <p>Latitud: {{ selectedPoint.latitud }}</p>
                <p>Longitud: {{ selectedPoint.longitud }}</p>
                <p>Dirección: {{ selectedPoint.direccion }}</p>
            </div>

            <div class="form-group">
                <label>Número de Paquete:</label>
                <input v-model="numeroPaquete" type="text" required>
            </div>

            <button @click="addPoint" :disabled="!isPointSelected">Agregar Punto</button>
        </div>

        <div class="points-list">
            <h3>Puntos de Entrega</h3>
            <div v-for="(punto, index) in puntos" :key="index" class="point-item">
                <span>#{{ index + 1 }} - {{ punto.direccion }}</span>
                <button @click="removePoint(index)">×</button>
            </div>
            <!-- Botón para guardar la ruta, se habilita si hay al menos un punto -->
            <button @click="guardarRuta" :disabled="puntos.length === 0" class="guardar-btn">
                Guardar Ruta
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'; // Importar estilos de Leaflet

defineProps<{
    rutaId: number;
}>();

// Si se desea emitir el evento con los puntos, se puede usar este emit.
const emit = defineEmits(['points-added']);

const map = ref<HTMLElement | null>(null);
let leafletMap: L.Map;
let markers: L.Marker[] = [];
let clickMarker: L.Marker | null = null;

const selectedPoint = ref({
    latitud: 0,
    longitud: 0,
    direccion: 'Selecciona un punto en el mapa'
});

const numeroPaquete = ref('');
const puntos = ref<Array<{
    latitud: number;
    longitud: number;
    direccion: string;
    numero_paquete: string;
}>>([]);

// Inicializar mapa
onMounted(() => {
    if (map.value) {
        leafletMap = L.map(map.value).setView([4.757786, -74.044886], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

        // Manejador de clics en el mapa
        leafletMap.on('click', async (e: L.LeafletMouseEvent) => {
            // Verificar que el punto esté dentro del área de cobertura (50km de [4.757786, -74.044886])
            if (e.latlng.distanceTo([4.757786, -74.044886]) > 50000) {
                alert('La entrega debe estar dentro del área de cobertura');
                return;
            }

            selectedPoint.value.latitud = e.latlng.lat;
            selectedPoint.value.longitud = e.latlng.lng;

            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`,
                    {
                        headers: { 'Accept-Language': 'es', 'User-Agent': 'TuApp/1.0' } // Incluir cabeceras recomendadas
                    }
                );
                selectedPoint.value.direccion = response.data.display_name;
            } catch (error) {
                selectedPoint.value.direccion = 'Dirección no encontrada';
            }

            // Actualizar marcador de selección temporal
            if (clickMarker) leafletMap.removeLayer(clickMarker);
            clickMarker = L.marker(e.latlng).addTo(leafletMap);
        });
    }
});

// Limpieza al desmontar el componente
onUnmounted(() => {
    if (leafletMap) {
        leafletMap.off(); // Remover todos los listeners
        leafletMap.remove();
    }
});

const isPointSelected = computed(() => {
    return selectedPoint.value.latitud !== 0 &&
        selectedPoint.value.longitud !== 0 &&
        numeroPaquete.value.trim() !== '';
});

const addPoint = () => {
    // Si existe un marcador temporal, lo convertimos en permanente
    if (clickMarker) {
        markers.push(clickMarker);
        clickMarker = null;
    } else {
        // Si no hay marcador temporal (por ejemplo, se generó de otra forma)
        const permanentMarker = L.marker([selectedPoint.value.latitud, selectedPoint.value.longitud]).addTo(leafletMap);
        markers.push(permanentMarker);
    }

    puntos.value.push({
        latitud: selectedPoint.value.latitud,
        longitud: selectedPoint.value.longitud,
        direccion: selectedPoint.value.direccion,
        numero_paquete: numeroPaquete.value
    });

    // Resetear formulario y marcador temporal
    selectedPoint.value = { latitud: 0, longitud: 0, direccion: 'Selecciona un punto en el mapa' };
    numeroPaquete.value = '';
};

const removePoint = (index: number) => {
    // Eliminar el marcador correspondiente del mapa
    if (markers[index]) {
        leafletMap.removeLayer(markers[index]);
        markers.splice(index, 1);
    }
    puntos.value.splice(index, 1);
};

const guardarRuta = async () => {
    if (puntos.value.length === 0) {
        alert('Agrega al menos un punto para guardar la ruta.');
        return;
    }

    try {
        // Si se usa un emit para comunicar con el componente padre:
        emit('points-added', puntos.value);

        alert('Ruta guardada correctamente');
        // Reiniciar puntos y marcadores en el mapa, si se desea:
        puntos.value = [];
        markers.forEach(marker => leafletMap.removeLayer(marker));
        markers = [];
    } catch (error) {
        console.error('Error al guardar la ruta', error);
        alert('Ocurrió un error al guardar la ruta');
    }
};
</script>

<style scoped>
.detalle-map-form {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.map-container {
    flex: 1 1 50%;
    min-width: 300px;
    height: 400px;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.map {
    width: 100%;
    height: 100%;
}

.form-container {
    flex: 1 1 45%;
    min-width: 300px;
    background: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.selected-point h3 {
    margin-bottom: 0.5rem;
    color: #333;
}

.selected-point p {
    margin: 0.25rem 0;
    color: #555;
}

.form-group {
    margin-top: 1rem;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-container button {
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.8rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.form-container button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.form-container button:hover:not(:disabled) {
    background-color: #0056b3;
    transform: scale(1.02);
}

.points-list {
    flex: 1 1 100%;
    margin-top: 2rem;
    background: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.points-list h3 {
    margin-bottom: 1rem;
    color: #333;
}

.point-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
}

.point-item:last-child {
    border-bottom: none;
}

.point-item span {
    color: #555;
}

.point-item button {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    color: #dc3545;
    cursor: pointer;
    transition: transform 0.2s;
}

.point-item button:hover {
    transform: scale(1.2);
}

.guardar-btn {
    background-color: #28a745;
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.8rem;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.guardar-btn:hover:not(:disabled) {
    background-color: #218838;
}

.guardar-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
