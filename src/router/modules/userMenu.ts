const userRoutes = [
	{
		path: "userInfo",
		name: "userInfo",
		layout: true,
		component: () => import("/@/views/user/userInfo/index.vue"),
		meta: {
			title: "个人信息",
			idx: 1,
			icon: "user_info",
		},
	},
	{
		path: "deposit",
		name: "deposit",
		layout: true,
		component: () => import("/@/views/user/deposit/index.vue"),
		meta: {
			title: "充值",
			idx: 1,
			icon: "deposit",
		},
	},
	{
		path: "withdraw",
		name: "withdraw",
		layout: true,
		component: () => import("/@/views/user/withdraw/index.vue"),
		meta: {
			title: "提现",
			idx: 1,
			icon: "withdraw",
		},
	},
	{
		path: "vip",
		name: "vip",
		layout: true,
		component: () => import("/@/views/user/vip/vip.vue"),
		meta: {
			title: "VIP俱乐部",
			idx: 1,
			icon: "vip",
		},
	},
	{
		path: "transaction_history",
		name: "transaction_history",
		layout: true,
		component: () => import("/@/views/user/transaction_history/index.vue"),
		meta: {
			title: "交易记录",
			idx: 1,
			icon: "transaction_history",
		},
	},
	{
		path: "bet_records",
		name: "bet_records",
		layout: true,
		component: () => import("/@/views/user/bet_records/index.vue"),
		meta: {
			title: "投注记录",
			idx: 1,
			icon: "bet_records",
		},
	},
	{
		path: "security_center",
		name: "security_center",
		layout: true,
		component: () => import("/@/views/user/security_center/index.vue"),
		meta: {
			title: "安全中心",
			idx: 1,
			icon: "security_center",
			showFooter: true,
		},
	},
	{
		path: "invite_friends",
		name: "invite_friends",
		layout: true,
		component: () => import("/@/views/user/invite_friends/index.vue"),
		meta: {
			title: "邀请好友",
			idx: 1,
			icon: "invite_friends",
		},
	},
	{
		path: "league",
		name: "league",
		layout: true,
		component: () => import("/@/views/user/league/index.vue"),
		meta: {
			title: "联盟计划",
			idx: 1,
			icon: "league",
		},
	},
	{
		path: "feedback",
		name: "feedback",
		layout: true,
		component: () => import("/@/views/user/feedback/index.vue"),
		meta: {
			title: "意见反馈",
			idx: 1,
			icon: "feedback",
		},
	},
];

export default userRoutes;
