import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/back/AdminView.vue'
import AdminUsers from '@/views/back/AdminUsers.vue'
import AdminProducts from '@/views/back/AdminProducts.vue'
import AdminCategory from '@/views/back/AdminCategory.vue'
import AdminOrders from '@/views/back/AdminOrders.vue'
import HomeView from '@/views/front/HomeView.vue'
import BrandView from '@/views/front/BrandView.vue'
import ContactView from '@/views/front/ContactView.vue'
import ChildrenView from '@/views/front/ChildrenView.vue'
import ManView from '@/views/front/ManView.vue'
import WomanView from '@/views/front/WomanView.vue'
import LoginView from '@/views/front/LoginView.vue'
import RegisterView from '@/views/front/RegisterView.vue'
import SendEmailConfirmationView from '@/views/front/SendEmailConfirmationView.vue'
import SendEmailForgatPasswordView from '@/views/front/SendEmailForgatPasswordView.vue'
import ResetPassword from '@/views/front/ResetPassword.vue'
import ForgatPassword from '@/views/front/ForgatPassword.vue'
import store from '@/store/store'
import ProductDetail from '@/views/front/ProductDetail.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { title: 'Admin', needsAuth: true }
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUsers,
      meta: { title: 'Admin' }
    },
    {
      path: '/admin/products',
      name: 'adminProducts',
      component: AdminProducts,
      meta: { title: 'Admin' }
    },
    {
      path: '/admin/category',
      name: 'adminCategory',
      component: AdminCategory,
      meta: { title: 'Admin' }
    },
    {
      path: '/admin/orders',
      name: 'adminOrders',
      component: AdminOrders,
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
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: LoginView,
      meta: { title: 'Connexion | Tendance Parfums' }
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: RegisterView,
      meta: { title: 'inscription | Tendance Parfums' }
    },
    {
      path: '/confirmation-email',
      name: 'ConfirmationEmail',
      component: SendEmailConfirmationView,
      meta: { title: 'Email confirmation | Tendance Parfums' }
    },
    {
      path: '/confirmation-email-reset-password',
      name: 'ConfirmationEmailResetPassword',
      component: SendEmailForgatPasswordView,
      meta: { title: 'Email confirmation | Tendance Parfums' }
    },
    {
      path: '/mot-passe-oublie',
      name: 'MotPasseOublie', // Renommé le nom de la route
      component: ForgatPassword,
      meta: { title: 'Mot de passe oublié | Tendance Parfums' }
    },
    {
      path: '/renitialisation-mot-de-passe',
      name: 'RéinitialisationDeMotPasse', // Renommé le nom de la route
      component: ResetPassword,
      meta: { title: 'réinitialisation de mot de passe | Tendance Parfums' }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetail,
      meta: { title: 'Parfum | Tendance Parfums' }
    }
  ]
})
router.beforeEach((to) => {
  document.title = to.meta?.title ?? 'Default page'
})
router.beforeEach((to, from, next) => {
  console.log(store.state.isUserLoggedIn)
  if (to.meta.needsAuth) {
    if (!store.state.isUserLoggedIn) {
      next('/connexion')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
