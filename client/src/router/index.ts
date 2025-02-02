import { createRouter, createWebHistory } from 'vue-router';

import VehiculosView from '../views/VehiculosView.vue';
import ConductoresView from '../views/ConductoresView.vue';
import RutasCreateView from '../views/RutasCreateView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/vehiculos',
            name: 'vehiculos',
            component: VehiculosView,
        },
        {
            path: '/conductores',
            name: 'conductores',
            component: ConductoresView
        },
        {
            path: '/rutas/crear',
            name: 'rutas-create',
            component: RutasCreateView
        }
    ],
});

export default router;