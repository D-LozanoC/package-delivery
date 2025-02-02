<template>
  <div class="container">
    <h1>Registrar Vehículo</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Placa:</label>
        <input v-model="placa" type="text" required>
      </div>
      <div class="form-group">
        <label>Modelo:</label>
        <input v-model="modelo" type="text" required>
      </div>
      <div class="form-group">
        <label>Color:</label>
        <input v-model="color" type="text" required>
      </div>
      <div class="form-group">
        <label>Marca:</label>
        <input v-model="marca" type="text" required>
      </div>
      <div class="form-group">
        <label>Capacidad de Carga (kg):</label>
        <input v-model="capacidad_carga" type="number" required>
      </div>
      <button type="submit">Registrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import axios from 'axios';

const placa = ref('');
const modelo = ref('');
const color = ref('');
const marca = ref('');
const capacidad_carga = ref('');

const submitForm = async () => {
  try {
    await axios.post('http://localhost:3000/vehiculos', {
      placa: placa.value,
      modelo: modelo.value,
      color: color.value,
      marca: marca.value,
      capacidad_carga: capacidad_carga.value,
    });

    alert('Vehículo registrado exitosamente!');

    // Limpiar formulario

    placa.value = '';
    modelo.value = '';
    color.value = '';
    marca.value = '';
    capacidad_carga.value = '';

  } catch (error) {
    alert('Error al registrar el vehículo. Verifica los datos.');
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

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  width: 80%;
  align-self: center;
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

button {
  align-self: center;
  width: 80%;
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