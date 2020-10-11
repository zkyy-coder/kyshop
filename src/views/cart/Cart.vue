<template>
  <div id="cart" v-if="userInfo.token">
    <!--头部区域-->
    <header class="titleWrapper">
      <h4>
        <strong>购物车</strong>
        <button @click="clearCart()">清空购物车</button>
      </h4>
    </header>
    <div class="contentWrapper">
      <!--中间内容-->
      <main class="contentWrapperList">
        <section>
          <div class="shopCartListCon" v-for="goods in shopCart" :key="goods.id">
            <div class="left">
              <a href="javascript:;" @click.stop="selectedSingleGoods(goods.id)" :style="{backgroundImage: 'url(' + require('@/assets/image/cart/shop-icon.png') + ')'}" class="cartCheckBox" :checked="goods.checked"></a>
            </div>
            <div class="center">
              <img :src="goods.small_image" alt />
            </div>
            <div class="right">
              <a href="#">{{goods.name}}</a>
              <div class="bottomContent">
                <p class="shopPrice">{{goods.price | priceFormat}}</p>
                <div class="shopDeal">
                  <span @click="reduceGoodsNum(goods.id, goods.num)">-</span>
                  <input disabled type="number" v-model="goods.num" />
                  <span @click="addToCart(goods.id)">+</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <!--底部通栏-->
      <div class="tabBar">
        <div class="tabBarLeft">
          <a href="javascript:;"  :checked="selsectAll" @click.stop="selectedAllGoods(selsectAll)" class="cartCheckBox" :style="{backgroundImage: 'url(' + require('@/assets/image/cart/shop-icon.png') + ')'}"></a>
          <span style="font-size: 16px;">全选</span>
          <div class="selectAll">
            合计：
            <span class="totalPrice">{{allGoodsPrice | priceFormat}}</span>
          </div>
        </div>
        <div class="tabBarRight">
          <!-- <router-link tag="a" class="pay" :to="{path: '/order'}">去结算({{selectedGoodsNum}})</router-link> -->
          <a class="pay" @click="toPay">去支付</a>
        </div>
      </div>
    </div>
  </div>
  <SelectLogin v-else />
</template>

<script>
import { Dialog, Toast } from 'vant';
import { mapState, mapMutations } from 'vuex'
import { changeCartNum, removeCartData, singleGoodsSelected, allGoodsSelected } from '@/service/api'

import SelectLogin from '@/components/selectLogin/SelectLogin'

export default {
  components: { SelectLogin },
  computed: {
    ...mapState(['shopCart', 'userInfo']),
    // 商品是否全选
    selsectAll() {
      let flag = Object.values(this.shopCart).length > 0

      Object.values(this.shopCart).forEach(item => {
        if(!item.checked) {
          flag = false
        }
      })

      return flag
    },
    // 计算商品总价格
    allGoodsPrice() {
      let total = 0

      Object.values(this.shopCart).forEach(item => {
        if(item.checked) {
          total += item.price * item.num
        }
      })
      return total
    },
    // 计算已选中的商品类型个数
    selectedGoodsNum() {
      let goodsNum = 0
      Object.values(this.shopCart).forEach(item => {
        if(item.checked) {
          goodsNum += 1
        }
      })
      return goodsNum
    }
  },
  methods: {
    ...mapMutations(['REDUCE_CART', 'ADD_GOODS', 'SELECTED_SINGLE_GOODS', 'SELECTED_ALL_GOODS', 'CLEAR_CART']),
    // 减少商品，当商品数量少于1时则删除
    async reduceGoodsNum(id, num) {
      if(num > 1) {
        let res = await changeCartNum(this.userInfo.token, id, 'reduce')
        if(res.success_code === 200) {
          this.REDUCE_CART({ goodsId: id })
        } else  {
          Toast({
            message: '修改失败，服务器可能开了点小差~~~',
            duration: 800
          })
        }
      } else if(num === 1) {
        Dialog.confirm({
        title: '温馨提示',
        message: '确认删除该商品',
        }).then(async () => {
          let res = await changeCartNum(this.userInfo.token, id, 'reduce')
          if(res.success_code === 200) {
            this.REDUCE_CART({ goodsId: id })
          } else  {
            Toast({
            message: '修改失败，服务器可能开了点小差~~~',
            duration: 800
          })
        }
        }).catch(() => {
          // do noting
        });
      }
    },
    // 添加商品数量
    async addToCart(id) {
      let res = await changeCartNum(this.userInfo.token, id, 'add')
        if(res.success_code === 200) {
          this.ADD_GOODS({ goodsId: id })
        } else  {
          Toast({
            message: '修改失败，服务器可能开了点小差~~~',
            duration: 800
          })
        }
    },
    // 单个商品是否选中
    async selectedSingleGoods(id) {
      let res = await singleGoodsSelected(this.userInfo.token, id)
      // console.log(res);
      if(res.success_code === 200) {
        this.SELECTED_SINGLE_GOODS({ goodsId: id })
      }
    },
    // 商品的全选和取消
    async selectedAllGoods(isSelectedAll) {
      // console.log(isSelectedAll);
      let res = await allGoodsSelected(this.userInfo.token, isSelectedAll)
      console.log(res);
      if(res.success_code === 200) {
        this.SELECTED_ALL_GOODS({ isSelectedAll })
      }
      
    },
    // 清空购物车
    clearCart() {
      Dialog.confirm({
        title: '温馨提示',
        message: '确认删除所有商品吗',
        }).then(async () => {
          let res = await removeCartData(this.userInfo.token)
          if(res.success_code === 200) {
            this.CLEAR_CART()
          } else  {
            Toast({
              message: '清空失败，服务器可能开了点小差~~~',
              duration: 800
            })
          }
        }).catch(() => {
          // do noting
        });
    },
    // 去支付
    toPay() {
      if(this.allGoodsPrice > 0) {
        this.$router.push({
          path: '/order',
          query: {
            selectedGoodsPrice: this.allGoodsPrice,
            selectedGoodsNum: this.selectedGoodsNum
          }
        })
      } else {
        Toast({
          message: '尚未选择商品哟~~~',
          duration: 1000
        })
      }
    }
  }
};
</script>

<style scoped>
#cart {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.titleWrapper {
  width: 100%;
  height: 2.6rem;
  background: #fff;
  -webkit-background-size: 0.1rem 4.4rem;
  background-size: 0.1rem 4.4rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.titleWrapper button {
  position: absolute;
  right: 0.3rem;
  background: transparent;
  font-size: 0.8rem;
  color: red;
}

.contentWrapper {
  padding-top: 3.5rem;
}

/*列表内容*/
.contentWrapperList {
  padding-bottom: 6rem;
}

.contentWrapperList section {
  background-color: #fff;
}

.cartCheckBox {
  -webkit-background-size: 2.5rem 5rem;
  background-size: 2.5rem 5rem;
  width: 1rem;
  height: 1rem;
}

.cartCheckBox[checked] {
  background-position: -1.2rem 0;
}

.shopCartListCon {
  display: flex;
  height: 6rem;
  border-bottom: 0.01rem solid #e0e0e0;
  margin-bottom: 0.7rem;
  padding: 0.5rem 0;
}

.shopCartListCon .left {
  /*background: purple;*/
  flex: 1;
  display: flex;
  /*justify-content: center;*/
}

.shopCartListCon .left a {
  display: inline-block;
  margin-top: 0.8rem;
  margin-left: 0.5rem;
}

.shopCartListCon .center {
  /*background: blue;*/
  flex: 3;
}

.shopCartListCon .center img {
  width: 100%;
  height: 100%;
}

.shopCartListCon .right {
  /*background: orangered;*/
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  position: relative;
}

.shopCartListCon .right a {
  height: 2.2rem;
  line-height: 1.2rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  color: #000;
}

.shopCartListCon .bottomContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.shopCartListCon .bottomContent .shopPrice {
  font-size: 0.8rem;
}

.shopCartListCon .right .shopDeal span {
  display: inline-block;
  width: 1rem;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  float: left;
}

.shopCartListCon .right .shopDeal input {
  float: left;
  width: 2rem;
  height: 1.2rem;
  text-align: center;
  margin: 0 0.2rem;
  font-size: 0.8rem;
}

/*底部通栏*/
.tabBar {
  position: fixed;
  left: 0;
  bottom: 2.7rem;
  width: 100%;
  height: 2.5rem;
  background-color: #fff;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.01rem solid #e0e0e0;
}

.tabBarLeft {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.tabBarLeft .selectAll {
  margin-left: 1rem;
  font-size: 1rem;
}

.totalPrice {
  color: #e9232c;
}

.tabBarRight .pay {
  width: 5rem;
  height: 2rem;
  background-color: #e9232c;
  border-radius: 1rem;
  margin-right: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #fff;
}
</style>