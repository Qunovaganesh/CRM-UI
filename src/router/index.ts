import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Lead from '../views/Lead.vue';
import Prospect from '../views/Prospect.vue';
import Customer from '../views/Customer.vue';
import ViewOnly from '../views/ViewOnly.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/lead/:id',
    name: 'Lead',
    component: Lead,
    props: true
  },
  {
    path: '/prospect/:id',
    name: 'Prospect',
    component: Prospect,
    props: true
  },
  {
    path: '/customer/:id',
    name: 'Customer',
    component: Customer,
    props: true
  },
  {
    path: '/view/:id',
    name: 'ViewOnly',
    component: ViewOnly,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

