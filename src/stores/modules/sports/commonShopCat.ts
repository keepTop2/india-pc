import { defineStore } from "pinia";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";

interface AddCarEvent {
	market: any;
	selection: any;
	type: number; //页面类型，2表示冠军页面
	data: any;
}

export const useCommonShopCat = defineStore("commonShopCat", {
	actions: {
		// 添加购物车
		addEventToCart({ data, market, selection, type }: AddCarEvent) {
			const sportsBetEvent = useSportsBetEventStore();
			const ChampionShopCartStore = useSportsBetChampionStore();

			const { marketId, betType } = market,
				{ key } = selection;

			//冠军页面：ChampionShopCartStore 非冠军：sportsBetEvent
			const isChampion = type === 2;
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
				// 存储赛事数据在缓存中
				curEvent.addEventToCart(JSON.parse(JSON.stringify(data)));
			}
		},
		hasEvent() {},
	},
});
