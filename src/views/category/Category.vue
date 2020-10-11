<template>
  <div id="category">
    <!-- 头部 -->
    <Header />
    <!-- 内容 -->
    <div class="content" v-if="!showLoading">
      <!-- 左侧滚动栏 -->
      <div class="leftContent">
        <ul class="wrapper">
          <li
            class="categoryItem"
            v-for="(item,index) in categoriesData"
            :key="item._id"
            :class="{selected: currentIndex === index}"
            @click="clickLeftLi(index)"
            ref="meunList"
          >
            <span class="textWrapper">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右侧商品栏 -->
      <ContentView :categoriesDetailData="categoriesDetailData" />
    </div>
    <van-loading
      style="position: absolute;left: 50%;top: 40%;transform: translate(-50%);"
      v-else
      type="spinner"
      color="#75a342"
    >正在拼命加载中……</van-loading>
  </div>
</template>

<script>
import Header from "./components/header/Header";
import ContentView from "./components/contentView/ContentView";

import PubSub from "pubsub-js";
import BScroll from "better-scroll";
import { Toast } from 'vant'

import { getCategories, getCategoriesDetail, addGoodsToCart } from "@/service/api";
import { mapState, mapMutations } from 'vuex'

export default {
  components: { Header, ContentView },
  data() {
    return {
      // 是否显示loading
      showLoading: true,
      // 左侧数据
      categoriesData: [],
      // 右侧数据
      categoriesDetailData: [],
      // 被选中的左侧导航栏
      currentIndex: 0,
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    // 订阅消息（添加到购物车）
    PubSub.subscribe("categoryAddToCart", (msg, goods) => {
      if (msg === "categoryAddToCart") {
        console.log(goods);
        if (this.userInfo.token) {
          this.dealGoodsAdd(goods);
        } else {
          this.$router.push("/login");
        }
      }
      
      Toast({
        message: "添加购物车成功！",
        duration: 800,
      });
    });
  },
  beforeDestroy() {
    // 取消订阅，防止多次调用
    PubSub.subscribe('categoryAddToCart')
  },
  methods: {
    ...mapMutations(['ADD_GOODS']),
    // 获取商品数据
    async initData() {
      // 获取左侧数据
      const leftRes = await getCategories();
      // console.log(leftRes);
      if (leftRes.success_code === 200) {
        this.categoriesData = leftRes.data.data;
      }
      
      // 获取右侧数据
      const rightRes = await getCategoriesDetail(`/ky001`);
      // console.log(rightRes);
      if (rightRes.success_code === 200) {
        this.categoriesDetailData = rightRes.data.cate;
      }
      
      // 拿到数据，取消loading
      this.showLoading = false;

      // 初始化滚动框架
      this.$nextTick(() => {
        this.leftScroll = new BScroll(".leftContent", {
          probeType: 3,
        });
      });
    },
    // 监听左侧导航条的点击
    async clickLeftLi(index) {
      // 改变索引
      this.currentIndex = index;

      // 滚到对应的元素位置
      const meunList = this.$refs.meunList;
      const el = meunList[index];
      this.leftScroll.scrollToElement(el, 300);

      // 获取右侧数据
      const rightRes = await getCategoriesDetail(`/ky00${index + 1}`);
      if (rightRes.success_code === 200) {
        this.categoriesDetailData = rightRes.data.cate;
      }
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
  }
};
</script>

<style scoped>
#category {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

.content {
  display: flex;
  position: absolute;
  top: 2.8rem;
  bottom: 3rem;
  width: 100%;
  overflow: hidden;
}

.leftContent {
  background-color: #f4f4f4;
  width: 5.3125rem;
  flex: 0 0 5.3125rem;
}

.categoryItem {
  padding: 0.75rem 0;
  border-bottom: solid 1px #e8e9e8;
  position: relative;
}

.categoryItem .textWrapper {
  line-height: 1.25rem;
  border-left: solid 0.1875rem transparent;
  padding: 0.3125rem 0.6875rem;
  font-size: 0.8125rem;
  color: #666666;
}

.categoryItem.selected {
  background: #fff;
}

.categoryItem.selected .textWrapper {
  border-left-color: #3cb963;
  font-weight: bold;
  font-size: 0.875rem;
  color: #333333;
}

@media (min-width: 960px) {
  .wrapper {
    border-right: 1px solid #e8e9e8;
  }

  .wrapper .categoryItem {
    background: #fff;
  }
}
</style>