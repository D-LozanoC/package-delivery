import axios from 'axios';

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

export const optimizeRoute = async (coordinates: Array<[number, number]>) => {
  try {
    // Formatear coordenadas: "lon,lat;lon,lat;..."
    const coordinatesString = coordinates
      .map(([lon, lat]) => `${lon},${lat}`)
      .join(';');

    const response = await axios.get(
      `${OSRM_BASE_URL}/${coordinatesString}?overview=full&geometries=geojson&steps=true`
    );

    if (response.data.code !== 'Ok') {
      throw new Error('Error en la optimización de ruta');
    }

    return {
      geometry: response.data.routes[0].geometry,
      duration: response.data.routes[0].duration,
      distance: response.data.routes[0].distance,
      waypoints: response.data.waypoints
    };
  } catch (error) {
    throw new Error('No se pudo calcular la ruta optimizada');
  }
};