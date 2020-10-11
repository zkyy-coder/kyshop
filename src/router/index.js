import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入页面
const DashBoard = () => import('@/views/dashboard/DashBoard.vue')
const Home = () => import('@/views/home/Home.vue')
const Category = () => import('@/views/category/Category.vue')
const Cart = () => import('@/views/cart/Cart.vue')

const Mine = () => import('@/views/mine/Mine.vue')
const UserCenter = () => import('@/views/mine/children/userCenter/UserCenter.vue')
const MineOrder = () => import('@/views/mine/children/mineOrder/MineOrder.vue')

const Order = () => import('@/views/order/Order.vue')
const MyAddress = () => import('@/views/order/children/myAddress/MyAddress.vue')
const OrderDetail = () => import('@/views/order/children/orderDetail/OrderDetail.vue')
const AddAddress = () => import('@/views/order/children/children/addAddress/AddAddress.vue')
const EditAddress = () => import('@/views/order/children/children/editAddress/EditAddress.vue')

const Login = () => import('@/views/login/Login.vue')

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
      children: [
        { path: '/dashboard', redirect: '/dashboard/home' },
        { path: 'home', name: 'home', component: Home, meta: { keepAlive: true } },
        { path: 'category', name: 'category', component: Category, meta: { keepAlive: true } },
        { path: 'cart', name: 'cart', component: Cart },
        { 
          path: 'mine', 
          name: 'mine',
          component: Mine,
          children: [
            {path: 'userCenter', name: 'userCenter', component: UserCenter},
            {path: 'mineOrder', name: 'mineOrder', component: MineOrder},
          ]
        }
      ]
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      children: [
        {
          path: 'myAddress',
          name: "myAddress",
          component: MyAddress,
          children: [
            { path: 'addAddress', name: 'addAddress', component: AddAddress },
            { path: 'editAddress', name: 'editAddress', component: EditAddress }
          ]
        },
        {
          path: 'orderDetail',
          name: 'orderDetail',
          component: OrderDetail
        }
      ]
    },
    { path: '/login', name: 'login', component: Login }
  ]
})