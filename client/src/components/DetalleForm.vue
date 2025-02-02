<template>
    <div class="detalle-form">
        <div v-for="(detalle, index) in detalles" :key="index" class="detalle-item">
            <h3>Punto de Entrega {{ index + 1 }}</h3>

            <div class="form-group">
                <label>Latitud:</label>
                <input v-model.number="detalle.latitud" type="number" step="any" required>
            </div>

            <div class="form-group">
                <label>Longitud:</label>
                <input v-model.number="detalle.longitud" type="number" step="any" required>
            </div>

            <div class="form-group">
                <label>Dirección:</label>
                <input v-model="detalle.direccion" type="text" required>
            </div>

            <div class="form-group">
                <label>Número de Paquete:</label>
                <input v-model="detalle.numero_paquete" type="text" required>
            </div>

            <button @click="removeDetalle(index)" class="btn-remove">Eliminar</button>
        </div>

        <button @click="addDetalle" class="btn-add">Agregar Punto</button>
        <button @click="submitDetalles" class="btn-submit">Guardar Detalles</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps<{
    rutaId: number;
}>();

const detalles = ref([{
    latitud: 4.757786, // Coordenada inicial: bodega
    longitud: -74.044886,
    direccion: '',
    numero_paquete: ''
}]);

const addDetalle = () => {
    detalles.value.push({
        latitud: 0,
        longitud: 0,
        direccion: '',
        numero_paquete: ''
    });
};

const removeDetalle = (index: number) => {
    detalles.value.splice(index, 1);
};

const submitDetalles = async () => {
    try {
        await axios.post(`http://localhost:3000/rutas/${props.rutaId}/detalles`, detalles.value);
        alert('Detalles guardados correctamente!');
        window.location.reload();
    } catch (error) {
        alert('Error guardando detalles');
    }
};
</script>

<style scoped>
.detalle-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.detalle-item {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    position: relative;
}

h3 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
}

input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Botones */
button {
    display: block;
    width: 100%;
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
}

.btn-remove {
    background-color: #dc3545;
    color: white;
    border: none;
    margin-top: 1rem;
}

.btn-remove:hover {
    background-color: #c82333;
    transform: scale(1.05);
}

.btn-add {
    background-color: #28a745;
    color: white;
    border: none;
    margin-top: 1rem;
}

.btn-add:hover {
    background-color: #218838;
    transform: scale(1.05);
}

.btn-submit {
    background-color: #007bff;
    color: white;
    border: none;
    margin-top: 1.5rem;
}

.btn-submit:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}
</style>