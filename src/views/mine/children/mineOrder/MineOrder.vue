<template>
  <div id="mineOrder">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />

    <van-tabs v-model="active" animated style="margin-top: 2.6rem" color="#75a423" title-active-color="#75a423">
      <van-tab title="全部">内容 1</van-tab>
      <van-tab title="待支付">内容 2</van-tab>
      <van-tab title="已支付">内容 3</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 2,
    };
  },
};
</script>

<style scoped>
#mineOrder {
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