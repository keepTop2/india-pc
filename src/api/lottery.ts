import { useUserStore } from "/@/stores/modules/user";
import useAxiosLottery from "/@/utils/useAxiosLottery";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

// 这里这几行代码是为了准备一些公共入参的 lang operatorId isSmp operatorAccount
// 像一些公共的入参，这里直接获取即可。不同的入参从组件中单独传入
const UserStore = useUserStore();
const language = UserStore.getLang;
const langMaps = { "zh-CN": "zh" }; // 做个映射
const lang = (langMaps as any)[language || "zh-CN"];
const isSmp = 1; // 1 双面盘 | 0 标准盘。目前只接双面盘，因此写死 1

export const lotteryApi = {
	/**
	 * @description 查询开盘信息
	 * @param data 的字段举例：{ gameCodes: "5FK3", lang: "zh", gameCategoryCodes: "K3" }
	 */
	beginPageData: (data = {}, headers = {}) => {
		const { merchantInfo } = useLoginGame();
		const { merchantNo: operatorId } = merchantInfo.value;
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
		const { merchantInfo } = useLoginGame();
		const { merchantNo: operatorId } = merchantInfo.value;

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
		const { merchantInfo } = useLoginGame();
		const { merchantNo: operatorId, userAccount: operatorAccount } = merchantInfo.value;
		const submitData = { operatorId, operatorAccount, lang, ...data }; // 写死或者固定的参数，这里统一处理就好了，不用在页面中调用的时候传入。这里的 toekn 是服务端字段就是这么写的
		return useAxiosLottery(`/openApi/v2/Bet/betting`, {
			method: "POST",
			data: submitData,
			headers,
		});
	},
};
