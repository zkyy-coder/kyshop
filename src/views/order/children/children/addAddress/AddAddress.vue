<template>
  <div id="addAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="添加地址"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-address-edit
      style="margin-top: 3rem"
      :area-list="areaList"
      show-postal
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script>
import areaList from "@/config/area.js";
import { Toast } from "vant";
import { addUserAddress } from "@/service/api";
import { mapState } from "vuex";
import PubSub from "pubsub-js";

export default {
  data() {
    return {
      areaList,
      searchResult: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    async onSave(context) {
      let res = await addUserAddress(
        this.userInfo.token,
        context.name,
        context.tel,
        context.province + context.city + context.county,
        context.addressDetail,
        context.postalCode,
        context.isDefault,
        context.province,
        context.city,
        context.county,
        context.areaCode
      );
      
      if (res.success_code === 200) {
        Toast({
          message: "添加地址成功",
          duration: 800,
        });
        // 返回上一页面
        this.$router.back();
        // 发布订阅
        PubSub.publish('addOrEditAddressSuccess')
      } else {
        Toast({
          message: "添加地址失败，可能服务器出了点小差~~~",
          duration: 1000,
        });
      }
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区",
          },
        ];
      } else {
        this.searchResult = [];
      }
    },
  },
};
</script>

<style scoped>
#addAddress {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>