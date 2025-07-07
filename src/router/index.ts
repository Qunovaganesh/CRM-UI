import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Lead from '../views/Lead.vue';
import Prospect from '../views/Prospect.vue';
import Customer from '../views/Customer.vue';
import ViewOnly from '../views/ViewOnly.vue';
import Registration from '../views/Registration.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Manufacturer-Distributor Management'
    }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    meta: {
      title: 'New Lead Registration'
    }
  },
  {
    path: '/lead/:id',
    name: 'Lead',
    component: Lead,
    props: true,
    meta: {
      title: 'Lead Management'
    }
  },
  {
    path: '/prospect/:id',
    name: 'Prospect',
    component: Prospect,
    props: true,
    meta: {
      title: 'Prospect Management'
    }
  },
  {
    path: '/customer/:id',
    name: 'Customer',
    component: Customer,
    props: true,
    meta: {
      title: 'Customer Management'
    }
  },
  {
    path: '/view/:id',
    name: 'ViewOnly',
    component: ViewOnly,
    props: true,
    meta: {
      title: 'Relationship View'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
});

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router;