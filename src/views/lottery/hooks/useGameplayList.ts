import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { DEFAULT_LANG, isSmp, langMaps } from "/@/views/lottery/constant/index";
import { type GameplayList, type MergedGameplayList } from "/@/views/lottery/types/index";
import { mergeGameplayList } from "/@/views/lottery/utils/mergeGameplayList";

export function useGameplayList(gameplayList: GameplayList) {
	const mergedGameplayList = ref<MergedGameplayList>([]); // 合并后的玩法列表
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
		mergedGameplayList.value = mergeGameplayList(gameplayList, res.data) as MergedGameplayList;
	}

	onMounted(queryGamePlayOddsList);

	return { mergedGameplayList };
}
