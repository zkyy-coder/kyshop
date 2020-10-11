<template>
  <div id="order">
    <!-- 导航栏 -->
    <van-nav-bar
      title="确认订单"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 选择收货地址 -->
    <van-contact-card
      @click="$router.push('/order/myAddress')"
      style="margin-top: 3rem"
      :type="contactCardType"
      :name="user_name"
      :tel="user_phone"
      add-text="选择收货地址"
    />

    <!-- 被选择的收货地址 -->
    <van-cell-group style="margin-top: 0.5rem" class="address">
      <van-cell :center="true" title="收货地址" :value="address_area" />
    </van-cell-group>

    <van-cell-group style="margin-top: 0.5rem">
      <!-- 选择送达时间 -->
      <van-cell
        title="送达时间"
        :value="selectedDate"
        is-link
        @click="showPopup = true"
      />
      <!-- 收货商品 -->
      <van-cell
        :value="`共${$route.query.selectedGoodsNum}件`"
        is-link
        :center="true"
        @click="$router.push('/order/orderDetail')"
      >
        <template #title>
          <img
            v-for="item in threeGoods"
            :key="item.id"
            :src="item.small_image"
            style="width: 3rem"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 支付方式 -->
    <van-cell-group style="margin-top: 0.5rem">
      <van-cell title="支付方式" value="微信" is-link />
    </van-cell-group>

    <!-- 备注信息 -->
    <van-cell-group style="margin-top: 0.5rem">
      <van-cell title="备注">
        <input type="text" placeholder="如有需要，请填写" v-model="remarks" />
      </van-cell>
    </van-cell-group>

    <!-- 支付金额 -->
    <van-cell-group style="margin-top: 0.5rem">
      <van-cell
        title="商品金额"
        :value="`￥${Number($route.query.selectedGoodsPrice).toFixed(2)}`"
      />
      <van-cell title="配送费" :value="`￥${deliveryFee.toFixed(2)}`" />
    </van-cell-group>

    <!-- 提交订单 -->
    <van-submit-bar
      :price="(Number($route.query.selectedGoodsPrice) + deliveryFee) * 100"
      button-text="提交订单"
      @submit="onSubmit"
    />

    <!-- 时间选择 -->
    <van-popup v-model="showPopup" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="dateTimeConfirm"
        @cancel="showPopup = false"
      />
    </van-popup>

    <!-- 二维码 -->
    <van-popup v-model="showQRCode">
      <qriously :value="wechatCodeUrl" :size="200" />
    </van-popup>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
import moment from "moment";
import { mapState } from "vuex";
import { Toast } from "vant";
import {
  queryAllSelectedGoods,
  submitOrder,
  successPayOrder,
  removeOrderGoods
} from "@/service/api";

export default {
  data() {
    return {
      contactCardType: "add", // 卡片类型
      address_id: null, // 地址id
      address_area: null, // 收货地址
      user_id: null, // 用户id
      user_name: null, // 用户名
      user_phone: null, // 用户电话
      showPopup: false, // 显示时间选择器
      currentDate: new Date(), // 当前时间
      minDate: new Date(), // 显示的最小时间
      maxDate: new Date(moment().year(), moment().month() + 6, 1), // 显示的最大时间
      selectedDate: "请选择送达时间", // 送达时间
      remarks: '', // 备注
      deliveryFee: 2, // 配送费
      showQRCode: false , // 显示二维码
      wechatCodeUrl: '', // 微信二维码地址
    };
  },
  computed: {
    ...mapState(["userInfo", "shopCart"]),
    // 过滤所选商品，返回三个商品
    threeGoods() {
      let shopCart = [];
      Object.values(this.shopCart).forEach((goods) => {
        if (goods.checked) {
          shopCart.push(goods);
        }
      });
      return shopCart.splice(0, 3);
    },
  },
  mounted() {
    // 订阅消息（获取所选地址的信息）
    PubSub.subscribe("userAddress", (msg, info) => {
      if (msg === "userAddress") {
        this.contactCardType = "edit";
        this.address_id = info.id;
        this.address_area = info.address;
        this.user_id = info.user_id;
        this.user_name = info.name;
        this.user_phone = info.tel;
      }
    });
  },
  beforeDestroy() {
    PubSub.unsubscribe("userAddress");
  },
  methods: {
    // 时间选择器确认
    dateTimeConfirm(value) {
      this.showPopup = false;
      this.selectedDate = moment(value).format("YYYY-MM-DD HH:mm");
    },
    // 提交订单
    async onSubmit() {
      if (!this.address_id) {
        Toast({
          message: "请选择地址",
          duration: 500,
        });
        return;
      } else if (this.selectedDate === "请选择送达时间") {
        Toast({
          message: "请选择送达时间",
          duration: 500, 
        });
        return;
      } else {
        // 查询订单中的商品
        let selectedGoods = await queryAllSelectedGoods(this.userInfo.token)
        if(selectedGoods.success_code === 200) {
          // 提交订单
          let shop_price = Number(this.$route.query.selectedGoodsPrice)
          let order = await submitOrder(this.userInfo.token, this.address_id, this.selectedDate, selectedGoods.data, this.remarks, shop_price, this.deliveryFee)
          if(order.success_code === 200) {
            console.log(order);
            // 删除已经生成订单的商品
            let removeRes = await removeOrderGoods(this.userInfo.token)

            // 发起微信支付，总价暂时设置成1分钱
            this.wechatCodeUrl = 'wxp://f2f0KK6-_BOfY2KgKUYZRhYKZnMsaMTEhUkqkvuitS69EOI='
            this.showQRCode = true
            
            // 支付成功后,修改订单状态
            // await successPayOrder(this.userInfo.token, false)
          } else {
            Toast({
              message: "操作失败，可能服务器出了点小差～～～",
              duration: 500,
            });
          }
        } else {
          Toast({
            message: "操作失败，可能服务器出了点小差～～～",
            duration: 500,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
#order {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}

.address >>> .van-cell__value {
  text-align: left;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-leave-to {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>