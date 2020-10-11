import ajax from './ajax.js'

// 基础接口
const BASE_URL = '/api'

// 获取首页数据
export const getHomeData = () => ajax(BASE_URL + '/api/home')

// 获取分类数据
export const getCategories = () => ajax(BASE_URL + 'api/categories')

// 获取分类详情
export const getCategoriesDetail = (preParams) => ajax(BASE_URL + '/api/categoriesdetail' + preParams)

// 获取手机短信验证码
export const getPhoneVerifyCode = () => ajax(BASE_URL + '/api/send_code')

// 通过手机短信验证码登录
export const phoneCodeLogin = (phone, code) => ajax(BASE_URL + '/api/login_code', { phone, code }, 'POST')

// 通过用户名和密码登录
export const namePwdLogin = (user_name, user_pwd, captcha) => ajax(BASE_URL + '/api/login_pwd', { user_name, user_pwd, captcha }, 'POST')

// 用户自动登录
export const userAutoLogin = () => ajax(BASE_URL + '/api/userinfo')

// 用户退出
export const userLoginOut = () => ajax(BASE_URL + '/api/logout')

// 添加商品
export const addGoodsToCart = (user_id, goods_id, goods_name, goods_price, small_image) => ajax(BASE_URL + '/api/cart/add', { user_id, goods_id, goods_name, goods_price, small_image }, 'POST')

// 获取用户购物车中的数据
export const getCartData = (user_id) => ajax(BASE_URL + '/api/cart/search/' + user_id)

// 修改购物车商品数量
export const changeCartNum = (user_id, goods_id, type) => ajax(BASE_URL + '/api/cart/num', { user_id, goods_id, type }, 'POST')

// 删除用户购物车数据
export const removeCartData = (user_id) => ajax(BASE_URL + '/api/cart/clear/' + user_id)

// 获取当前用户收货地址
export const getUserAddress = (user_id) => ajax(BASE_URL + '/api/address/search/' + user_id)

// 添加用户收货地址
export const addUserAddress = (user_id, address_name, address_phone, address_area, address_area_detail,
  address_post_code, address_tag, province, city, county, areaCode) => ajax(BASE_URL + '/api/address/add', {
    user_id, address_name, address_phone, address_area, address_area_detail,
    address_post_code, address_tag, province, city, county, areaCode
  }, 'POST')

// 获取用户单条地址
export const getSingleUserAddress = (user_id, address_id) => ajax(BASE_URL + '/api/address/one', { user_id, address_id }, 'POST')

// 修改用户地址
export const changeUserAddress = (address_id, user_id, address_name, address_phone, address_area, address_area_detail,
  address_post_code, address_tag, province, city, county, areaCode) => ajax(BASE_URL + '/api/address/edit', {
    address_id, user_id, address_name, address_phone, address_area, address_area_detail,
    address_post_code, address_tag, province, city, county, areaCode
  }, 'POST')

// 删除用户地址
export const removeUserAddress = (address_id) => ajax(BASE_URL + '/api/address/del/' + address_id)

// 单个商品的选中和取消选中
export const singleGoodsSelected = (user_id, goods_id) => ajax(BASE_URL + '/api/cart/singer_select', {user_id, goods_id}, 'POST')

// 所有商品的选中和取消选中
export const allGoodsSelected = (user_id, flag) => ajax(BASE_URL + '/api/cart/all_select', {user_id, flag}, 'POST')

// 查询所有已经被选中的商品
export const queryAllSelectedGoods = (user_id) => ajax(BASE_URL + '/api/cart/selected/' + user_id)

// 删除已经生成订单的商品
export const removeOrderGoods = (user_id) => ajax(BASE_URL + '/api/cart/del_checked/' + user_id)

// 提交订单
export const submitOrder = (user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price) => ajax(BASE_URL + '/api/order/post', {user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price}, 'POST')

// 订单支付成功
export const successPayOrder = (user_id, order_id) => ajax(BASE_URL + '/api/order/change_status', {user_id, order_id}, 'POST')

// 查询订单
export const queryOrder = (user_id, status) => ajax(BASE_URL + '/api/order/get', {user_id, status}, 'POST')

