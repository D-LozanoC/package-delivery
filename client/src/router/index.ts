import { createRouter, createWebHistory } from 'vue-router';

import VehiculosView from '../views/VehiculosView.vue';
import ConductoresView from '../views/ConductoresView.vue';
import RutasCreateView from '../views/RutasCreateView.vue';
import RutasSearchView from '../views/RutasSearchView.vue';
import RutaDetailsView from '../views/RutaDetailsView.vue';
import DocsView from '../views/DocsView.vue';

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
        },
        {
            path: '/rutas',
            name: 'rutas-search',
            component: RutasSearchView
        },
        {
            path: '/rutas/:id',
            name: 'ruta-details',
            component: RutaDetailsView
        },
        {
            path: '/docs',
            name: 'docs',
            component: DocsView
        }
    ],
});

export default router;