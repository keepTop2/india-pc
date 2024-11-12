import { defineStore, storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { ref } from "vue";
import { gameApi } from "/@/api/game";
import { useUserStore } from "/@/stores/modules/user"; // 引入用户信息状态

/**
 * @description 这个是基础函数，不会直接导出使用，给下面的 useLoginGame 钩子用的
 */
const useLoginGameStore = defineStore("LoginGameStore", () => {
	const satoken = ref("");
	const route = useRoute();
	const router = useRouter();

	/**
	 * @description 这个函数是每个彩种进入时登录第三方拿 token 的
	 * @param
	 * @returns
	 */
	const loginGame = async () => {
		// 登录第三方拿 token
		const userStore = useUserStore();
		const { token } = userStore.getUserInfo;
		const { venueCode, gameCode } = route.query;

		// 任意一个没有就不发送请求了，跳转回首页去
		if ([venueCode, gameCode, token].find((v) => !v)) {
			router.push("/");
			return;
		}

		const submitData = { venueCode, gameCode };
		const res = await gameApi.loginGame(submitData, { showLoading: false });
		const SEPARATOR = "=";
		const thirdPartyToken = (res.data.source || "").split(SEPARATOR).pop();
		satoken.value = thirdPartyToken;
	};

	return { satoken, loginGame };
});

/**
 * @description 封装一层，组件直接使用 const { satoken, loginGame } = useLoginGame()，不丢失响应
 */
export function useLoginGame() {
	const loginGameStore = useLoginGameStore();
	const { satoken } = storeToRefs(loginGameStore);
	const { loginGame } = loginGameStore;
	return { satoken, loginGame };
}
