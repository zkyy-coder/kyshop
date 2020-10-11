import { SAVE_USER_INFO } from './mutations-type'
import { getStore } from '@/config/global.js'
import { userAutoLogin } from '../service/api'

export default {
  saveUserInfo({ commit }, userInfo) {
    commit(SAVE_USER_INFO, { userInfo })
  },

  async initUserInfo({ commit }) {
    let userInfo = JSON.parse(getStore('userInfo'))
    // console.log(userInfo)

    if(userInfo) {  // 本地存在用户信息则从本地获取
      commit(SAVE_USER_INFO, { userInfo })
    } else { // 本地不存在则从服务器获取
      let res = await userAutoLogin()
      // console.log(res);
      if(res.success_code === 200) {
        commit(SAVE_USER_INFO, {userInfo: res.data})
      }
    }
  }
}