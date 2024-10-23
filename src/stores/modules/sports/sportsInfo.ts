import { defineStore } from "pinia";
interface SportsInfo {
	sportToken: string;
	sportRadioStatus: null | boolean;
}

export const useSportsInfoStore = defineStore("sportsInfo", {
	state: (): SportsInfo => {
		return {
			sportToken: "", // 体育token
			sportRadioStatus: null,
		};
	},
	getters: {
		/**
		 * @description 获取体育token
		 * @returns string
		 */
		getSportsToken(): string {
			return this.sportToken;
		},
		/**
		 * @description 获取体育token
		 * @returns string
		 */
		getSportRadioStatus(): boolean | null {
			return this.sportRadioStatus;
		},
	},

	actions: {
		// 存储体育token
		setSportsToken(token: string) {
			this.sportToken = token;
		},

		// 保存赔率弹窗状态
		setSportRadioStatus() {
			this.sportRadioStatus = true;
		},
	},
	persist: {
		key: "useSportsInfoStore",
		storage: sessionStorage,
		paths: ["sportToken", "sportRadioStatus"],
	},
});
