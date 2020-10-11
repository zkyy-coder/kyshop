<template>
  <div id="dashboard">
    <!-- 底部Tabbar -->
    <van-tabbar v-model="active" active-color="#75a423">
      <van-tabbar-item replace to="home">
        <span>首页</span>
        <template #icon="props">
          <img :src="props.active ? home_icon.active : home_icon.normal" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="category">
        <span>分类</span>
        <template #icon="props">
          <img :src="props.active ? category_icon.active : category_icon.normal" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="cart" :info="goodsNum > 0 ? goodsNum : ''">
        <span>购物车</span>
        <template #icon="props">
          <img :src="props.active ? cart_icon.active : cart_icon.normal" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="mine">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? mine_icon.active : mine_icon.normal" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions} from 'vuex'
  import { getCartData } from '@/service/api'
  import { setStore } from '@/config/global.js'

  export default {
    data() {
      return {
        active: Number(window.sessionStorage.getItem('tabBarActiveIndex')) || 0,
        home_icon: {
          normal: require("@/assets/image/tabbar/home_default.png"),
          active: require("@/assets/image/tabbar/home_selected.png"),
        },
        category_icon: {
          normal: require("@/assets/image/tabbar/category_default.png"),
          active: require("@/assets/image/tabbar/category_selected.png"),
        },
        cart_icon: {
          normal: require("@/assets/image/tabbar/shoppingcart_default.png"),
          active: require("@/assets/image/tabbar/shoppingcart_selected.png"),
        },
        mine_icon: {
          normal: require("@/assets/image/tabbar/mine_default.png"),
          active: require("@/assets/image/tabbar/mine_selected.png"),
        },
      };
    },
    watch: {
      active(value) {
        let tabBarActiveIndex = value > 0 ? value : 0
        window.sessionStorage.setItem('tabBarActiveIndex', tabBarActiveIndex)
      }
    },
    mounted() {
      this.initUserInfo()
      this._initShopCart()
    },
    computed: {
      ...mapState(['shopCart', 'userInfo']),
      goodsNum() {
        if(this.shopCart) {
          let num = 0
          Object.values(this.shopCart).forEach(item => {
            num += item['num']
          })
          return num
        }else {
          return 0
        }
      }
    },
    methods: {
      ...mapMutations(['INIT_SHOP_CART']),
      ...mapActions(['initUserInfo']),
      // 初始化购物车中的数据
      async _initShopCart() {
        // 已登录
        if(this.userInfo.token) {
          let res = await getCartData(this.userInfo.token)
          // console.log(res);

          if(res.success_code === 200) {
            let shopCart = {}
            let cartArr = res.data

            // 转换格式
            cartArr.forEach(value => {
              shopCart[value.goods_id] = {
                'id': value.goods_id,
                'num': value.num,
                'name': value.goods_name,
                'small_image': value.small_image,
                'price': value.goods_price,
                "checked": value.checked
              }
            })

            // 同步数据
            setStore('shopCart', shopCart)
            this.INIT_SHOP_CART()
          }
        }
      }
    }
  };
</script>

<style lang='less' scoped>
</style>