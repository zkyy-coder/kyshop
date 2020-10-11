<template>
  <div class="nav">
    <van-grid icon-size="32" :column-num="5">
      <van-grid-item v-for="value in nav_list" :key="value.cid" :icon="value.icon_url" :text="value.name" />
    </van-grid>
  </div>
</template>

<script>
export default {
  props: {
    nav_list: Array,
  },
};
</script>

<style scoped>
.nav >>> .van-grid-item__text {
  width: 100%;
  height: 1.2rem;
  text-align: center;
  overflow: hidden;
}
</style>