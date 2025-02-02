<template>
  <div class="container">
    <h1>Programar Ruta</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Conductor:</label>
        <select v-model="form.conductorId" required>
          <option v-for="c in conductores" :key="c.id" :value="c.id">
            {{ c.nombres }} {{ c.apellidos }} ({{ c.numero_licencia }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Vehículo:</label>
        <select v-model="form.vehiculoPlaca" required>
          <option v-for="v in vehiculos" :key="v.placa" :value="v.placa">
            {{ v.marca }} {{ v.modelo }} ({{ v.placa }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Fecha:</label>
        <input v-model="form.fecha" type="datetime-local" required>
      </div>

      <button type="submit">Programar Ruta</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { type conductor, type vehiculo } from '../types';

const form = ref({
  conductorId: '',
  vehiculoPlaca: '',
  fecha: ''
});

const conductores = ref<conductor[]>([]);
const vehiculos = ref<vehiculo[]>([]);

// Obtener conductores y vehículos al cargar el componente
onMounted(async () => {
  try {
    const [conductoresRes, vehiculosRes] = await Promise.all([
      axios.get('http://localhost:3000/conductores'),
      axios.get('http://localhost:3000/vehiculos')
    ]);

    conductores.value = conductoresRes.data;
    vehiculos.value = vehiculosRes.data;
  } catch (error) {
    alert('Error cargando datos');
  }
});

const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:3000/rutas', form.value);
    alert(`Ruta programada! ID: ${response.data.id}`);
    form.value = { conductorId: '', vehiculoPlaca: '', fecha: '' };
  } catch (error) {
    alert('Error al programar la ruta');
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
}

select,
input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

select:focus,
input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>