// 1号布局
import wallet from "/@/views/wallet/wallet.vue";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;

//首页
const walletLayout = {
	path: "/wallet",
	name: "wallet",
	component: wallet,
	redirect: "/recharge",
	children: [
		{
			path: "/recharge",
			name: "recharge",
			component: () => import("/@/views/wallet/recharge/recharge.vue"),
			meta: {
				title: $.t("wallet['存款']"),
				icon: "recharge",
				active_icon: "recharge_active",
			},
		},
		{
			path: "/withdrawal",
			name: "withdrawal",
			component: () => import("/@/views/wallet/withdrawal/withdrawal.vue"),
			meta: {
				title: $.t("wallet['提款']"),
				icon: "withdrawal",
				active_icon: "withdrawal_active",
			},
		},
		{
			path: "/currencyConverter",
			name: "currencyConverter",
			component: () => import("/@/views/wallet/currencyConverter/currencyConverter.vue"),
			meta: {
				title: $.t("wallet['平台币转换']"),
				icon: "currencyConverter",
				active_icon: "currencyConverter_active",
			},
		},
		{
			path: "/transactionRecords",
			name: "transactionRecords",
			component: () => import("/@/views/wallet/transactionRecords/transactionRecords.vue"),
			meta: {
				title: $.t("wallet['交易记录']"),
				icon: "transactionRecords",
				active_icon: "transactionRecords_active",
			},
		},
		{
			path: "/bettingRecords",
			name: "bettingRecords",
			component: () => import("/@/views/wallet/bettingRecords/bettingRecords.vue"),
			meta: {
				title: $.t("wallet['投注纪录']"),
				icon: "bettingRecords",
				active_icon: "bettingRecords_active",
			},
		},
		{
			path: "/welfareCenter",
			name: "welfareCenter",
			component: () => import("/@/views/wallet/welfareCenter/welfareCenter.vue"),
			meta: {
				title: $.t("wallet['福利中心']"),
				icon: "welfareCenter",
				active_icon: "welfareCenter_active",
			},
		},
	],
};
export default walletLayout;
