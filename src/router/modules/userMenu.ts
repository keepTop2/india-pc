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
		path: "vip",
		name: "vip",
		layout: true,
		component: () => import("../../views/user/vip/index.vue"),
		meta: {
			title: "VIP俱乐部",
			idx: 1,
			icon: "vip",
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
