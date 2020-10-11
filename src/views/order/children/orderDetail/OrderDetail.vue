<template>
  <div id="orderDetail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 订单中的商品列表 -->
    <van-cell-group style="margin-top: 3rem">
      <van-cell title="商品" :value="`共${selectedGoodsNum}件`" />
    </van-cell-group>
    <van-card
      v-for="goods in selectedGoods"
      :key="goods.id"
      :num="goods.num"
      :price="goods.price"
      :title="goods.name"
      :thumb="goods.small_image"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["shopCart"]),
    // 返回被选中的商品
    selectedGoods() {
      let shopCart = [];
      Object.values(this.shopCart).forEach((goods) => {
        if (goods.checked) {
          shopCart.push(goods);
        }
      });

      return shopCart;
    },
    // 返回被选中的商品的个数
    selectedGoodsNum() {
      return this.selectedGoods.length;
    },
  },
};
</script>

<style scoped>
#orderDetail {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>