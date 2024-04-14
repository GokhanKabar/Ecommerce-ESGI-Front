import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/back/AdminView.vue';
import HomeView from '@/views/front/HomeView.vue';
import BrandView from '@/views/front/BrandView.vue';
import ContactView from '@/views/front/ContactView.vue';
import ChildrenView from '@/views/front/ChildrenView.vue';
import ManView from '@/views/front/ManView.vue';
import WomanView from '@/views/front/WomanView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { title: 'Admin' } 
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Parfumerie en ligne - Parfum | Tendance Parfums' } 
    },
    {
      path: '/homme',
      name: 'homme',
      component: ManView,
      meta: { title: 'Parfum Homme : Parfum | Tendance Parfums' } 
    },
    {
      path: '/femme',
      name: 'femme',
      component: WomanView,
      meta: { title: 'Parfum Femme : Parfum  | Tendance Parfums' } 
    },
    {
      path: '/enfant',
      name: 'enfant',
      component: ChildrenView,
      meta: { title: 'Parfum bébé, parfum enfant pour fille et garçon | Tendance Parfums' } 
    },
    {
      path: '/marque',
      name: 'marque',
      component: BrandView,
      meta: { title: 'Grandes marques de Parfumerie | Tendance Parfums' } 
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { title: 'Nous contacter | Tendance Parfums' } 
    }
  ]
})
router.beforeEach((to)=>{
  document.title=to.meta?.title??'Default page';
})

export default router
