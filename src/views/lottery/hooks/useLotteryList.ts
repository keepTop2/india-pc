import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { DEFAULT_LANG, isSmp, langMaps } from "/@/views/lottery/constant/index";
import { type LotteryList, type MergedLotteryList } from "/@/views/lottery/types/index";
import { mergeLotteryList } from "/@/views/lottery/utils/mergeLotteryList";

export function useLotteryList(lotteryList: LotteryList) {
	const mergedLotteryList = ref<MergedLotteryList>([]); // 合并后的玩法列表
	const route = useRoute();
	const userStore = useUserStore();

	// 拉接口玩法
	async function queryGamePlayOddsList() {
		// 1. 获取 单个彩种的动态的玩法与赔率信息

		// 1.1 准备一下入参 gameCode lang 两个入参
		const { gameCode = "" } = route.query;
		const language = userStore.getLang;
		const lang = (langMaps as any)[language] || DEFAULT_LANG;
		const submitData = { gameCode, isSmp, lang };

		// 1.2 准备好了，发送请求
		const res = await lotteryApi.queryGamePlayOddsList(submitData);
		mergedLotteryList.value = mergeLotteryList(lotteryList, res.data) as MergedLotteryList;
	}

	onMounted(queryGamePlayOddsList);

	return { mergedLotteryList };
}
