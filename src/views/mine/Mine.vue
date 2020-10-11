<template>
  <div id="mine" v-if="userInfo.token">
    <!-- 导航栏 -->
    <van-nav-bar title="我的" :fixed="true" :border="false" />

    <!-- 用户基础信息 -->
    <van-cell-group class="personMsg" style="margin-top: 2.5rem" @click="$router.push('/dashboard/mine/userCenter')">
      <van-cell :center="true">
        <template #title>
          <div class="person">
            <img :src="userInfo.icon_url" />
            <div class="info">
              <span>{{userInfo.real_name}}</span>
              <span>电话：{{userInfo.phone}}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 查看订单 -->
    <van-cell-group @click="$router.push('/dashboard/mine/mineOrder')">
      <van-cell title="我的订单" icon="label" value="查看所有订单" is-link />
    </van-cell-group>

    <van-grid :column-num="4" style="margin-top: 0.2rem">
      <van-grid-item
        v-for="(item, index) in orderGridData"
        :key="index"
        :icon="item.icon"
        :text="item.text"
      />
    </van-grid>

    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="我的优惠劵" icon="gold-coin" value="1张" is-link />
      <van-cell title="我的收货地址" icon="column" is-link />
    </van-cell-group>

    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="联系客服" icon="phone" value="客服时间7:00-22:00" is-link />
      <van-cell title="意见反馈" icon="smile-comment" is-link />
    </van-cell-group>

    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="zkyy商城" icon="gem" value="下载app体验更佳" is-link />
    </van-cell-group>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
  <SelectLogin v-else />
</template>

<script>
  import { mapState } from 'vuex'
  import SelectLogin from '@/components/selectLogin/SelectLogin'

  export default {
    components: { SelectLogin },
    data() {
      return {
        orderGridData: [
          { icon: "cart-circle-o", text: "待支付" },
          { icon: "gift-o", text: "待收货" },
          { icon: "smile-comment-o", text: "待评价" },
          { icon: "cash-back-record", text: "售后/退款" },
        ],
      };
    },
    computed: {
      ...mapState(['userInfo']),
    }
  };
</script>

<style scoped>
#mine {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.van-nav-bar--fixed {
  background-color: #3bba63;
}

#mine >>> .van-nav-bar__title {
  color: #fff;
}

.personMsg .van-cell {
  background: #3bba63;
}

.person {
  display: flex;
  align-items: center;
}

.person > img {
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
  border: 0.1rem solid #fff;
}

.person > .info {
  display: flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  margin-left: 0.8rem;
  color: #fff;
}

.van-cell__left-icon {
  color: orangered;
  font-size: 1.2rem;
}.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-leave-to {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>