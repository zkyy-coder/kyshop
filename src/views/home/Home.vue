<template>
  <div id="home" ref="home">
    <div class="content">
      <div v-if="!showLoading">
        <!-- 轮播图 -->
        <Swiper :banners="banners" />
        <!-- 导航条 -->
        <Nav :nav_list="nav_list" />
        <!-- 秒杀 -->
        <FlashSale :flash_sale_list="flash_sale_list" />
        <!-- 猜你喜欢 -->
        <YouLike :you_like_list="you_like_list" />
      </div>
      <van-loading
        style="
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translate(-50%);
        "
        v-else
        type="spinner"
        color="#75a342"
        >正在拼命加载中……</van-loading
      >
    </div>
    <!-- 首页头部 -->
    <Header />
    <!-- 返回顶部 -->
    <MarkPage v-if="showBackTop" :scrollToTop="scrollToTop" />
  </div>
</template>

<script>
import { getHomeData, addGoodsToCart } from "@/service/api";
import { mapState, mapMutations } from "vuex";

import PubSub from "pubsub-js";
import { Toast } from "vant";
import BScroll from "better-scroll";

import Header from "./components/header/Header";
import Swiper from "./components/swiper/Swiper";
import Nav from "./components/nav/Nav";
import FlashSale from "./components/flashSale/FlashSale";
import YouLike from "./components/youLike/YouLike";
import MarkPage from "./components/markPage/MarkPage";

export default {
  components: { Header, Swiper, Nav, FlashSale, YouLike, MarkPage },
  data() {
    return {
      // 轮播图数据
      banners: [],
      // 导航数据
      nav_list: [],
      // 秒杀数据
      flash_sale_list: [],
      // 猜你喜欢数据
      you_like_list: [],
      // 是否显示loading
      showLoading: true,
      // 是否显示返回顶部按钮
      showBackTop: false,
      // 滚动对象
      scroll: null,
    };
  },
  created() {
    this._getHomeData();
  },
  mounted() {
    // 订阅消息（添加到购物车）
    PubSub.subscribe("homeAddToCart", (msg, goods) => {
      if (msg === "homeAddToCart") {
        if (this.userInfo.token) {
          this.dealGoodsAdd(goods);
        } else {
          this.$router.push("/login");
        }
      }
    });
  },
  beforeDestroy() {
    // 取消订阅，防止多次调用
    PubSub.unsubscribe("homeAddToCart");
  },
  methods: {
    // 获取添加到购物车的函数
    ...mapMutations(["ADD_GOODS"]),
    // 获取首页数据
    async _getHomeData() {
      const res = await getHomeData();
      // console.log(res);
      if (res.success_code === 200) {
        this.banners = res.data.list[0].icon_list;
        this.nav_list = res.data.list[1].icon_list;
        this.flash_sale_list = res.data.list[2].product_list;
        this.you_like_list = res.data.list[3].product_list;
        
        // 拿到数据取消loading
        this.showLoading = false;

        // 拿到数据开启BScroll
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.home, {
            probeType: 3,
            bounce: false,
          });

          // 滚动的实时位置
          this.scroll.on("scroll", (position) => {
            // console.log(position);
            this.backTop(position);
          });
        });
      }
    },
    // 滚动距离超过4000显示返回顶部按钮
    backTop(position) {
      this.showBackTop = -position.y > 4000
    },
    // 点击返回顶部
    scrollToTop() {
      this.scroll && this.scroll.scrollTo(0, 0, 300);
    },
    // 商品添加到购物车
    async dealGoodsAdd(goods) {
      let res = await addGoodsToCart(
        this.userInfo.token,
        goods._id,
        goods.name,
        goods.price,
        goods.small_image
      );

      if (res.success_code === 200) {
        this.ADD_GOODS({
          goodsId: goods._id,
          goodsName: goods.name,
          smallImage: goods.small_image,
          goodsPrice: goods.price,
        });
        // 提示添加到购物车成功
        Toast({
          message: "添加购物车成功！",
          duration: 800,
        });
      }
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
};
</script>

<style lang='less' scoped>
#home {
  overflow: hidden;

  position: absolute;
  top: 2.6rem;
  left: 0;
  right: 0;
  bottom: 3rem;
}
</style>