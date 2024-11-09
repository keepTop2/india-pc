import useAxiosLottery from "/@/utils/useAxiosLottery";
import { useUserStore } from "/@/stores/modules/user";

const UserStore = useUserStore();
const language = UserStore.getLang;
const langMaps = { "zh-CN": "zh" }; // 做个映射
const lang = (langMaps as any)[language];

export const lotteryApi = {
	/**
	 * @description 根据 gameCodes 和 gameCategoryCodes 查询彩种详情
	 * @param data 的字段举例：{ gameCodes: "5FK3", lang: "zh", gameCategoryCodes: "K3" }
	 */
	queryGameList: (data = {}, headers = {}) => {
		const formatData = { ...data, lang };
		return useAxiosLottery(`/openApi/v2/game/queryGameList`, {
			method: "POST",
			data: formatData,
			headers,
		});
	},
	/**
	 * @description 根据 gameCode 查询玩法与赔率信息
	 * @param data 的字段举例：{ isSmp: "1", gameCode: "5FK3", lang: "zh" }
	 */
	queryGamePlayOddsList: (data = {}, headers = {}) => {
		const formatData = { ...data, lang, isSmp: 1 }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用的时候传入
		return useAxiosLottery(`/openApi/v2/game/queryGamePlayOddsList`, {
			method: "POST",
			data: formatData,
			headers,
		});
	},
};
