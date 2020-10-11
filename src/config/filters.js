import Vue from 'vue'

Vue.filter('priceFormat', (value) => {
  return '￥' + Number(value).toFixed(2)
})