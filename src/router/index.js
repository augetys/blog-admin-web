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
 * 当在声明路由是 添加了 Affix 属性，则当前tag会被固定在 tags-view中（不可被删除）。
 * 文档地址https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#visitedviews-cachedviews
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
      meta: { title: '首页', icon: 'home', affix: true }
    }]
  }
]

export const asyncRoutes = [
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
        path: 'nav',
        name: '导航栏管理',
        component: () => import('@/views/blog/nav/index'),
        meta: { title: '导航栏管理', icon: 'blog-nav' }
      },
      {
        path: 'loop',
        name: '轮播图管理',
        component: () => import('@/views/blog/loop/index'),
        meta: { title: '轮播图管理', icon: 'blog-loop' }
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
        path: 'soul',
        name: '词句管理',
        component: () => import('@/views/blog/soul/index'),
        meta: { title: '词句管理', icon: 'blog-soul' }
      },
      {
        path: 'photo',
        name: '相册管理',
        component: () => import('@/views/blog/photo/index'),
        meta: { title: '相册管理', icon: 'blog-photo' }
      },
      {
        path: 'website',
        name: '网址导航',
        component: () => import('@/views/blog/website/index'),
        meta: { title: '网址导航', icon: 'blog-website' }
      }
    ]
  },
  {
    path: '/tool',
    component: Layout,
    redirect: '/tool/email',
    name: '系统工具',
    meta: {
      title: '系统工具',
      icon: 'tool'
    },
    children: [
      {
        path: 'email',
        name: '邮件',
        component: () => import('@/views/tool/email/index'),
        meta: { title: '邮件', icon: 'tool-mail' }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/qiniu',
    name: '资源管理',
    meta: {
      title: '资源管理',
      icon: 'resource'
    },
    children: [
      {
        path: 'qiniu',
        name: '七牛云',
        component: () => import('@/views/resource/qiniu/index'),
        meta: { title: '七牛云', icon: 'blog-article' }
      },
      {
        path: 'localStorage',
        name: '本地存储',
        component: () => import('@/views/resource/localStorage/index'),
        meta: { title: '本地存储', icon: 'blog-category' }
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
      },
      {
        path: 'operation',
        name: '操作日志',
        component: () => import('@/views/monitor/operation/index'),
        meta: { title: '操作日志', icon: 'monitor-operation' }
      },
      {
        path: 'exception',
        name: '异常日志',
        component: () => import('@/views/monitor/exception/index'),
        meta: { title: '异常日志', icon: 'monitor-exception' }
      }
    ]
  },
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
        path: 'task',
        name: '任务调度',
        component: () => import('@/views/sys/task/index'),
        meta: { title: '任务调度', icon: 'sys-task' }
      },
      {
        path: 'dict',
        name: '字典管理',
        component: () => import('@/views/sys/dict/index'),
        meta: { title: '字典管理', icon: 'sys-dict' }
      },
      {
        path: 'allocMenu',
        name: '分配菜单',
        component: () => import('@/views/sys/role/allocMenu'),
        meta: { title: '分配菜单', icon: '' },
        hidden: true
      },
      {
        path: 'dictDetail',
        name: '字典详情',
        component: () => import('@/views/sys/dict/dictDetail'),
        meta: { title: '字典详情', icon: '' },
        hidden: true
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

