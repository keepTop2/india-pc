import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { merge, map, filter, find, cloneDeep, get } from "lodash-es";
import { Market } from "/@/views/sports/models/interface";
import { formattingSportArrayData, formattingMarkets } from "/@/views/sports/utils/formattingViewData";
import { openSingleSportEventSource } from "/@/views/sports/utils/sseServe";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
import { SportControlEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { ControlListType } from "/@/views/sports/models/sportResultModel";

type RecodeType = {
	event: Market;
	events: Market[];
	markets: Market[];
};

export const useSportRightTool = () => {
	const SportsInfoStore = useSportsInfoStore();
	const SportHotStore = useSportHotStore();

	const recode = reactive<RecodeType>({
		event: {} as Market,
		events: [],
		markets: [],
	});

	const sportSourceEvents = ref();
	const sportSourceMarkets = ref();

	/**
	 * 序列化单个 event
	 */
	const formatEvents = (events: any) => {
		const { add, change, remove } = events;
		console.log(events, 999999999);

		if (add.length) {
			recode.event = add[0];
			SportHotStore.updateCurrentEvent(add[0]);
		}
		if (change.length) {
			recode.event = merge(recode.event, change[0]);
			SportHotStore.updateCurrentEvent(change[0]);
		}
		if (remove.length) {
			// 替换赛事
			SportHotStore.removeCurrentEvent(remove[0]);
		}
	};

	/**
	 * 数据处理
	 */
	const replaceList = (oldList: any[], newList: any[], type: "add" | "change") => {
		const newListMarkId = map(newList, "marketId");
		if (type === "add") {
			// remove
			const filterOldList = filter(oldList, (item) => !newListMarkId.includes(item.marketId));
			return filterOldList.concat(newList);
		}

		return map(oldList, (item) => {
			if (newListMarkId.includes(item.id)) {
				const findItem = find(newList, { marketId: item.id });
				return merge({}, item, findItem);
			}
			return item;
		});
	};

	/**
	 * 序列化Markets数据
	 */
	const formatMarkets = (markets: any) => {
		const { add, change, remove } = markets;
		if (add.length) {
			// recode.markets = unionBy(recode.markets, add, "marketId");
			recode.markets = replaceList(recode.markets, add, "add");
		}
		if (change.length) {
			// recode.markets = unionBy(recode.markets, change, "marketId");
			recode.markets = replaceList(recode.markets, change, "change");
		}
		if (remove.length) {
			const oldMarkets = cloneDeep(recode.markets);
			for (let i = 0; i < remove.length; i++) {
				const index = oldMarkets.findIndex((event) => event?.marketId === remove[i]);
				recode.markets.splice(index, 1);
			}
		}
		return recode.markets;
	};

	/**
	 * @description: 设置格式化后的数据
	 * @return {*}
	 */
	const setFormatEvent = () => {
		const resParams = {
			event: recode.event,
			markets: recode.markets,
		};

		return formattingSportArrayData([resParams])[0];
	};

	/**
	 * @description: 单个event 数据对象；
	 * @return {*}
	 */
	const initDataEvent = (): void => {
		const { currentEventInfo } = storeToRefs(SportHotStore);

		const params = {
			sportPushApi: "GetEvents",
			webToPushApi: "",
			apiUrl: SportsCommonFn.getSportPushApiUrl(),
			token: SportsInfoStore.getSportsToken,
			language: SportsCommonFn.getSportLanguage(),
			params: {
				query: `$filter= eventId in (${get(currentEventInfo.value, "eventId")})&$orderby=globalShowTime asc `,
			},
		};

		if (sportSourceEvents.value) {
			sportSourceEvents.value?.sourceInstance?.close();
			sportSourceEvents.value = undefined;
		}
		recode.event = {} as any;
		recode.events = [];
		recode.markets = [];

		openSingleSportEventSource(params as any).then((e) => {
			sportSourceEvents.value = e;
			sportSourceEvents.value.sourceInstance.onmessage = ({ data }: any) => {
				let jsonPare;
				try {
					jsonPare = JSON.parse(data);
				} catch (error) {}
				if (jsonPare) {
					// console.info("xxx", jsonPare);
					const { payload } = jsonPare;
					const { events, markets } = payload;

					formatEvents(events);
					const newMarkets = formatMarkets(markets);
					// const formatEvent = setFormatEvent();

					const newFormatEvent = {
						...recode.event,
						markets: formattingMarkets(newMarkets),
					};
					SportHotStore.setFormatEvent(newFormatEvent);
					initDataMarkets();
				}
			};
		});
	};

	/**
	 * @description: 获取详细Markets
	 * @return {*}
	 */
	const initDataMarkets = (): void => {
		const { currentEventInfo } = storeToRefs(SportHotStore);
		const params = {
			sportPushApi: "GetMarkets",
			webToPushApi: "",
			apiUrl: SportsCommonFn.getSportPushApiUrl(),
			token: SportsInfoStore.getSportsToken,
			language: SportsCommonFn.getSportLanguage(),
			params: {
				query: `$filter= eventId eq (${get(currentEventInfo.value, "eventId")})`,
			},
		};
		if (sportSourceMarkets.value) {
			sportSourceMarkets.value?.sourceInstance?.close();
			sportSourceMarkets.value = undefined;
		}
		openSingleSportEventSource(params as any).then((e) => {
			sportSourceMarkets.value = e;
			sportSourceMarkets.value.sourceInstance.onmessage = ({ data }: any) => {
				let jsonPare;
				try {
					jsonPare = JSON.parse(data);
				} catch (error) {}
				if (jsonPare) {
					const { payload } = jsonPare;
					const { events, markets } = payload;
					const newMarkets = formatMarkets(markets);
					// const formatEvent = setFormatEvent();

					const newFormatEvent = {
						...recode.event,
						markets: formattingMarkets(newMarkets),
					};
					SportHotStore.setFormatEvent(newFormatEvent);
				}
			};
		});
	};

	/**
	 * 获取视频播放源的路径
	 */
	const getVideoUrl = (videoStreamingUrl: any): ControlListType[] => {
		const { streamingUrlH5, streamingUrl, streamingUrlCN, streamingUrlNonCN } = videoStreamingUrl ?? [];
		const result = [
			{
				type: SportControlEnum.Info,
				url: "",
			},
		];

		if (streamingUrlH5) {
			result.push({
				type: SportControlEnum.Animation,
				url: streamingUrlH5,
			});
		}

		if (streamingUrl || streamingUrlCN || streamingUrlNonCN) {
			result.push({
				type: SportControlEnum.Video,
				url: streamingUrl || streamingUrlNonCN || streamingUrlCN,
			});
		}
		return result;
	};

	return {
		initDataEvent,
		initDataMarkets,
		getVideoUrl,
	};
};
