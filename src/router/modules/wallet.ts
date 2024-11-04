// 1号布局
import wallet from "/@/views/wallet/wallet.vue";
import { i18n } from "/@/i18n/index";
import { useUserStore } from "/@/stores/modules/user";
import { useModalStore } from "/@/stores/modules/modalStore";
import showToast from "/@/hooks/useToast";
import { walletApi } from "/@/api/wallet";
import common from "/@/utils/common";
import { nextTick } from "process";
import { toRefs, watchEffect } from "vue";
import { useHaveToken } from "/@/hooks/useHaveToken";
import { useTipsDialog } from "/@/hooks/useTipsDialog";
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
			beforeEnter: (to: any, from: any, next: (bool?: boolean | undefined) => void) => {
				const haveToken = useHaveToken();
				if (!haveToken()) return next(false); // 取消导航
				// const UserStore = useUserStore();
				// const { rechargeWithdrawLimit } = toRefs(UserStore.getUserInfo);
				// // 检查账户是否被锁定
				// if (rechargeWithdrawLimit.value === 1) {
				// 	showToast($.t("wallet['你的账户已被锁定，请联系在线客服']"));
				// 	return next(false);
				// }
				// 继续导航
				next();
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
			beforeEnter: async (to: any, from: any, next: (bool?: boolean | undefined) => void) => {
				const haveToken = useHaveToken();
				if (!haveToken()) return next(false); // 取消导航
				const modalStore = useModalStore();
				const UserStore = useUserStore();
				// const { rechargeWithdrawLimit, withdrawLimit } = toRefs(UserStore.getUserInfo);
				// // 检查账户是否被锁定
				// const isAccountLocked = rechargeWithdrawLimit.value === 1 || withdrawLimit.value === 1;
				// if (isAccountLocked) {
				// 	showToast($.t("wallet['你的账户已被锁定，请联系在线客服']"));
				// 	return next(false);
				// }

				const { isSetPwd, phone } = toRefs(UserStore.getUserGlobalSetInfo);
				// 检查用户是否已设置交易密码或绑定手机号
				const hasUserSetup = isSetPwd?.value || phone?.value;
				if (hasUserSetup) {
					return next();
				} else {
					modalStore.openModal("hintDialog");
					return next(false);
				}
			},
		},
		{
			path: "/accountChangeDetails",
			name: "accountChangeDetails",
			component: () => import("/@/views/wallet/accountChangeDetails/accountChangeDetails.vue"),
			meta: {
				title: "详情",
				secondaryPage: true,
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
