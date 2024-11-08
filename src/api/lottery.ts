import useAxiosLottery from "/@/utils/useAxiosLottery";
import { useUserStore } from "/@/stores/modules/user";

const UserStore = useUserStore();
const language = UserStore.getLang;
const langMaps = { "zh-CN": "zh" };
const lang = (langMaps as any)[language];

/**
 * @description 根据 gameCodes 和 gameCategoryCodes 查询彩种详情
 * @param data 的字段举例：{ gameCodes: "MYK3", lang: "zh", gameCategoryCodes: "K3" }
 */
export const lotteryApi = {
	queryGameList: (data = {}, headers = {}) => {
		const formatData = { ...data, lang };
		return useAxiosLottery(`/openApi/v2/game/queryGameList`, {
			method: "POST",
			data: formatData,
			headers,
		});
	},
};
