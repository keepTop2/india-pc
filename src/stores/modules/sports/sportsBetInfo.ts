import { defineStore } from "pinia";
export const useSportsBetInfoStore = defineStore("sportsBetInfo", {
	state: () => {
		return {
			balance: "", // 余额信息
			vendorTransId: "", // 注单ID
			singleTicketInfo: {
				minBet: 0,
				maxBet: 0,
				point: undefined,
				payoutRate: 0,
			} as any, // 单关注单信息
			parlayTicketsInfo: {} as any, //串关注单信息
			championSingleTicketInfo: {} as any, //串关注单信息
		};
	},
	getters: {},
	actions: {
		// 新增单关信息
		addSingleTicketInfo(data) {
			this.singleTicketInfo = Object.assign({}, this.singleTicketInfo, data);
		},
		// 新增串关信息
		addParlayTicketsInfo(data) {
			this.parlayTicketsInfo = Object.assign({}, this.parlayTicketsInfo, data);
		},
		// 新增冠军单关
		addChampionSingleTicketInfo(data) {
			this.championSingleTicketInfo = Object.assign({}, this.championSingleTicketInfo, data);
		},
	},
});
