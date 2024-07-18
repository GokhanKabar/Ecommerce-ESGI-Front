import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '@/views/back/AdminView.vue'
import AdminUsers from '@/views/back/AdminUsers.vue'
import AdminProducts from '@/views/back/AdminProducts.vue'
import AdminBrand from '@/views/back/AdminBrand.vue'
import AdminFamily from '@/views/back/AdminFamily.vue'
import ClientOrders from '@/views/back/ClientOrders.vue'
import HomeView from '@/views/front/HomeView.vue'
import BrandView from '@/views/front/BrandView.vue'
import ContactView from '@/views/front/ContactView.vue'
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
import Success from '@/views/front/Success.vue'
import Cancel from '@/views/front/Cancel.vue'
import ProfilView from '@/views/back/ProfilView.vue'
import NotFound from '@/errors/NotFound.vue'
import MentionLegal from '@/views/front/MentionLegal.vue'
import CGV from '@/views/front/CGV.vue'
import PaiementSecurise from '@/views/front/PaiementSecurise.vue'
import ProtectionDonnees from '@/views/front/ProtectionDonnees.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { title: 'Admin', needsAuth: true, roles: ['ADMIN', 'ROLE_STORE_KEEPER'] }
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUsers,
      meta: { title: 'Admin', needsAuth: true, roles: ['ADMIN'] }
    },
    {
      path: '/admin/products',
      name: 'adminProducts',
      component: AdminProducts,
      meta: { title: 'Admin', needsAuth: true, roles: ['ADMIN', 'ROLE_STORE_KEEPER'] }
    },
    {
      path: '/admin/brand',
      name: 'adminBrand',
      component: AdminBrand,
      meta: { title: 'Admin', needsAuth: true, roles: ['ADMIN', 'ROLE_STORE_KEEPER'] }
    },
    {
      path: '/admin/family',
      name: 'adminFamily',
      component: AdminFamily,
      meta: { title: 'Admin', needsAuth: true, roles: ['ADMIN', 'ROLE_STORE_KEEPER'] }
    },
    {
      path: '/myorders',
      name: 'clientOrders',
      component: ClientOrders,
      meta: { title: 'Client Orders', needsAuth: true, roles: ['USER'] }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilView,
      meta: { title: 'profile', needsAuth: true }
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
      name: 'MotPasseOublie',
      component: ForgatPassword,
      meta: { title: 'Mot de passe oublié | Tendance Parfums' }
    },
    {
      path: '/renitialisation-mot-de-passe',
      name: 'RéinitialisationDeMotPasse',
      component: ResetPassword,
      meta: { title: 'réinitialisation de mot de passe | Tendance Parfums' }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetail,
      meta: { title: 'Parfum | Tendance Parfums' }
    },
    {
      path: '/success',
      name: 'Success',
      component: Success,
      meta: { title: 'Success | Tendance Parfums' }
    },
    {
      path: '/cancel',
      name: 'Cancel',
      component: Cancel,
      meta: { title: 'Cancel | Tendance Parfums' }
    },
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound,
      meta: { title: '404 Not Found', needsAuth: true }
    },
    {
      path: '/mention-legale',
      name: 'MentionLegale',
      component: MentionLegal,
      meta: { title: 'Mention Legale | Tendance Parfums' }
    },
    {
      path: '/cgu-cgv',
      name: 'CguCgv',
      component: CGV,
      meta: { title: 'CGU-CGV | Tendance Parfums' }
    },
    {
      path: '/paiement-securise',
      name: 'PaiementSecurise',
      component: PaiementSecurise,
      meta: { title: 'Paiement Securise | Tendance Parfums' }
    },
    {
      path: '/protection-donnees',
      name: 'ProtectionDonnees',
      component: ProtectionDonnees,
      meta: { title: 'Protection Donnees | Tendance Parfums' }
    }
  ]
})
router.beforeEach((to) => {
  document.title = to.meta?.title ?? 'Default page'
})
router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth) {
    if (!store.state.isUserLoggedIn) {
      next('/connexion')
    } else {
      const Role = store.state.user.role
      if (to.meta.roles && !to.meta.roles.includes(Role)) {
        next('/NotFound')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})
export default router
