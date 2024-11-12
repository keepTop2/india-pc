import useAxiosLottery from "/@/utils/useAxiosLottery";

export const lotteryApi = {
	/**
	 * @description 查询开盘信息
	 * @param data 的字段举例：{ gameCodes: "5FK3", lang: "zh" }
	 */
	beginPageData: (data = {}, headers = { showLoading: true }) => {
		return useAxiosLottery(`/openApi/v2/issue/beginPageData`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description 根据 gameCode 查询玩法与赔率信息
	 * @param data 的字段举例 { lang: "zh", isSmp: 1, gameCode: "5FK3" }
	 */
	queryGamePlayOddsList: (data = {}, headers = {}) => {
		return useAxiosLottery(`/openApi/v2/game/queryGamePlayOddsList`, {
			method: "POST",
			data,
			headers,
		});
	},
	/**
	 * @description 投注接口
	 * @param
	 */
	betting: (data = {}, headers = { showLoading: true }) => {
		console.log("data", data);
		console.log("headers", headers);
		return useAxiosLottery(`/openApi/v2/Bet/betting`, {
			method: "POST",
			data,
			headers: { showLoading: true, needLogin: true },
		});
	},
};
