import { ref } from "vue";
import { useRoute } from "vue-router";
import { useFallBack } from "/@/views/lottery/utils/useFallback";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { DEFAULT_LANG, isSmp, langMaps } from "/@/views/lottery/constant/index";
import { type GameplayList } from "/@/views/lottery/types/index";
import { LotteryPlayGroup } from "/@/views/lottery/types/lottery";
import { mergeGameplayList } from "/@/views/lottery/utils/mergeGameplayList";

export function useGameplayList() {
	const route = useRoute();
	const userStore = useUserStore();

	const gameplayList = ref<GameplayList>([]); // 合并后的玩法列表

	// 拉接口玩法
	async function queryGamePlayOddsList(l1: GameplayList) {
		// 1. 获取 单个彩种的动态的玩法与赔率信息

		// 1.1 准备一下入参 gameCode lang 两个入参
		const { gameCode = "" } = route.query;
		useFallBack(gameCode);
		const language = userStore.getLang;
		const lang = (langMaps as any)[language] || DEFAULT_LANG;
		const submitData = { gameCode, isSmp, lang };

		// 1.2 准备好了，发送请求
		const res = await lotteryApi.queryGamePlayOddsList(submitData);

		/**
		 * @author Hida
		 * @description 处理普通彩种与特殊彩种数据
		 * @param {string} gameCode 彩种代码
		 * @param {LotteryPlayGroup[]} lotteryList 彩种玩法列表
		 * @param {any} res.data 接口返回的玩法数据
		 */

		gameplayList.value = mergeGameplayList(l1, res.data) as GameplayList;
	}

	return { gameplayList, queryGamePlayOddsList };
}
