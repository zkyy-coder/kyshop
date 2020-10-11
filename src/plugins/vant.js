import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant'
import { Loading } from 'vant'
import { Image as VanImage } from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { NavBar } from 'vant';
import { ContactCard } from 'vant';
import { AddressList } from 'vant';
import { AddressEdit } from 'vant';
import { Cell, CellGroup } from 'vant';
import { SubmitBar } from 'vant';
import { Grid, GridItem } from 'vant';
import { Area } from 'vant';
import { DatetimePicker } from 'vant';
import { Popup } from 'vant';
import { Card } from 'vant';
import { Tab, Tabs } from 'vant';
import { Search } from 'vant';

// 引入Search搜索
Vue.use(Search);

// 引入标签页
Vue.use(Tab);
Vue.use(Tabs);

// 引入商品卡片
Vue.use(Card);

// 引入弹出层
Vue.use(Popup);

// 引入时间选择
Vue.use(DatetimePicker);

// 引入省市区选择
Vue.use(Area);

// 引入宫格
Vue.use(Grid);
Vue.use(GridItem);

// 引用提交订单
Vue.use(SubmitBar);

// 引用单元格
Vue.use(Cell);
Vue.use(CellGroup);

// 引用底部Tabbar
Vue.use(Tabbar);
Vue.use(TabbarItem);

// 引用加载loading
Vue.use(Loading);

// 引用图片懒加载
Vue.use(VanImage);

// 引用轻提示
Vue.use(Toast)

// 引用弹出框
Vue.use(Dialog);

// 引用导航栏
Vue.use(NavBar);

// 引用联系人
Vue.use(ContactCard);

// 引用地址列表
Vue.use(AddressList);

// 引用地址编辑
Vue.use(AddressEdit);
