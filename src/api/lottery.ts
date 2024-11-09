import useAxiosLottery from "/@/utils/useAxiosLottery";
import { useUserStore } from "/@/stores/modules/user";

// 这里这几行代码是为了准备一些公共入参的 lang operatorId isSmp operatorAccount token
const userStore = useUserStore();
const language = userStore.getLang;
const langMaps = { "zh-CN": "zh" }; // 做个映射
const lang = (langMaps as any)[language];
const operatorId = "trialMerchant";
const isSmp = 1; // 1 双面盘 | 0 标准盘。目前只接双面盘，因此写死 1
const operatorAccount = "试玩商户";
const token = userStore.getUserInfo.token;

export const lotteryApi = {
	/**
	 * @description 根据 gameCodes 和 gameCategoryCodes 查询彩种详情
	 * @param data 的字段举例：{ gameCodes: "5FK3", lang: "zh", gameCategoryCodes: "K3" }
	 */
	queryGameList: (data = {}, headers = {}) => {
		const submitData = { operatorId, lang, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用
		return useAxiosLottery(`/openApi/v2/game/queryGameList`, {
			method: "POST",
			data: submitData,
			headers,
		});
	},
	/**
	 * @description 根据 gameCode 查询玩法与赔率信息
	 * @param data 的字段举例：{ isSmp: "1", gameCode: "5FK3", lang: "zh" }
	 */
	queryGamePlayOddsList: (data = {}, headers = {}) => {
		const submitData = { lang, isSmp, operatorId, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用的时候传入
		return useAxiosLottery(`/openApi/v2/game/queryGamePlayOddsList`, {
			method: "POST",
			data: submitData,
			headers,
		});
	},
	/**
	 * @description 投注接口
	 * @param
	 */
	betting: (data = {}, headers = {}) => {
		const submitData = { operatorId, operatorAccount, toekn: token, lang, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用的时候传入。这里的 toekn 是服务端字段就是这么写的
		return useAxiosLottery(`/openApi/v2/Bet/betting`, {
			method: "POST",
			data: submitData,
			headers,
		});
	},
};
