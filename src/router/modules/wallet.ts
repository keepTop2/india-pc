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
import { userApi } from "/@/api/user";
import { useRouter, NavigationGuardNext } from "vue-router";
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
			beforeEnter: (to: any, from: any, next: any) => {
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
			beforeEnter: (to: any, from: any, next: (arg0?: boolean) => void) => {
				const haveToken = useHaveToken();
				if (!haveToken()) {
					return next(false); // 如果没有token，取消导航
				}
				const modalStore = useModalStore();
				const UserStore = useUserStore();
				userApi.getUserGlobalSetInfo().then((res) => {
					UserStore.setUserGlobalSetInfo(res.data);
					const { isSetPwd, phone } = toRefs(UserStore.getUserGlobalSetInfo);
					if (!phone.value && !isSetPwd.value) {
						useTipsDialog({
							title: $.t(`wallet["温馨提示"]`),
							text: $.t(`wallet["您还未设置交易密码，请先设置交易密码"]`),
							confirmText: $.t(`wallet["去设置"]`),
							onConfirm: () => {
								modalStore.openModal("setWithdrawPwd");
								next({ path: "/user/security_center" }); // 跳转到设置页面
							},
							onClose: () => {
								useTipsDialog({
									title: $.t(`wallet["温馨提示"]`),
									text: $.t(`wallet["您还未绑定手机号，请先绑定手机号"]`),
									confirmText: $.t(`wallet["去绑定"]`),
									onConfirm: () => {
										modalStore.openModal("setPhone");
										next({ path: "/user/security_center" }); // 跳转到绑定手机号页面
									},
									onClose: () => {
										next(false); // 取消导航
									},
								});
							},
						});
					} else if (phone.value && !isSetPwd.value) {
						useTipsDialog({
							title: $.t(`wallet["温馨提示"]`),
							text: $.t(`wallet["您还未设置交易密码，请先设置交易密码"]`),
							confirmText: $.t(`wallet["去设置"]`),
							onConfirm: () => {
								modalStore.openModal("setWithdrawPwd");
								next({ path: "/user/security_center" }); // 跳转到设置页面
							},
							onClose: () => {
								next(); // 关闭后继续导航
							},
						});
					} else {
						next();
					}
				});

				// 如果没有进入到异步逻辑，说明可以继续导航
			},
		},
		{
			path: "/accountChangeDetails",
			name: "accountChangeDetails",
			component: () => import("/@/views/wallet/accountChangeDetails/accountChangeDetails.vue"),
			meta: {
				title: "详情",
				// LevelOneTitle: "",
				secondaryPage: true,
			},
			// beforeEnter: (to: any, from: any, next: any) => {
			// 	if (from.meta && from.meta.title) {
			// 		const data = {
			// 			LevelOneTitle: from.meta.title as string,
			// 		};
			// 		console.log("data", data);
			// 		const UserStore = useUserStore();
			// 		UserStore.setUserInfo(data);
			// 	}
			// 	next();
			// },
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
				leaveCaches: ["accountChangeDetails"],
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
