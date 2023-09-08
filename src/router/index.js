import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Layout from "@/views/Layout";
import RegisterView from "@/views/RegisterView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView')
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        children: [ // 子路由
            {
                path: '',
                name: 'home',
                component: HomeView
            },
            {
                path: 'admin',
                name: 'admin',
                component: () => import('../views/AdminView.vue')
            },
            {
                path: 'book',
                name: 'book',
                component: () => import('../views/BookView.vue')
            },
            {
                path: 'type',
                name: 'type',
                component: () => import('../views/TypeView.vue')
            },
            {
                path: 'audit',
                name: 'audit',
                component: () => import('../views/AuditView.vue')
            },
            {
                path: 'hotel',
                name: 'hotel',
                component: () => import('../views/HotelView.vue')
            },
            {
                path: 'reserve',
                name: 'reserve',
                component: () => import('../views/ReserveView.vue')
            },
            {
                path: 'log',
                name: 'log',
                component: () => import('../views/LogView.vue')
            },
            {
                path: 'notice',
                name: 'notice',
                component: () => import('../views/NoticeView.vue')
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 路由守卫
router.beforeEach((to ,from, next) => {
    const user = localStorage.getItem("user");
    if (!user && to.path !== '/login' && to.path !== '/register') {
        return next("/login");
    }
    next();
})


export default router
