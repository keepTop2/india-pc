// import { useCookies } from '@vueuse/integrations/useCookies';

import { defineStore } from "pinia";

interface StoreUser {
	token: string;
	userInfo: Record<any, any>;
	lang: string; //语言
}

export const useUserStore = defineStore("User", {
	state: (): StoreUser => {
		return {
			lang: "",
			token: "",
			userInfo: {},
		};
	},
	getters: {
		getLang(): any {
			return this.lang;
		},
		getUserInfo(): any {
			return this.userInfo || {};
		},
	},
	actions: {
		setLang(data: any) {
			this.lang = data;
		},
		setInfo(data: any) {
			this.token = data.token;
			this.userInfo = data ? data : {};
		},

		clearInfo() {
			this.token = "";
			this.userInfo = {};
			localStorage.clear();
		},
	},
	persist: {
		key: "useUserStore",
		storage: localStorage,
		paths: ["token", "userInfo", "lang"],
	},
});
