
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/players',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/players/Index.vue') }
    ]
  },
  {
    path: '/categories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/categories/Index.vue') },
      { path: '/categories/:id/questions', component: () => import('pages/categories/questions/Index.vue'), props: true }
    ]
  },
  {
    path: '/trivia',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/trivia/Trivia.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
