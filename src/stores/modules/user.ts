// import { useCookies } from '@vueuse/integrations/useCookies';

import { defineStore } from "pinia";
// import router from '/@/router';
import { setLang } from "/@/i18n/index";
interface StoreUser {
	token: string;
	userInfo: Record<any, any>;
	lang: string; //语言
}

export const useUserStore = defineStore("User", {
	state: (): StoreUser => {
		return {
			lang: "zh",
			token: "",
			userInfo: {},
		};
	},
	getters: {
		getLang(): any {
			console.log(this.lang, "================");
			return this.lang;
		},
		getUserInfo(): any {
			return this.userInfo || {};
		},
	},
	actions: {
		setLang(data: any) {
			this.lang = data;
			setLang(this.lang as any);
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
		storage: sessionStorage,
		paths: ["token", "userInfo", "lang"],
	},
});
