<template>
  <div id="myAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的地址"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 地址列表 -->
    <van-address-list
      style="margin-top: 2.5rem"
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select="backToOrder"
    />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from 'vuex'
import { getUserAddress } from '@/service/api'
import PubSub from "pubsub-js";

export default {
  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  mounted() {
    this._getUserAddress()
    // 订阅消息
    PubSub.subscribe('addOrEditAddressSuccess', msg => {
      if(msg === 'addOrEditAddressSuccess') {
        this._getUserAddress()
      }
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe('addOrEditAddressSuccess')
  },
  methods: {
    // 跳转至天价地址页面
    onAdd() {
      this.$router.push('/order/myAddress/addAddress')
    },
    // 跳转至修改地址页面
    onEdit(address) {
      this.$router.push({
        path: '/order/myAddress/editAddress',
        query: {
          user_id: address.user_id,
          address_id: address.id
        }
      })
    },
    // 获取当前用户收货地址
    async _getUserAddress() {
      let res = await getUserAddress(this.userInfo.token)
      if(res.success_code === 200) {
        let addressList = res.data
        this.list = []
        addressList.forEach(address => {
          let i = {
            id: address._id,
            name: address.address_name,
            tel: address.address_phone,
            address: address.address_area + address.address_area_detail,
            isDefault: true,
            user_id: address.user_id
          }
          this.list.push(i)
        });
      } else {
        Toast({
          message: '获取地址失败，可能服务器出了点小差~~~',
          duration: 1000
        })
      }
    },
    // 返回至订单页面
    backToOrder(item) {
      // 发布订阅
      PubSub.publish('userAddress', item)

      this.$router.back()
    }
  },
};
</script>

<style scoped>
  #myAddress {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter, .fade-leave-leave-to {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>