import useAxiosLottery from "/@/utils/useAxiosLottery";
import { useUserStore } from "/@/stores/modules/user";

// 这里这几行代码是为了准备一些公共入参的 lang operatorId isSmp operatorAccount
const UserStore = useUserStore();
const language = UserStore.getLang;
const langMaps = { "zh-CN": "zh" }; // 做个映射
const lang = (langMaps as any)[language];
const operatorId = "cj20203";
const isSmp = 1; // 1 双面盘 | 0 标准盘。目前只接双面盘，因此写死 1
const operatorAccount = "Utest_76920035";

export const lotteryApi = {
	/**
	 * @description 登录第三方拿 token
	 */
	loginGame: (data = {}, headers = { showLoading: false }) => {
		return useAxiosLottery(`/app/third/api/loginGame`, {
			headers,
			method: "POST",
			data,
		});
	},
	/**
	 * @description 查询开盘信息
	 * @param data 的字段举例：{ gameCodes: "5FK3", lang: "zh", gameCategoryCodes: "K3" }
	 */
	beginPageData: (data = {}, headers = {}) => {
		const submitData = { operatorId, lang, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用
		return useAxiosLottery(`/openApi/v2/issue/beginPageData`, {
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
		const submitData = { operatorId, operatorAccount, lang, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用的时候传入。这里的 toekn 是服务端字段就是这么写的
		return useAxiosLottery(`/openApi/v2/Bet/betting`, {
			method: "POST",
			data: submitData,
			headers,
		});
	},
};
