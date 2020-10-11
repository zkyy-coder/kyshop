<template>
  <div id="user-center">
    <!-- 导航栏 -->
    <van-nav-bar
      title="用户中心"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />
    <button @click.prevent="userLoginOut">退出登录</button>
  </div>
</template>

<script>
import { userLoginOut } from "@/service/api";
import { Toast, Dialog } from "vant";
import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations(["DELECT_USER_INFO", "CLEAR_CART"]),
    // 退出登录
    async userLoginOut() {
      let res = await userLoginOut();

      Dialog.confirm({
        title: "温馨提示",
        message: "确认退出登录吗？",
      })
        .then(() => {
          if (res.success_code === 200) {
            this.$router.back();
            // 清空本地用户信息
            this.DELECT_USER_INFO();
            // 清空本地购物车信息
            this.CLEAR_CART();
            // 消息提示
            Toast({
              message: "退出登录成功",
              duration: 800,
            });
          }
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style scoped>
#user-center {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 200;
}

button {
  width: 100%;
  height: 2.5rem;
  margin-top: 4rem;
  background-color: #fff;
}
</style>