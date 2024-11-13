import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { lotteryApi } from "/@/api/lottery";
import { useUserStore } from "/@/stores/modules/user";
import { DEFAULT_LANG, isSmp, langMaps } from "/@/views/lottery/constant/index";
import { type LotteryList, type MergedLotteryList } from "/@/views/lottery/types/index";
import { mergeLotteryList } from "/@/views/lottery/utils/mergeLotteryList";
import { ssqLotteryList } from "/@/views/lottery/utils/ssqLotteryList";
import { LotteryPlayGroup } from "/@/views/lottery/types/lottery";

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

		/**
		 * @author Hida
		 * @description 处理普通彩种与特殊彩种数据
		 * @param {string} gameCode 彩种代码
		 * @param {LotteryPlayGroup[]} lotteryList 彩种玩法列表
		 * @param {any} res.data 接口返回的玩法数据
		 */
		// 目前只对 双色球 和 pk 10 相关彩种做处理
		const codes = ["FCSSQ", "HTSSQ", "3FSSQ", "5FSSQ", "FSSQ", "MYPK10", "3FPK10", "5FPK10"];
		const isGameCode = codes.includes(gameCode as string);
		if (isGameCode) {
			mergedLotteryList.value = ssqLotteryList(lotteryList as LotteryPlayGroup[], res.data) as MergedLotteryList;
		} else {
			mergedLotteryList.value = mergeLotteryList(lotteryList, res.data) as MergedLotteryList;
		}
		console.log(mergedLotteryList.value, "=====mergedLotteryList");
	}

	onMounted(queryGamePlayOddsList);

	return { mergedLotteryList };
}
