<template>
  <header>
    <nav>
      <router-link to="/vehiculos">Registrar Vehículo</router-link>
      <router-link to="/conductores">Registrar Conductores</router-link>
      <router-link to="/rutas/crear">Programar Rutas</router-link>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
}

nav {
  padding: 1rem;
  background-color: #f0f0f0;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

nav a:hover {
  color: #4CAF50;
}
</style>