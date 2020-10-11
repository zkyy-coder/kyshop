<template>
  <div id="editAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="编辑地址"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />
    <van-address-edit
      style="margin-top: 2.5rem"
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import areaList from "@/config/area.js";
import { Toast } from "vant";
import { PubSub } from 'pubsub-js'
import { getSingleUserAddress, changeUserAddress, removeUserAddress } from "@/service/api";

export default {
  data() {
    return {
      areaList,
      addressInfo: {},
    };
  },
  mounted() {
    this.getAddressInfo();
  },
  methods: {
    // 保存当前修改的信息
    async onSave(context) {
      let res = await changeUserAddress(
        this.$route.query.address_id,
        this.$route.query.user_id,
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
      
      if(res.success_code === 200) {
        Toast({
          message: '地址修改成功',
          duration: 500,
        })
        // 返回上一级页面
        this.$router.back()
        // 发布订阅
        PubSub.publish('addOrEditAddressSuccess')
      } else {
        Toast({
          message: '地址修改失败，可能服务器出了点小差~~~',
          duration: 1000,
        })
      }
    },
    // 删除当前地址
    async onDelete() {
      let res = await removeUserAddress(this.$route.query.address_id)

      if(res.success_code === 200) {
        Toast({
          message: '地址删除成功',
          duration: 500,
        })
         // 返回上一级页面
        this.$router.back()
        // 发布订阅
        PubSub.publish('addOrEditAddressSuccess')
      } else {
        Toast({
          message: '地址删除失败，可能服务器出了点小差~~~',
          duration: 1000,
        })
      }
    },
    // 获取当前地址的详细信息
    async getAddressInfo() {
      let res = await getSingleUserAddress(
        this.$route.query.user_id,
        this.$route.query.address_id
      );
      // console.log(res);
      if (res.success_code === 200) {
        this.addressInfo = {
          id: res.data._id,
          name: res.data.address_name,
          tel: res.data.address_phone,
          province: res.data.province,
          city: res.data.city,
          county: res.data.county,
          addressDetail: res.data.address_area_detail,
          areaCode: res.data.areaCode,
          postalCode: res.data.address_post_code,
          isDefault: res.data.address_tag,
        };
      } else {
        Toast({
          message: "自动获取地址失败",
          duration: 800,
        });
      }
    },
  },
};
</script>

<style scoped>
#editAddress {
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