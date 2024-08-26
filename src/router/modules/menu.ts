// // 1 号布局
// import layout1 from "/@/layout/layout1/layout1.vue";

/**
 * @description 左侧菜单
 */
const menu = {
	path: "/menu",
	name: "menu",
	component: () => import("/@/layout/layout1/layout1.vue"),
	redirect: "/menu/casino",
	children: [
		{
			path: "/menu/favorites",
			name: "favorites",
			component: () => import("/@/views/menu/favorites/favorites.vue"),
			meta: {
				title: `menu['收藏夹']`,
				activeIcon: "favorites_active",
				inactivated: "favorites_inactivated",
			},
		},
		{
			path: "/menu/recentlyViewed",
			name: "recentlyViewed",
			component: () => import("/@/views/menu/recentlyViewed/recentlyViewed.vue"),
			meta: {
				title: `menu['最近浏览']`,
				activeIcon: "recentlyViewed_active",
				inactivated: "recentlyViewed_inactivated",
			},
		},
		{
			path: "/menu/recommendedYou",
			name: "recommendedYou",
			component: () => import("/@/views/menu/recommendedYou/recommendedYou.vue"),
			meta: {
				title: `menu['为你推荐']`,
				activeIcon: "recommendedYou_active",
				inactivated: "recommendedYou_inactivated",
			},
		},
		{
			path: "/menu/club",
			name: "club",
			component: () => import("/@/views/menu/club/club.vue"),
			meta: {
				title: `menu['VIP俱乐部']`,
				activeIcon: "club_active",
				inactivated: "club_inactivated",
			},
		},

		// {
		// 	path: "/menu/casino",
		// 	name: "CA",
		// 	redirect: "/menu/casino/topgames",
		// 	meta: {
		// 		title: `menu['赌场']`,
		// 		activeIcon: "casino_active",
		// 		inactivated: "casino_inactivated",
		// 	},
		// 	children: [
		// 		{
		// 			path: "/menu/casino/topgames",
		// 			name: "topgames",
		// 			component: () => import("/@/views/menu/casino/topgames/topgames.vue"),
		// 			meta: {
		// 				title: `menu['casino']['热门游戏']`,
		// 				activeIcon: "casino/topgames_active",
		// 				inactivated: "casino/topgames_inactivated",
		// 			},
		// 		},
		// 		{
		// 			path: "/menu/casino/slotmachine",
		// 			name: "slotmachine",
		// 			component: () => import("/@/views/menu/casino/slotmachine/slotmachine.vue"),
		// 			meta: {
		// 				title: `menu['casino']['老虎机']`,
		// 				activeIcon: "casino/slotmachine_active",
		// 				inactivated: "casino/slotmachine_inactivated",
		// 			},
		// 		},
		// 		{
		// 			path: "/menu/casino/electronicGames",
		// 			name: "electronicGames",
		// 			component: () => import("/@/views/menu/casino/electronicGames/electronicGames.vue"),
		// 			meta: {
		// 				title: `menu['casino']['电子游戏']`,
		// 				activeIcon: "casino/electronicGames_active",
		// 				inactivated: "casino/electronicGames_inactivated",
		// 			},
		// 		},

		// 		{
		// 			path: "/menu/casino/supplier",
		// 			name: "supplier",
		// 			component: () => import("/@/views/menu/casino/supplier/supplier.vue"),
		// 			meta: {
		// 				title: `menu['casino']['游戏提供商']`,
		// 				activeIcon: "casino/electronicGames_active",
		// 				inactivated: "casino/electronicGames_inactivated",
		// 			},
		// 		},
		// 		{
		// 			path: "/menu/casino/supplierDetail/:detail?",
		// 			name: "supplierDetail",
		// 			component: () => import("/@/views/menu/casino/supplierDetail/supplierDetail.vue"),
		// 			meta: {
		// 				title: `menu['casino']['游戏提供商详细']`,
		// 				activeIcon: "casino/electronicGames_active",
		// 				inactivated: "casino/electronicGames_inactivated",
		// 				isHide: true,
		// 			},
		// 		},
		// 	],
		// },
		// {
		// 	path: "/menu/sports",
		// 	name: "PE",
		// 	component: () => import("/@/views/menu/sports/sports.vue"),
		// 	meta: {
		// 		title: `menu['体育']`,
		// 		activeIcon: "sports_active",
		// 		inactivated: "sports_inactivated",
		// 	},
		// },
		// {
		// 	path: "/menu/lottery",
		// 	name: "LT",
		// 	component: () => import("/@/views/menu/lottery/lottery.vue"),
		// 	meta: {
		// 		title: `menu['彩票']`,
		// 		activeIcon: "lottery_active",
		// 		inactivated: "lottery_inactivated",
		// 	},
		// },
		// {
		//     path: '/menu/casino/supplierDetail/:detail?',
		//     name: 'supplierDetail',
		//     component: () => import('/@/views/menu/casino/supplierDetail/supplierDetail.vue'),
		//     meta: {
		//         title: `menu['casino']['游戏提供商详细']`,
		//         activeIcon: 'casino/electronicGames_active',
		//         inactivated: 'casino/electronicGames_inactivated',
		//         isHide: true,
		//     },
		// },
		{
			path: "/menu/specialOffer",
			name: "specialOffer",
			redirect: "/menu/specialOffer/salesPromotion",
			meta: {
				title: `menu['优惠活动']`,
				activeIcon: "specialOffer_active",
				inactivated: "specialOffer_inactivated",
			},
			children: [
				{
					path: "/menu/specialOffer/salesPromotion",
					name: "salesPromotion",
					component: () => import("/@/views/menu/specialOffer/salesPromotion.vue"),
					meta: {
						title: `menu['specialOffer']['促销活动']`,
						activeIcon: "specialOffer/salesPromotion_active",
						inactivated: "specialOffer/salesPromotion_inactivated",
					},
				},
				{
					path: "/menu/specialOffer/competition",
					name: "competition",
					component: () => import("/@/views/frontPage/competition/competition.vue"),
					meta: {
						title: `menu['specialOffer']['每日竞赛']`,
						activeIcon: "specialOffer/competition_active",
						inactivated: "specialOffer/competition_inactivated",
					},
				},
				{
					path: "/menu/specialOffer/alliance",
					name: "alliance",
					component: () => import("/@/views/menu/alliance/alliance.vue"),
					meta: {
						title: `menu['specialOffer']['联盟计划']`,
						activeIcon: "specialOffer/alliance_active",
						inactivated: "specialOffer/alliance_inactivated",
					},
				},
			],
		},
	],
};

export default menu;
