import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { gameApi } from "/@/api/game";
import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息状态

interface MerchantInfo {
	merchantNo: string; // 就是入参的 operatorId
	userAccount: string; // 就是入参的 operatorAccount
	source: string; // satoken=xxxxxxxxxxxxxx
	type: string;
	venueCode: string;
}

/**
 * @description 这个是基础函数，不会直接导出使用，给下面的 useLoginGame 钩子用的
 */
const useLoginGameStore = defineStore("LoginGameStore", () => {
	const route = useRoute();
	const router = useRouter();
	const merchantInfo = ref({} as MerchantInfo);

	const satoken = computed(() => {
		const { source = "" } = merchantInfo.value;
		const SEPARATOR = "=";
		return source.split(SEPARATOR).pop();
	});
	/**
	 * @description 这个函数是每个彩种进入时登录第三方拿 token 的
	 * @param
	 * @returns
	 */
	const loginGame = async () => {
		const userStore = useUserStore();
		const { token } = userStore.getUserInfo;
		const { venueCode, gameCode } = route.query;

		// 任意一个没有就不发送请求了，跳转回首页去
		if ([venueCode, gameCode, token].find((v) => !v)) {
			return router.push("/");
		}

		const submitData = { venueCode, gameCode };
		const res = await gameApi.loginGame(submitData, { showLoading: false });
		merchantInfo.value = res.data || {};
	};

	return { satoken, merchantInfo, loginGame };
});

/**
 * @description 封装一层，组件直接使用 const { satoken, merchantInfo, loginGame } = useLoginGame()，不丢失响应
 */
export function useLoginGame() {
	const loginGameStore = useLoginGameStore();
	const { satoken, merchantInfo } = storeToRefs(loginGameStore);
	const { loginGame } = loginGameStore;
	return { satoken, merchantInfo, loginGame };
	// 建议不要使用 ...storeToRefs 这样返回出去，可读性不强
}
