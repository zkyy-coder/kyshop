<template>
  <div class="wrapper emptyWrapper">
    <div v-for="item in categoriesDetailData" :key="item.id">
      <div class="categoryTitle" style="top: 0">{{item.name}}</div>
      <ProductItem :products="item.products" />
    </div>
  </div>
</template>

<script>
  import ProductItem from './ProductItem'

  export default {
    components: { ProductItem },
    props: {
      categoriesDetailData: Array
    },
    data() {
      return {};
    },
  };
</script>

<style scoped>
.wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}

.wrapper {
  position: absolute;
  left: 5.3125rem;
  right: 0;
  bottom: 0;
  top: 0;
  background: #fff;
}

.categoryTitle {
  padding: 0 0.3125rem;
  height: 1.25rem;
  line-height: 1.25rem;
  font-size: 0.75rem;
  background: #f8f8f8;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>