import {
  ADD_GOODS,
  INIT_SHOP_CART,
  REDUCE_CART,
  SELECTED_SINGLE_GOODS,
  SELECTED_ALL_GOODS,
  CLEAR_CART,
  SAVE_USER_INFO,
  INIT_USER_INFO,
  DELECT_USER_INFO
} from './mutations-type'

import { getStore, setStore, removeStore } from '@/config/global.js'

export default {
  // 往购物车添加数据
  [ADD_GOODS](state, { goodsId, goodsName, smallImage, goodsPrice }) {
    let shopCart = state.shopCart

    // 判断购物车中是否拥有该商品
    if (shopCart[goodsId]) {
      shopCart[goodsId]['num']++
    } else {
      shopCart[goodsId] = {
        'id': goodsId,
        'num': 1,
        'name': goodsName,
        'small_image': smallImage,
        'price': goodsPrice,
        "checked": true
      }
    }

    // 同步数据
    state.shopCart = { ...shopCart }
    setStore('shopCart', state.shopCart)
  },

  // 页面初始化，获取本地购物车数据
  [INIT_SHOP_CART](state) {
    let shopCart = getStore('shopCart')

    if (shopCart) {
      state.shopCart = JSON.parse(shopCart)
    }
  },

  // 把商品移出购物车
  [REDUCE_CART](state, { goodsId }) {
    let shopCart = state.shopCart
    let goods = shopCart[goodsId]

    if (goods) {
      if (goods['num'] > 0) {
        goods['num']--

        // 当商品数量为0时，删除该商品
        if (goods['num'] === 0) {
          delete shopCart[goodsId]
        }
      } else {
        goods = null
      }

      // 同步数据
      state.shopCart = { ...shopCart }
      setStore('shopCart', state.shopCart)
    }
  },

  // 单个商品的选中和取消
  [SELECTED_SINGLE_GOODS](state, { goodsId }) {
    let shopCart = state.shopCart
    let goods = shopCart[goodsId]

    if (goods) {
      goods.checked = !goods.checked
    }

    // 同步数据
    state.shopCart = { ...shopCart }
    setStore('shopCart', state.shopCart)
  },

  // 所有商品的选中和取消
  [SELECTED_ALL_GOODS](state, { isSelectedAll }) {
    let shopCart = state.shopCart

    Object.values(shopCart).forEach(item => {
      item.checked = !isSelectedAll
    })

    // 同步数据
    state.shopCart = { ...shopCart }
    setStore('shopCart', state.shopCart)
  },

  // 清空购物车
  [CLEAR_CART](state) {
    state.shopCart = null

    // 同步数据
    state.shopCart = { ...state.shopCart }
    setStore('shopCart', state.shopCart)
  },

  // 保存用户信息
  [SAVE_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
    setStore('userInfo', state.userInfo)
  },

  // 初始化用户信息
  [INIT_USER_INFO](state) {
    let userInfo = getStore('userInfo')
    if (userInfo) {
      state.userInfo = JSON.parse(userInfo)
    }
  },

  // 删除用户信息
  [DELECT_USER_INFO](state) {
    state.userInfo = {}
    removeStore('userInfo')
  },
}