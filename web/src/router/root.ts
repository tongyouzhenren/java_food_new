import { loadView } from './loader';

/* ================= 用户中心 ================= */

const userCenterChildren = [
  { path: 'addressView', name: 'addressView', component: loadView('/@/views/index/user/address-view.vue'), meta: { title: '收货地址', icon: 'environment', permission: ['user'] } },
  { path: 'wishThingView', name: 'wishThingView', component: loadView('/@/views/index/user/wish-thing-view.vue'), meta: { title: '心愿单', icon: 'heart', permission: ['user'] } },
  { path: 'collectThingView', name: 'collectThingView', component: loadView('/@/views/index/user/collect-thing-view.vue'), meta: { title: '收藏夹', icon: 'star', permission: ['user'] } },
  { path: 'orderView', name: 'orderView', component: loadView('/@/views/index/user/order-view.vue'), meta: { title: '订单记录', icon: 'profile', permission: ['user'] } },
  { path: 'userInfoEditView', name: 'userInfoEditView', component: loadView('/@/views/index/user/userinfo-edit-view.vue'), meta: { title: '信息修改', icon: 'edit', permission: ['user'] } },
  { path: 'followView', name: 'followView', component: loadView('/@/views/index/user/follow-view.vue'), meta: { title: '我的关注', icon: 'team', permission: ['user'] } },
  { path: 'fansView', name: 'fansView', component: loadView('/@/views/index/user/fans-view.vue'), meta: { title: '我的粉丝', icon: 'smile', permission: ['user'] } },
  { path: 'scoreView', name: 'scoreView', component: loadView('/@/views/index/user/score-view.vue'), meta: { title: '积分成长', icon: 'rise', permission: ['user'] } },
  { path: 'commentView', name: 'commentView', component: loadView('/@/views/index/user/comment-view.vue'), meta: { title: '我的评论', icon: 'comment', permission: ['user'] } },
  { path: 'securityView', name: 'securityView', component: loadView('/@/views/index/user/security-view.vue'), meta: { title: '安全中心', icon: 'safety', permission: ['user'] } },
  { path: 'pushView', name: 'pushView', component: loadView('/@/views/index/user/push-view.vue'), meta: { title: '推送偏好', icon: 'notification', permission: ['user'] } },
  { path: 'messageView', name: 'messageView', component: loadView('/@/views/index/user/message-view.vue'), meta: { title: '站内消息', icon: 'mail', permission: ['user'] } },
];

/* ================= 前台 ================= */

const indexChildren = [
  { path: 'login', name: 'login', component: loadView('/@/views/index/login.vue'), meta: { title: '用户登录', icon: 'login', permission: ['guest'] } },
  { path: 'register', name: 'register', component: loadView('/@/views/index/register.vue'), meta: { title: '用户注册', icon: 'user-add', permission: ['guest'] } },
  { path: 'portal', name: 'portal', component: loadView('/@/views/index/portal.vue'), meta: { title: '首页推荐', icon: 'dashboard', permission: ['guest'] } },
  { path: 'detail', name: 'detail', component: loadView('/@/views/index/detail.vue'), meta: { title: '菜品详情', icon: 'info', permission: ['guest'] } },
  { path: 'confirm', name: 'confirm', component: loadView('/@/views/index/confirm.vue'), meta: { title: '下单确认', icon: 'shopping', permission: ['user'] } },
  { path: 'pay', name: 'pay', component: loadView('/@/views/index/pay.vue'), meta: { title: '支付订单', icon: 'credit-card', permission: ['user'] } },
  { path: 'search', name: 'search', component: loadView('/@/views/index/search.vue'), meta: { title: '菜品搜索', icon: 'search', permission: ['guest'] } },
  {
    path: 'usercenter',
    name: 'usercenter',
    redirect: '/index/usercenter/addressView',
    component: loadView('/@/views/index/usercenter.vue'),
    meta: { title: '个人中心', icon: 'user', permission: ['user'] },
    children: userCenterChildren,
  },
];

/* ================= 后台 ================= */

const adminChildren = [
  { path: 'dashboard', name: 'dashboard', component: loadView('/@/views/dashboard/index.vue'), meta: { title: '控制台', icon: 'dashboard', permission: ['admin'], layout: 'admin' } },
  { path: 'overview', name: 'overview', component: loadView('/@/views/admin/overview.vue'), meta: { title: '统计分析', icon: 'area-chart', permission: ['admin'], layout: 'admin' } },
  { path: 'order', name: 'order', component: loadView('/@/views/admin/order.vue'), meta: { title: '订单管理', icon: 'dollar', permission: ['admin'], layout: 'admin' } },
  { path: 'thing', name: 'thing', component: loadView('/@/views/admin/thing.vue'), meta: { title: '菜品管理', icon: 'database', permission: ['admin'], layout: 'admin' } },
  { path: 'comment', name: 'comment', component: loadView('/@/views/admin/comment.vue'), meta: { title: '评论管理', icon: 'comment', permission: ['admin'], layout: 'admin' } },
  { path: 'user', name: 'user', component: loadView('/@/views/admin/user.vue'), meta: { title: '用户管理', icon: 'user', permission: ['admin'], layout: 'admin' } },
  { path: 'classification', name: 'classification', component: loadView('/@/views/admin/classification.vue'), meta: { title: '分类管理', icon: 'appstore', permission: ['admin'], layout: 'admin' } },
  { path: 'tag', name: 'tag', component: loadView('/@/views/admin/tag.vue'), meta: { title: '标签管理', icon: 'tag', permission: ['admin'], layout: 'admin' } },
  { path: 'ad', name: 'ad', component: loadView('/@/views/admin/ad.vue'), meta: { title: '广告管理', icon: 'picture', permission: ['admin'], layout: 'admin' } },
  { path: 'notice', name: 'notice', component: loadView('/@/views/admin/notice.vue'), meta: { title: '通知公告', icon: 'notification', permission: ['admin'], layout: 'admin' } },
  { path: 'coupon', name: 'coupon', component: loadView('/@/views/admin/coupon.vue'), meta: { title: '优惠券', icon: 'gift', permission: ['admin'], layout: 'admin' } },
  { path: 'loginLog', name: 'loginLog', component: loadView('/@/views/admin/login-log.vue'), meta: { title: '登录日志', icon: 'file-search', permission: ['admin'], layout: 'admin' } },
  { path: 'opLog', name: 'opLog', component: loadView('/@/views/admin/op-log.vue'), meta: { title: '操作日志', icon: 'file-protect', permission: ['admin'], layout: 'admin' } },
  { path: 'errorLog', name: 'errorLog', component: loadView('/@/views/admin/error-log.vue'), meta: { title: '错误日志', icon: 'bug', permission: ['admin'], layout: 'admin' } },
  { path: 'sysInfo', name: 'sysInfo', component: loadView('/@/views/admin/sys-info.vue'), meta: { title: '系统信息', icon: 'info', permission: ['admin'], layout: 'admin' } },
];

/* ================= 常量路由 ================= */

const constantRouterMap = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    name: 'index',
    redirect: '/index/portal',
    component: loadView('/@/views/index/index.vue'),
    meta: { title: '前台门户', icon: 'home', permission: ['guest'] },
    children: indexChildren,
  },
  {
    path: '/adminLogin',
    name: 'adminLogin',
    component: loadView('/@/views/admin/admin-login.vue'),
    meta: { title: '后台登录', icon: 'login', permission: ['guest'] },
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/thing',
    component: loadView('/@/views/admin/main.vue'),
    meta: { title: '后台管理', icon: 'dashboard', permission: ['admin'], layout: 'admin' },
    children: adminChildren,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: loadView('/@/views/common/404.vue'),
    meta: { title: '页面不存在', icon: 'warning', permission: ['guest'] },
  },
];

export default constantRouterMap;
