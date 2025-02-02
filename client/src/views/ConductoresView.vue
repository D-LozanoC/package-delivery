<template>
  <div class="container">
    <h1>Registrar Conductor</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Nombres:</label>
        <input v-model="form.nombres" type="text" required>
      </div>

      <div class="form-group">
        <label>Apellidos:</label>
        <input v-model="form.apellidos" type="text" required>
      </div>

      <div class="form-group">
        <label>Número de Licencia:</label>
        <input v-model="form.numero_licencia" type="text" required>
      </div>

      <div class="form-group">
        <label>Teléfono:</label>
        <input v-model="form.telefono" type="tel" required>
      </div>

      <div class="form-group">
        <label>Correo:</label>
        <input v-model="form.correo" type="email" required>
      </div>

      <button type="submit">Registrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  nombres: '',
  apellidos: '',
  numero_licencia: '',
  telefono: '',
  correo: ''
});

const submitForm = async () => {
  try {
    const response = await axios.post('http://localhost:3000/conductores', form.value);
    alert(`Conductor registrado! ID: ${response.data.id}`);
    form.value = {
      nombres: '',
      apellidos: '',
      numero_licencia: '',
      telefono: '',
      correo: ''
    };
  } catch (error) {
    alert('Error: Verifica los datos ingresados');
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
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>