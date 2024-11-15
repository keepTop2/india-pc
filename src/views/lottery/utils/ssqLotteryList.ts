import { LotteryPlayGroup, LotteryPlay, LotteryOption } from "../types/lottery";

/**
 * @description 合并静态配置和动态赔率数据
 * @description 特殊玩法(如 rx1)，保持原有结构
 * @description 普通玩法，合并赔率
 * @param {LotteryPlayGroup[]} staticList - 静态配置数据,包含UI展示相关的配置
 * @param {LotteryPlay[]} dynamicList - 动态赔率数据,包含实时赔率等动态数据
 * @returns {LotteryPlayGroup[]} 合并后的数据
 */
export const ssqLotteryList = (staticList: LotteryPlayGroup[], dynamicList: LotteryPlay[]) => {
	console.log("staticList", staticList);
	// 遍历静态配置列表
	return staticList.map((staticItem: LotteryPlayGroup) => {
		// 根据gamePlayCode匹配对应的玩法
		// 一个玩法组可能包含多个gamePlayCode,所以需要filter
		const matchedPlays = dynamicList.filter((item: LotteryPlay) => staticItem.gamePlayCodes.includes(item.gamePlayCode));

		// 处理每个玩法组下的投注选项列表
		const mergedOddsList = staticItem.oddsList.map((staticOdds: LotteryOption) => {
			// 特殊玩法处理(如红球任选一、蓝球选号等)
			if (staticOdds.isSpecialPlay) {
				// 找到对应的特殊玩法数据
				const specialPlay = matchedPlays.find((p: LotteryPlay) => p.gamePlayCode === staticOdds.gamePlayCode);

				if (specialPlay) {
					// 解构出赔率列表和其他属性
					const { oddsList, ...rest } = specialPlay;
					// 合并静态配置和动态数据,保留原有投注项列表结构
					return {
						...rest,
						...staticOdds,
						...(staticOdds.type !== "selectBallLine" ? oddsList[0] : {}),
						oddsList: specialPlay.oddsList.map((odds: LotteryOption) => ({
							...odds,
							actived: false,
						})),
					};
				}
				return staticOdds;
			}

			// 普通玩法处理(如大小单双等)
			// 1. 先找到包含当前optionCode的玩法
			// 2. 再从该玩法中找到对应optionCode的赔率数据
			const matchedOdds = matchedPlays
				.find((play: LotteryPlay) => play.oddsList.some((odds: LotteryOption) => odds.optionCode === staticOdds.optionCode))
				?.oddsList.find((odds: LotteryOption) => odds.optionCode === staticOdds.optionCode);

			// 解构出赔率值和其他属性
			const { itemOdds, ...rest } = matchedOdds || {};

			// 合并静态配置和动态数据
			// 优先使用动态赔率,若无则使用静态配置的默认值
			return {
				...rest,
				...staticOdds,
				itemOdds: matchedOdds?.itemOdds || staticOdds.itemOdds,
			};
		});

		// 返回合并后的玩法组数据
		return {
			...matchedPlays[0], // 基础玩法信息
			...staticItem, // 静态配置信息
			oddsList: mergedOddsList, // 合并后的投注选项列表
		};
	});
};
