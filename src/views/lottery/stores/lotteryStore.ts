import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { DEFAULT_LANG, langMaps } from "/@/views/lottery/constant/index";
import { useFallBack } from "/@/views/lottery/hooks/useFallback";
import { type LotteryDetail } from "/@/views/lottery/types/index";

/**
 * @description 这个是基础函数，不会直接导出使用，给下面的 useLottery 钩子用的
 */
const useLotteryStore = defineStore("LotteryStore", () => {
	const lotteryDetail = ref({} as LotteryDetail); // 单个彩种的详情，例如期号、名字、多少分钟一期

	const route = useRoute();
	const userStore = useUserStore();

	async function beginPageData() {
		// 3.1 准备一下入参 gameCode lang 两个入参
		const { gameCode = "" } = route.query;
		useFallBack(gameCode);
		const language = userStore.getLang;
		const lang = (langMaps as any)[language] || DEFAULT_LANG;
		const submitData = { gameCode, lang };

		// 3.2 准备好了，发送请求
		const res = await lotteryApi.beginPageData(submitData);
		const resData = (res.data || []).shift() || {}; // 有时候会有两条数据，始终取下标为 0 的那一条数据

		const seconds = Math.floor((resData.endTime - resData.currentTime) / 1000);
		lotteryDetail.value = { ...resData, seconds };
	}

	return { lotteryDetail, beginPageData };
});

/**
 * @description 封装一层，组件直接使用 const { lotteryDetail, beginPageData } = useLoginGame()，不丢失响应
 */
export function useLottery() {
	const lotteryStore = useLotteryStore();
	const { beginPageData } = lotteryStore;
	return { ...storeToRefs(lotteryStore), beginPageData };
}
