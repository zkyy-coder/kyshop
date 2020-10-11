<template>
  <swiper id="swiper" :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="item in banners" :key="item.public_id">
      <img :src="item.icon_url" :alt="item.public_name">
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    components: { swiper, swiperSlide },
    data() {
      return {
        swiperOption: {
          // 分页
          pagination: {
            el: '.swiper-pagination'
          },
          // 循环
          loop: true,
          // 切换
          autoplay: {
            delay: 3000,
            disableOnInteraction:false
          },
          // 速度
          speed: 600
        }
      }
    },
    props: {
      banners: Array
    }
  }
</script>

<style scoped>
  #swiper {
    width: 100%;
    height: 14rem;
  }
  #swiper img {
    width: 100%;
    height: 100%;
  }
  #swiper >>> .swiper-pagination-bullet-active {
    background: #75a342 !important;
  }
</style>