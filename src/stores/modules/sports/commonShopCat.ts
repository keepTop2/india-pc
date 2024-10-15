import { defineStore } from "pinia";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";

interface AddCarEvent {
	market: any;
	selection: any;
	type: string; //购物车类型，根据冠军路由champion判断，是冠军1，否则0
	data: any;
	isChampionData?: boolean; //是否是冠军接口数据
}

export const useCommonShopCat = defineStore("commonShopCat", {
	actions: {
		// 添加购物车
		addEventToCart({ data, market, selection, type, isChampionData = false }: AddCarEvent) {
			const sportsBetEvent = useSportsBetEventStore();
			const ChampionShopCartStore = useSportsBetChampionStore();

			const { marketId, betType } = market,
				{ key } = selection;

			//冠军页面：ChampionShopCartStore 非冠军：sportsBetEvent
			const isChampion = type == "1";
			const curEvent = isChampion ? ChampionShopCartStore : sportsBetEvent;
			const isHas = curEvent.sportsEventInfo[data.eventId]?.listKye === `${marketId}-${key}`;
			if (isHas) {
				curEvent.removeEventCart(data);
			} else {
				// 储存 赛事ID 投注类型 盘口key
				curEvent.storeEventInfo(data.eventId, {
					marketId: marketId,
					betType: betType,
					selectionKey: key,
				});
				console.log(JSON.parse(JSON.stringify(data)), "JSON.parse(JSON.stringify(data))==");

				// 存储赛事数据在缓存中
				curEvent.addEventToCart(
					JSON.parse(
						JSON.stringify(
							type == "1"
								? {
										type, // 添加冠军标识
										leagueId: data.leagueId,
										sportType: data.sportType,
										isChampionData,
										...data,
										event: {
											...data,
										},
								  }
								: data
						)
					)
				);
			}
		},
		hasEvent() {},
	},
});
