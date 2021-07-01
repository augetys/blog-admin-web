import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['user','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/sys/user/index'),
        meta: { title: '用户管理', icon: 'sys-user' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/sys/role/index'),
        meta: { title: '角色管理', icon: 'sys-role' }
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/views/sys/menu/index'),
        meta: { title: '菜单管理', icon: 'sys-menu' }
      },
      {
        path: 'config',
        name: '系统配置',
        component: () => import('@/views/sys/config/index'),
        meta: { title: '系统配置', icon: 'sys-config' }
      },
      {
        path: 'log',
        name: '操作日志',
        component: () => import('@/views/sys/log/index'),
        meta: { title: '操作日志', icon: 'sys-log' }
      },
      {
        path: 'allocMenu',
        name: '分配菜单',
        component: () => import('@/views/sys/role/allocMenu'),
        meta: { title: '分配菜单', icon: '' },
        hidden: true
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/system',
    name: '监控中心',
    meta: {
      title: '监控中心',
      icon: 'monitor'
    },
    children: [
      {
        path: 'system',
        name: '服务器监控',
        component: () => import('@/views/monitor/system/index'),
        meta: { title: '服务器监控', icon: 'monitor-system' }
      },
      {
        path: 'druid',
        name: 'druid',
        component: () => import('@/views/monitor/druid/index'),
        meta: { title: 'druid', icon: 'monitor-druid' }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/article',
    name: '博客管理',
    meta: {
      title: '博客管理',
      icon: 'blog'
    },
    children: [
      {
        path: 'article',
        name: '文章管理',
        component: () => import('@/views/blog/article/index'),
        meta: { title: '文章管理', icon: 'blog-article' }
      },
      {
        path: 'category',
        name: '分类管理',
        component: () => import('@/views/blog/category/index'),
        meta: { title: '分类管理', icon: 'blog-category' }
      },
      {
        path: 'tag',
        name: '标签管理',
        component: () => import('@/views/blog/tag/index'),
        meta: { title: '标签管理', icon: 'blog-tag' }
      },
      {
        path: 'comment',
        name: '评论管理',
        component: () => import('@/views/blog/comment/index'),
        meta: { title: '评论管理', icon: 'blog-comment' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

